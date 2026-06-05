import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { GlassCard } from './GlassCard';
import { PremiumReceiptCard } from './PremiumReceiptCard';
import { AlertIcon } from './SVGIcons';
import { QuickActions } from './QuickActions';
import { TaxesWorkspace } from './TaxesWorkspace';
import { InsightsWorkspace } from './InsightsWorkspace';
import { ReturnsWorkspace } from './ReturnsWorkspace';
import { WarrantiesWorkspace } from './WarrantiesWorkspace';
import { Receipt } from '@/types/receipt';

interface LedgerWorkspaceProps {
  isDesktop: boolean;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  expenseSubTab: string;
  setExpenseSubTab: (subTab: any) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedReturnStatus: string;
  setSelectedReturnStatus: (status: any) => void;
  selectedWarrantyStatus: string;
  setSelectedWarrantyStatus: (status: any) => void;
  receipts: Receipt[];
  theme: any;
  totalPaid: number;
  totalUnpaid: number;
  writeoffs: number;
  filteredReceipts: Receipt[];
  openIngestion: (mode: any) => void;
  setSelectedReceipt: (receipt: Receipt | null) => void;
  isSyncing: boolean;
  addSyncLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const LedgerWorkspace: React.FC<LedgerWorkspaceProps> = ({
  isDesktop,
  activeTab,
  setActiveTab,
  expenseSubTab,
  setExpenseSubTab,
  selectedCategory,
  setSelectedCategory,
  selectedReturnStatus,
  setSelectedReturnStatus,
  selectedWarrantyStatus,
  setSelectedWarrantyStatus,
  receipts,
  theme,
  totalPaid,
  totalUnpaid,
  writeoffs,
  filteredReceipts,
  openIngestion,
  setSelectedReceipt,
  isSyncing,
  addSyncLog,
}) => {
  const catScrollRef = useRef<ScrollView | null>(null);
  const CATEGORIES = ['ALL', 'UTILITIES', 'ELECTRONICS', 'DINING', 'SOFTWARE', 'GROCERY', 'APPLIANCES'];

  // Mouse drag-to-scroll horizontal categories on Web desktop (with momentum physics & elastic overscroll bounce)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const scrollEl = (catScrollRef.current as any)?.getScrollableNode?.() || (catScrollRef.current as any);
    if (!scrollEl) return;
    
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let velX = 0;
    let momentumID: number;
    let maxScrollLeft = 0;
    
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      cancelAnimationFrame(momentumID);
      scrollEl.style.transition = 'none';
      startX = e.pageX - scrollEl.offsetLeft;
      scrollLeft = scrollEl.scrollLeft;
      maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
      scrollEl.style.cursor = 'grabbing';
      scrollEl.style.userSelect = 'none';
      scrollEl.style.WebkitUserSelect = 'none';
      velX = 0;
    };
    
    const onMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      scrollEl.style.cursor = 'pointer';
      
      if (scrollEl.style.transform && scrollEl.style.transform !== 'none' && scrollEl.style.transform !== 'translateX(0px)') {
        scrollEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        scrollEl.style.transform = 'translateX(0px)';
      } else {
        beginMomentum();
      }
    };
    
    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      scrollEl.style.cursor = 'pointer';
      scrollEl.style.removeProperty('user-select');
      scrollEl.style.removeProperty('-webkit-user-select');
      
      if (scrollEl.style.transform && scrollEl.style.transform !== 'none' && scrollEl.style.transform !== 'translateX(0px)') {
        scrollEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        scrollEl.style.transform = 'translateX(0px)';
      } else {
        beginMomentum();
      }
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollEl.offsetLeft;
      const walk = (x - startX) * 1.5;
      const targetScroll = scrollLeft - walk;
      const prevScrollLeft = scrollEl.scrollLeft;
      
      if (targetScroll < 0) {
        scrollEl.scrollLeft = 0;
        const overscroll = -targetScroll;
        const damp = Math.min(overscroll / 3.8, 60);
        scrollEl.style.transform = `translateX(${damp}px)`;
        velX = 0;
      } else if (targetScroll > maxScrollLeft) {
        scrollEl.scrollLeft = maxScrollLeft;
        const overscroll = targetScroll - maxScrollLeft;
        const damp = Math.min(overscroll / 3.8, 60);
        scrollEl.style.transform = `translateX(-${damp}px)`;
        velX = 0;
      } else {
        scrollEl.style.transform = 'none';
        scrollEl.scrollLeft = targetScroll;
        velX = scrollEl.scrollLeft - prevScrollLeft;
      }
    };
    
    const beginMomentum = () => {
      cancelAnimationFrame(momentumID);
      const momentumLoop = () => {
        scrollEl.scrollLeft += velX;
        velX *= 0.92;
        
        if (scrollEl.scrollLeft <= 0 && velX < 0) {
          scrollEl.scrollLeft = 0;
          velX = 0;
        } else if (scrollEl.scrollLeft >= maxScrollLeft && velX > 0) {
          scrollEl.scrollLeft = maxScrollLeft;
          velX = 0;
        }
        
        if (Math.abs(velX) > 0.5) {
          momentumID = requestAnimationFrame(momentumLoop);
        }
      };
      momentumLoop();
    };
    
    scrollEl.addEventListener('mousedown', onMouseDown);
    scrollEl.addEventListener('mouseleave', onMouseLeave);
    scrollEl.addEventListener('mouseup', onMouseUp);
    scrollEl.addEventListener('mousemove', onMouseMove);
    scrollEl.style.cursor = 'pointer';
    
    return () => {
      cancelAnimationFrame(momentumID);
      scrollEl.removeEventListener('mousedown', onMouseDown);
      scrollEl.removeEventListener('mouseleave', onMouseLeave);
      scrollEl.removeEventListener('mouseup', onMouseUp);
      scrollEl.removeEventListener('mousemove', onMouseMove);
    };
  }, [activeTab, expenseSubTab]);

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

  // Determine lists filtered by search and category, plus their status sub-tabs
  const expensesList = expenseSubTab === 'paid' 
    ? filteredReceipts.filter(r => r.is_paid !== false)
    : filteredReceipts.filter(r => r.is_paid === false);

  const returnsList = filteredReceipts
    .filter(r => r.is_paid !== false)
    .filter(r => {
      if (selectedReturnStatus === 'ALL') return true;
      if (selectedReturnStatus === 'RETURNABLE') {
        return getReturnStatusHelper(r.return_deadline) !== 'EXPIRED' && r.status !== 'refunded';
      }
      if (selectedReturnStatus === 'KEPT') {
        return getReturnStatusHelper(r.return_deadline) === 'EXPIRED' && r.status !== 'refunded';
      }
      if (selectedReturnStatus === 'REFUNDED') {
        return r.status === 'refunded';
      }
      return true;
    });

  const warrantiesList = filteredReceipts
    .filter(r => r.warranty_expiry !== null)
    .filter(r => {
      if (selectedWarrantyStatus === 'ALL') return true;
      return getWarrantyStatusHelper(r.warranty_expiry) === selectedWarrantyStatus;
    });

  const renderLedgerHeader = (showStatus: boolean) => {
    return (
      <View style={[styles.ledgerCardHeader, { borderBottomColor: theme.glassBorder }]}>
        {/* Category horizontal scroll */}
        <View style={{ height: 36 }}>
          <ScrollView 
            ref={catScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="no-scrollbar"
            contentContainerStyle={styles.catScrollContainer}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`cat-pill-anim ${isSelected ? 'active' : ''}`}
                  style={[
                    styles.catPill,
                    isSelected && { backgroundColor: theme.accentMuted }
                  ]}
                >
                  <Text style={[
                    styles.catText,
                    { color: isSelected ? theme.accent : theme.textSecondary }
                  ]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Tab-specific Status Switcher */}
        {showStatus && (
          <View style={styles.tabSwitcher}>
            {(activeTab === 'returns'
              ? (['ALL', 'RETURNABLE', 'KEPT', 'REFUNDED'] as const)
              : (['ALL', 'ACTIVE', 'EXPIRING', 'EXPIRED'] as const)
            ).map((status) => {
              const isActive = activeTab === 'returns' 
                ? selectedReturnStatus === status 
                : selectedWarrantyStatus === status;
              return (
                <Pressable
                  key={status}
                  style={[
                    styles.switcherBtn,
                    { borderBottomColor: isActive ? theme.accent : 'transparent', borderBottomWidth: 1.5 }
                  ]}
                  onPress={() => {
                    if (activeTab === 'returns') {
                      setSelectedReturnStatus(status as any);
                    } else {
                      setSelectedWarrantyStatus(status as any);
                    }
                  }}
                >
                  <Text style={[styles.switcherText, { color: isActive ? theme.textPrimary : theme.textSecondary }]}>
                    {status}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderVelocityCard = () => {
    return (
      <GlassCard intensity="high" bordered={true} style={[styles.velocityCard, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg }]}>
        <View style={styles.velocityHeader}>
          <Text style={[styles.velocityLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>TOTAL ACTIVE OUTLAY</Text>
          <View style={[styles.topStatusBadge, { borderColor: isSyncing ? '#00e5ff22' : theme.accent + '22', backgroundColor: theme.accentMuted }]}>
            <View style={[styles.topStatusDot, { backgroundColor: isSyncing ? '#00e5ff' : '#10b981' }]} className="pulse-dot-active" />
            <Text style={{ color: isSyncing ? '#00e5ff' : '#10b981', fontSize: 8, fontWeight: '800', fontFamily: 'Share Tech Mono, monospace' }}>
              {isSyncing ? 'SYNCING' : 'SECURED'}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.velocityValue, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
          ${(totalPaid + totalUnpaid).toFixed(2)}
        </Text>
        
        {/* Horizontal progress bar */}
        <View style={{ marginTop: 16 }}>
          <View style={{ height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden', flexDirection: 'row' }}>
            <View style={{ flex: totalPaid || 1, backgroundColor: theme.accent }} />
            <View style={{ width: 1.5, backgroundColor: theme.bgGradStart }} />
            <View style={{ flex: totalUnpaid || 0, backgroundColor: 'rgba(255, 62, 0, 0.4)' }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 9, fontFamily: 'Sora, sans-serif', fontWeight: '600', opacity: 0.6 }}>
              VERIFIED: ${(totalPaid).toFixed(2)}
            </Text>
            <Text style={{ color: '#ff3e00', fontSize: 9, fontFamily: 'Sora, sans-serif', fontWeight: '600', opacity: 0.8 }}>
              PENDING: ${(totalUnpaid).toFixed(2)}
            </Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tab-specific Content */}
      {activeTab === 'home' && (() => {
        const Wrapper = isDesktop ? View : ScrollView;
        const wrapperProps = isDesktop
          ? { style: { flex: 1, minHeight: 0 } as any }
          : { style: { flex: 1 }, showsVerticalScrollIndicator: false, contentContainerStyle: { paddingBottom: 100 } } as any;
        return (
          <Wrapper {...wrapperProps}>
            {renderVelocityCard()}

            {/* Quick Actions Row */}
            <QuickActions 
              theme={theme}
              openIngestion={openIngestion}
              setActiveTab={setActiveTab}
              setSelectedReceipt={setSelectedReceipt}
            />

            {/* Urgent Alerts Notification Bar */}
            {receipts.some(r => r.return_deadline && getReturnStatusHelper(r.return_deadline) === 'EXPIRING') && (
              <GlassCard 
                intensity="low" 
                bordered={true} 
                style={styles.alertBannerCard}
              >
                <View style={styles.alertBannerRow}>
                  <AlertIcon color="#ff3e00" size={14} />
                  <Text style={[styles.alertBannerText, { color: theme.textPrimary, fontFamily: 'Sora, sans-serif' }]}>
                    SYS_ALERT: Expiring return deadlines detected in ledger registry.
                  </Text>
                  <Pressable 
                    onPress={() => {
                      setActiveTab('returns');
                      setSelectedReturnStatus('EXPIRING');
                    }}
                    style={styles.alertViewBtn}
                  >
                    <Text style={{ color: theme.accent, fontSize: 8.5, fontWeight: '800', fontFamily: 'Syne, sans-serif' }}>[ VIEW ]</Text>
                  </Pressable>
                </View>
              </GlassCard>
            )}

            {/* Ledger feeds list wrapped in high-depth GlassCard */}
            <GlassCard intensity="low" bordered={true} style={[styles.workspaceListCard, !isDesktop && { flex: undefined, minHeight: undefined }, { borderColor: theme.glassBorder }]} className="workspace-list-card">
              {renderLedgerHeader(false)}
              <ScrollView 
                scrollEnabled={isDesktop}
                showsVerticalScrollIndicator={false} 
                className="custom-scroll" 
                style={isDesktop ? { flex: 1, minHeight: 0 } : {}}
              >
                {filteredReceipts.length === 0 ? (
                  <View style={styles.emptyFeedBox}>
                    <Text style={{ color: theme.textSecondary, fontFamily: 'Sora, sans-serif', fontSize: 11 }}>No matching registry nodes found.</Text>
                  </View>
                ) : (
                  filteredReceipts.map((r) => (
                    <PremiumReceiptCard
                      key={r.id}
                      receipt={r}
                      theme={theme}
                      onPress={() => setSelectedReceipt(r)}
                      showReturnInfo={true}
                      showWarrantyInfo={true}
                    />
                  ))
                )}
                {isDesktop && <View style={{ height: 40 }} />}
              </ScrollView>
            </GlassCard>
          </Wrapper>
        );
      })()}

      {activeTab === 'expenses' && (() => {
        const showInsights = expenseSubTab === 'insights';
        const Wrapper = (isDesktop || showInsights) ? View : ScrollView;
        const wrapperProps = (isDesktop || showInsights)
          ? { style: { flex: 1 } as any }
          : { style: { flex: 1 }, showsVerticalScrollIndicator: false, contentContainerStyle: { paddingBottom: 100 } } as any;
        return (
          <Wrapper {...wrapperProps}>
            {/* TABS SWITCHER (outside the ledger card) */}
            <View style={[styles.segmentContainerHeader, { borderColor: theme.glassBorder }]}>
              {([
                { id: 'paid', label: 'VERIFIED' },
                { id: 'unpaid', label: 'PENDING' },
                { id: 'insights', label: 'INSIGHTS' }
              ] as const).map((status) => {
                const isSelected = expenseSubTab === status.id;
                return (
                  <Pressable
                    key={status.id}
                    onPress={() => setExpenseSubTab(status.id)}
                    className="segment-btn-anim"
                    style={[
                      styles.segmentBtnHeader,
                      isSelected && { backgroundColor: theme.accentMuted }
                    ]}
                  >
                    <Text style={[
                      styles.segmentTextHeader,
                      { color: isSelected ? theme.accent : theme.textSecondary }
                    ]}>
                      {status.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {expenseSubTab === 'insights' ? (
              <InsightsWorkspace 
                theme={theme}
                totalPaid={totalPaid}
                totalUnpaid={totalUnpaid}
                isDesktop={isDesktop}
                receipts={receipts}
              />
            ) : (
              <>
                {renderVelocityCard()}
                <GlassCard intensity="low" bordered={true} style={[styles.workspaceListCard, !isDesktop && { flex: undefined, minHeight: undefined }, { borderColor: theme.glassBorder }]} className="workspace-list-card">
                  {renderLedgerHeader(false)} {/* renders category scroll only inside card */}
                  <ScrollView 
                    scrollEnabled={isDesktop}
                    showsVerticalScrollIndicator={false} 
                    className="custom-scroll" 
                    style={isDesktop ? { flex: 1, minHeight: 0 } : {}}
                  >
                    {expensesList.length === 0 ? (
                      <View style={styles.emptyFeedBox}>
                        <Text style={{ color: theme.textSecondary, fontFamily: 'Sora, sans-serif', fontSize: 11 }}>No transactions logged.</Text>
                      </View>
                    ) : (
                      expensesList.map((r) => (
                        <PremiumReceiptCard
                          key={r.id}
                          receipt={r}
                          theme={theme}
                          onPress={() => setSelectedReceipt(r)}
                        />
                      ))
                    )}
                    {isDesktop && <View style={{ height: 40 }} />}
                  </ScrollView>
                </GlassCard>
              </>
            )}
          </Wrapper>
        );
      })()}

      {activeTab === 'returns' && (
        <ReturnsWorkspace 
          isDesktop={isDesktop}
          theme={theme}
          returnsList={returnsList}
          setSelectedReceipt={setSelectedReceipt}
          renderLedgerHeader={renderLedgerHeader}
          renderVelocityCard={renderVelocityCard}
        />
      )}

      {activeTab === 'warranties' && (
        <WarrantiesWorkspace 
          isDesktop={isDesktop}
          theme={theme}
          warrantiesList={warrantiesList}
          setSelectedReceipt={setSelectedReceipt}
          renderLedgerHeader={renderLedgerHeader}
          renderVelocityCard={renderVelocityCard}
        />
      )}

      {activeTab === 'taxes' && (
        <TaxesWorkspace 
          theme={theme}
          writeoffs={writeoffs}
          receipts={receipts}
          addSyncLog={addSyncLog}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  velocityCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  velocityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  velocityLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  velocityValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  topStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  topStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  workspaceListCard: {
    flex: 1,
    minHeight: 0,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 8,
  },
  ledgerCardHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  catScrollContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    marginRight: 4,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)' },
      default: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
      },
    }) as any,
  },
  catText: {
    fontSize: 9,
    fontWeight: '700',
  },
  emptyFeedBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBannerCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 62, 0, 0.2)',
    backgroundColor: 'rgba(255, 62, 0, 0.03)',
  },
  alertBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  alertBannerText: {
    fontSize: 9.5,
    fontWeight: '500',
    flex: 1,
  },
  alertViewBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {}
    }) as any,
  },
  segmentContainerHeader: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginBottom: 16,
    gap: 3,
  },
  segmentBtnHeader: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'all 0.2s ease' },
      default: {},
    }) as any,
  },
  segmentTextHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tabIntroText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 14,
  },
  tabSwitcher: {
    flexDirection: 'row',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  switcherBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  switcherText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
