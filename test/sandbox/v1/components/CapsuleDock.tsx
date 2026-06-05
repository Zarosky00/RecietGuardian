import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { GlassCard } from './GlassCard';
import { CommandMenuOverlay } from './CommandMenuOverlay';
import {
  HomeIcon,
  ReceiptIcon,
  ReturnIcon,
  ShieldIcon,
  TaxIcon,
  CogIcon,
  CameraIcon,
  UploadIcon,
  EmailIcon,
  PencilIcon
} from './SVGIcons';

interface CapsuleDockProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isDesktop: boolean;
  theme: any;
  showSettingsDrawer: boolean;
  setShowSettingsDrawer: (val: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  expenseSubTab: string;
  setExpenseSubTab: (val: any) => void;
  selectedReturnStatus: string;
  setSelectedReturnStatus: (val: any) => void;
  selectedWarrantyStatus: string;
  setSelectedWarrantyStatus: (val: any) => void;
  openIngestion: (mode: any) => void;
  commandResults: any[];
  setSelectedReceipt: (receipt: any) => void;
}

export const CapsuleDock: React.FC<CapsuleDockProps> = ({
  activeTab,
  setActiveTab,
  isDesktop,
  theme,
  showSettingsDrawer,
  setShowSettingsDrawer,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  expenseSubTab,
  setExpenseSubTab,
  selectedReturnStatus,
  setSelectedReturnStatus,
  selectedWarrantyStatus,
  setSelectedWarrantyStatus,
  openIngestion,
  commandResults,
  setSelectedReceipt,
}) => {
  const [isDockExpanded, setIsDockExpanded] = useState(false);

  return (
    <>
      <View style={styles.dockWrapper} className="floating-dock-container">
        <GlassCard intensity="high" style={[styles.dockContainer, { borderColor: theme.glassBorder }]} className={`capsule-dock ${isDockExpanded ? 'expanded' : ''}`}>
          {!isDockExpanded ? (
            <View style={styles.dockInnerRow}>
              {/* Home */}
              <Pressable 
                style={[styles.dockNavItem, activeTab === 'home' && styles.dockNavItemActive, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className={`dock-item-pressable ${activeTab === 'home' ? 'active' : ''}`}
                onPress={() => {
                  setActiveTab('home');
                  setSelectedReceipt(null);
                }}
              >
                <HomeIcon color={activeTab === 'home' ? theme.accent : theme.textSecondary} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockNavText, { color: activeTab === 'home' ? theme.textPrimary : theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>HOME</Text>
                )}
              </Pressable>

              {/* Ledger */}
              <Pressable 
                style={[styles.dockNavItem, activeTab === 'expenses' && styles.dockNavItemActive, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className={`dock-item-pressable ${activeTab === 'expenses' ? 'active' : ''}`}
                onPress={() => {
                  setActiveTab('expenses');
                  setSelectedReceipt(null);
                }}
              >
                <ReceiptIcon color={activeTab === 'expenses' ? theme.accent : theme.textSecondary} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockNavText, { color: activeTab === 'expenses' ? theme.textPrimary : theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>LEDGER</Text>
                )}
              </Pressable>

              {/* Refunds */}
              <Pressable 
                style={[styles.dockNavItem, activeTab === 'returns' && styles.dockNavItemActive, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className={`dock-item-pressable ${activeTab === 'returns' ? 'active' : ''}`}
                onPress={() => {
                  setActiveTab('returns');
                  setSelectedReceipt(null);
                }}
              >
                <ReturnIcon color={activeTab === 'returns' ? theme.accent : theme.textSecondary} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockNavText, { color: activeTab === 'returns' ? theme.textPrimary : theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>REFUNDS</Text>
                )}
              </Pressable>

              {/* Warranty */}
              <Pressable 
                style={[styles.dockNavItem, activeTab === 'warranties' && styles.dockNavItemActive, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className={`dock-item-pressable ${activeTab === 'warranties' ? 'active' : ''}`}
                onPress={() => {
                  setActiveTab('warranties');
                  setSelectedReceipt(null);
                }}
              >
                <ShieldIcon color={activeTab === 'warranties' ? theme.accent : theme.textSecondary} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockNavText, { color: activeTab === 'warranties' ? theme.textPrimary : theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>WARRANTY</Text>
                )}
              </Pressable>

              {/* Taxes */}
              <Pressable 
                style={[styles.dockNavItem, activeTab === 'taxes' && styles.dockNavItemActive, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className={`dock-item-pressable ${activeTab === 'taxes' ? 'active' : ''}`}
                onPress={() => {
                  setActiveTab('taxes');
                  setSelectedReceipt(null);
                }}
              >
                <TaxIcon color={activeTab === 'taxes' ? theme.accent : theme.textSecondary} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockNavText, { color: activeTab === 'taxes' ? theme.textPrimary : theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>TAXES</Text>
                )}
              </Pressable>

              <View style={[styles.dockSeparator, { backgroundColor: theme.glassBorder }]} />

              {/* Settings Cog */}
              <Pressable 
                style={styles.dockIconOnlyItem} 
                className="dock-item-icon-only"
                onPress={() => setShowSettingsDrawer(!showSettingsDrawer)}
              >
                <CogIcon color={showSettingsDrawer ? theme.accent : theme.textSecondary} size={18} />
              </Pressable>

              {/* Expanded Action FAB trigger */}
              <Pressable 
                style={[styles.dockFABTrigger, { backgroundColor: theme.accent }]} 
                className="dock-plus-trigger"
                onPress={() => setIsDockExpanded(true)}
              >
                <Text style={[styles.dockFABText, { color: theme.bgGradStart }]}>+</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.dockExpandRow}>
              {/* Scan Camera */}
              <Pressable 
                style={[styles.dockActionItem, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className="dock-action-pressable"
                onPress={() => {
                  openIngestion('camera');
                  setIsDockExpanded(false);
                }}
              >
                <CameraIcon color={theme.accent} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>CAMERA</Text>
                )}
              </Pressable>

              {/* Upload file */}
              <Pressable 
                style={[styles.dockActionItem, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className="dock-action-pressable"
                onPress={() => {
                  openIngestion('upload');
                  setIsDockExpanded(false);
                }}
              >
                <UploadIcon color={theme.accent} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>UPLOAD</Text>
                )}
              </Pressable>

              {/* Email ingest */}
              <Pressable 
                style={[styles.dockActionItem, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className="dock-action-pressable"
                onPress={() => {
                  openIngestion('email');
                  setIsDockExpanded(false);
                }}
              >
                <EmailIcon color={theme.accent} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>EMAIL</Text>
                )}
              </Pressable>

              {/* Manual ingest */}
              <Pressable 
                style={[styles.dockActionItem, { paddingHorizontal: isDesktop ? 16 : 12 }]} 
                className="dock-action-pressable"
                onPress={() => {
                  openIngestion('manual');
                  setIsDockExpanded(false);
                }}
              >
                <PencilIcon color={theme.accent} size={18} />
                {isDesktop && (
                  <Text style={[styles.dockActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>MANUAL</Text>
                )}
              </Pressable>

              <View style={[styles.dockSeparator, { backgroundColor: theme.glassBorder }]} />

              {/* Collapse Trigger */}
              <Pressable 
                style={[styles.dockCloseTrigger, { backgroundColor: theme.textSecondary + '22' }]} 
                className="dock-close-trigger"
                onPress={() => setIsDockExpanded(false)}
              >
                <Text style={{ color: theme.textPrimary, fontSize: 11, fontWeight: 'bold' }}>✕</Text>
              </Pressable>
            </View>
          )}
        </GlassCard>
      </View>

      <CommandMenuOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeTab={activeTab}
        expenseSubTab={expenseSubTab}
        setExpenseSubTab={setExpenseSubTab}
        selectedReturnStatus={selectedReturnStatus}
        setSelectedReturnStatus={setSelectedReturnStatus}
        selectedWarrantyStatus={selectedWarrantyStatus}
        setSelectedWarrantyStatus={setSelectedWarrantyStatus}
        commandResults={commandResults}
        setSelectedReceipt={setSelectedReceipt}
        theme={theme}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dockWrapper: Platform.select({
    web: {
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: 'auto',
      pointerEvents: 'auto',
      alignItems: 'center',
    },
    default: {
      position: 'absolute',
      bottom: 24,
      left: 16,
      right: 16,
      zIndex: 1000,
      alignItems: 'center',
    }
  }) as any,
  dockContainer: {
    height: 74,
    borderRadius: 37,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  dockInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dockNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    gap: 8,
  },
  dockNavItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      }
    }) as any,
  },
  dockNavText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dockSeparator: {
    width: 1,
    height: 28,
    marginHorizontal: 6,
  },
  dockIconOnlyItem: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dockFABTrigger: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  dockFABText: {
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 22,
  },
  dockExpandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dockActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    gap: 8,
  },
  dockActionText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dockCloseTrigger: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
