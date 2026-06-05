import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SandboxSettingsProvider, useSandboxSettings } from '@/hooks/use-sandbox-settings';
import { useReceipts } from '@/hooks/use-receipts';
import { HeaderBar } from './components/HeaderBar';
import { SettingsDrawer } from './components/SettingsDrawer';
import { LedgerWorkspace } from './components/LedgerWorkspace';
import { InspectionDesk } from './components/InspectionDesk';
import { CapsuleDock } from './components/CapsuleDock';
import { AuroraBackground } from './components/AuroraBackground';
import { IngestionOverlay } from './components/IngestionOverlay';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';
import { Receipt } from '@/types/receipt';

export default function SandboxDashboardContainer() {
  return (
    <SandboxSettingsProvider>
      <SandboxDashboard />
    </SandboxSettingsProvider>
  );
}

type TabType = 'home' | 'expenses' | 'returns' | 'warranties' | 'taxes';
type ExpenseSubTab = 'paid' | 'unpaid' | 'insights';

function SandboxDashboard() {
  const {
    receipts,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    seedDemoData,
    clearAllData,
  } = useReceipts();

  const {
    themeName,
    theme,
    setThemeName,
    networkSpeed,
    setNetworkSpeed,
    forceError,
    setForceError,
    syncLogs,
    addSyncLog,
    isSyncing,
  } = useSandboxSettings();

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [expenseSubTab, setExpenseSubTab] = useState<ExpenseSubTab>('paid');
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [initialIngestionMode, setInitialIngestionMode] = useState<'main' | 'camera' | 'upload' | 'email' | 'manual'>('main');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedReturnStatus, setSelectedReturnStatus] = useState<'ALL' | 'RETURNABLE' | 'KEPT' | 'REFUNDED'>('ALL');
  const [selectedWarrantyStatus, setSelectedWarrantyStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED'>('ALL');

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && windowWidth > 980;

  // Keyboard shortcut CMD+K / Ctrl+K listener for web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helpers to calculate status based on reference date (2026-06-04)
  const getReturnStatusHelper = (deadlineStr: string | null | undefined): 'ACTIVE' | 'EXPIRING' | 'EXPIRED' => {
    if (!deadlineStr) return 'EXPIRED';
    const today = new Date('2026-06-04');
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'EXPIRED';
    if (diffDays <= 7) return 'EXPIRING';
    return 'ACTIVE';
  };

  const getWarrantyStatusHelper = (expiryStr: string | null | undefined): 'ACTIVE' | 'EXPIRING' | 'EXPIRED' => {
    if (!expiryStr) return 'EXPIRED';
    const today = new Date('2026-06-04');
    const expiry = new Date(expiryStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'EXPIRED';
    if (diffDays <= 30) return 'EXPIRING';
    return 'ACTIVE';
  };

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'home': return 'GUARDIAN ADMIN';
      case 'expenses': return 'EXPENSES';
      case 'returns': return 'RETURNS';
      case 'warranties': return 'WARRANTY';
      case 'taxes': return 'TAXES';
      default: return 'GUARDIAN ADMIN';
    }
  };

  const openIngestion = (mode: 'main' | 'camera' | 'upload' | 'email' | 'manual') => {
    setInitialIngestionMode(mode);
    setIsIngestionOpen(true);
  };

  // Calculate outlay metrics
  const totalPaid = receipts
    .filter((r) => r.is_paid !== false)
    .reduce((sum, r) => sum + r.total_amount, 0);

  const totalUnpaid = receipts
    .filter((r) => r.is_paid === false)
    .reduce((sum, r) => sum + r.total_amount, 0);

  const writeoffs = receipts
    .filter((r) => r.is_paid !== false && r.is_tax_related)
    .reduce((sum, r) => sum + r.total_amount, 0);

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = r.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.items && r.items.some(it => it.name.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'ALL' || r.category.toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const commandResults = receipts.filter(r => {
    const matchesSearch = searchQuery === '' || 
      r.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.items && r.items.some(it => it.name.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'ALL' || r.category.toUpperCase() === selectedCategory;
    let matchesStatus = true;
    if (activeTab === 'expenses') {
      if (expenseSubTab === 'paid') matchesStatus = r.is_paid !== false;
      else if (expenseSubTab === 'unpaid') matchesStatus = r.is_paid === false;
    } else if (activeTab === 'returns') {
      matchesStatus = r.is_paid !== false;
      if (selectedReturnStatus !== 'ALL') {
        if (selectedReturnStatus === 'RETURNABLE') {
          matchesStatus = matchesStatus && getReturnStatusHelper(r.return_deadline) !== 'EXPIRED' && r.status !== 'refunded';
        } else if (selectedReturnStatus === 'KEPT') {
          matchesStatus = matchesStatus && getReturnStatusHelper(r.return_deadline) === 'EXPIRED' && r.status !== 'refunded';
        } else if (selectedReturnStatus === 'REFUNDED') {
          matchesStatus = matchesStatus && r.status === 'refunded';
        }
      }
    } else if (activeTab === 'warranties') {
      matchesStatus = r.warranty_expiry !== null;
      if (selectedWarrantyStatus !== 'ALL') {
        matchesStatus = matchesStatus && getWarrantyStatusHelper(r.warranty_expiry) === selectedWarrantyStatus;
      }
    }
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <SafeAreaView style={[styles.outerContainer, { backgroundColor: theme.bgGradStart }]}>
      <AuroraBackground theme={theme} />

      {isDesktop ? (
        <View style={styles.desktopContainer}>
          <View style={styles.desktopGridArea}>
            {/* Left Ledger Registry Desk (60% width) */}
            <View style={styles.desktopLeftPane}>
              <HeaderBar 
                isDesktop={true}
                title={getSectionTitle()}
                isSyncing={isSyncing}
                activeTab={activeTab}
                theme={theme}
                onSearchPress={() => setIsSearchOpen(true)}
              />
              <LedgerWorkspace 
                isDesktop={true}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expenseSubTab={expenseSubTab}
                setExpenseSubTab={setExpenseSubTab}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedReturnStatus={selectedReturnStatus}
                setSelectedReturnStatus={setSelectedReturnStatus}
                selectedWarrantyStatus={selectedWarrantyStatus}
                setSelectedWarrantyStatus={setSelectedWarrantyStatus}
                receipts={receipts}
                theme={theme}
                totalPaid={totalPaid}
                totalUnpaid={totalUnpaid}
                writeoffs={writeoffs}
                filteredReceipts={filteredReceipts}
                openIngestion={openIngestion}
                setSelectedReceipt={setSelectedReceipt}
                isSyncing={isSyncing}
                addSyncLog={addSyncLog}
              />
            </View>

            {/* Right Blueprint Diagnostics Pane (40% width) */}
            <View style={styles.desktopRightPane}>
              <InspectionDesk 
                activeTab={activeTab}
                selectedReceipt={selectedReceipt}
                setSelectedReceipt={setSelectedReceipt}
                theme={theme}
                deleteReceipt={deleteReceipt}
                updateReceipt={updateReceipt}
                networkSpeed={networkSpeed}
                forceError={forceError}
                syncLogs={syncLogs}
              />
            </View>
          </View>

          <CapsuleDock 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDesktop={true}
            theme={theme}
            showSettingsDrawer={showSettingsDrawer}
            setShowSettingsDrawer={setShowSettingsDrawer}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            expenseSubTab={expenseSubTab}
            setExpenseSubTab={setExpenseSubTab}
            selectedReturnStatus={selectedReturnStatus}
            setSelectedReturnStatus={setSelectedReturnStatus}
            selectedWarrantyStatus={selectedWarrantyStatus}
            setSelectedWarrantyStatus={setSelectedWarrantyStatus}
            openIngestion={openIngestion}
            commandResults={commandResults}
            setSelectedReceipt={setSelectedReceipt}
          />

          {showSettingsDrawer && (
            <SettingsDrawer 
              themeName={themeName}
              theme={theme}
              setThemeName={setThemeName}
              networkSpeed={networkSpeed}
              setNetworkSpeed={setNetworkSpeed}
              forceError={forceError}
              setForceError={setForceError}
              clearAllData={clearAllData}
              seedDemoData={seedDemoData}
              onClose={() => setShowSettingsDrawer(false)}
            />
          )}

          <IngestionOverlay 
            isOpen={isIngestionOpen} 
            onClose={() => setIsIngestionOpen(false)} 
            onAddReceipt={addReceipt} 
            initialMode={initialIngestionMode}
          />
        </View>
      ) : (
        <View style={styles.shell}>
          <View style={styles.body}>
            <View style={{ flex: 1, padding: 16 }}>
              <HeaderBar 
                isDesktop={false}
                title={getSectionTitle()}
                isSyncing={isSyncing}
                activeTab={activeTab}
                theme={theme}
                onSearchPress={() => setIsSearchOpen(true)}
              />
              <LedgerWorkspace 
                isDesktop={false}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expenseSubTab={expenseSubTab}
                setExpenseSubTab={setExpenseSubTab}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedReturnStatus={selectedReturnStatus}
                setSelectedReturnStatus={setSelectedReturnStatus}
                selectedWarrantyStatus={selectedWarrantyStatus}
                setSelectedWarrantyStatus={setSelectedWarrantyStatus}
                receipts={receipts}
                theme={theme}
                totalPaid={totalPaid}
                totalUnpaid={totalUnpaid}
                writeoffs={writeoffs}
                filteredReceipts={filteredReceipts}
                openIngestion={openIngestion}
                setSelectedReceipt={setSelectedReceipt}
                isSyncing={isSyncing}
                addSyncLog={addSyncLog}
              />
            </View>
          </View>

          <CapsuleDock 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDesktop={false}
            theme={theme}
            showSettingsDrawer={showSettingsDrawer}
            setShowSettingsDrawer={setShowSettingsDrawer}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            expenseSubTab={expenseSubTab}
            setExpenseSubTab={setExpenseSubTab}
            selectedReturnStatus={selectedReturnStatus}
            setSelectedReturnStatus={setSelectedReturnStatus}
            selectedWarrantyStatus={selectedWarrantyStatus}
            setSelectedWarrantyStatus={setSelectedWarrantyStatus}
            openIngestion={openIngestion}
            commandResults={commandResults}
            setSelectedReceipt={setSelectedReceipt}
          />

          {selectedReceipt && (
            <ReceiptDetailModal
              activeTab={activeTab}
              receipt={selectedReceipt}
              theme={theme}
              onClose={() => setSelectedReceipt(null)}
              onDelete={(id) => {
                deleteReceipt(id);
                setSelectedReceipt(null);
              }}
              onUpdateStatus={(updated) => {
                updateReceipt(updated);
                setSelectedReceipt(updated);
              }}
            />
          )}

          {showSettingsDrawer && (
            <SettingsDrawer 
              themeName={themeName}
              theme={theme}
              setThemeName={setThemeName}
              networkSpeed={networkSpeed}
              setNetworkSpeed={setNetworkSpeed}
              forceError={forceError}
              setForceError={setForceError}
              clearAllData={clearAllData}
              seedDemoData={seedDemoData}
              onClose={() => setShowSettingsDrawer(false)}
              style={{ bottom: 90, top: undefined }}
            />
          )}

          <IngestionOverlay 
            isOpen={isIngestionOpen} 
            onClose={() => setIsIngestionOpen(false)} 
            onAddReceipt={addReceipt} 
            initialMode={initialIngestionMode}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shell: {
    width: '100%',
    maxWidth: 480,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
  },
  desktopContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: 16,
    gap: 16,
    zIndex: 1,
  },
  desktopGridArea: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    height: '100%',
  } as any,
  desktopLeftPane: {
    flex: 1.2,
    height: '100%',
  },
  desktopRightPane: {
    flex: 0.8,
    height: '100%',
  },
});
