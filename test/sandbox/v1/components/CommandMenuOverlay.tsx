import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { GlassCard } from './GlassCard';

interface CommandMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  activeTab: string;
  expenseSubTab: string;
  setExpenseSubTab: (val: any) => void;
  selectedReturnStatus: string;
  setSelectedReturnStatus: (val: any) => void;
  selectedWarrantyStatus: string;
  setSelectedWarrantyStatus: (val: any) => void;
  commandResults: any[];
  setSelectedReceipt: (receipt: any) => void;
  theme: any;
}

export const CommandMenuOverlay: React.FC<CommandMenuOverlayProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  expenseSubTab,
  setExpenseSubTab,
  selectedReturnStatus,
  setSelectedReturnStatus,
  selectedWarrantyStatus,
  setSelectedWarrantyStatus,
  commandResults,
  setSelectedReceipt,
  theme,
}) => {
  if (!isOpen) return null;

  const CATEGORIES = ['ALL', 'UTILITIES', 'ELECTRONICS', 'DINING', 'SOFTWARE', 'GROCERY', 'APPLIANCES'];

  return (
    <View style={styles.modalBackdrop}>
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes commandMenuSlide {
            from { transform: scale(0.97) translateY(-20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          .cmd-backdrop {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .cmd-container-anim {
            animation: commandMenuSlide 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      )}
      <Pressable 
        style={[styles.backdropBackground, Platform.OS === 'web' && { className: 'cmd-backdrop' } as any]} 
        onPress={onClose} 
      />
      <View style={[styles.commandMenuContainer, Platform.OS === 'web' && { className: 'cmd-container-anim' } as any]}>
        <GlassCard intensity="high" style={[styles.commandMenuCard, { borderColor: theme.glassBorder, backgroundColor: theme.glassBg }]}>
          {/* Search input field */}
          <View style={[styles.commandSearchRow, { borderBottomColor: theme.glassBorder }]}>
            <TextInput
              autoFocus={true}
              style={[styles.commandSearchInput, { color: theme.textPrimary }]}
              placeholder="Type to search registry ledger..."
              placeholderTextColor={theme.textSecondary + '77'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Pressable onPress={onClose} style={styles.commandCloseBtn}>
              <Text style={{ color: theme.textSecondary, fontSize: 10, fontWeight: 'bold' }}>ESC</Text>
            </Pressable>
          </View>

          {/* Spacious Filter Section */}
          <View style={[styles.commandFiltersContainer, { borderBottomColor: theme.glassBorder }]}>
            {/* Category Pills horizontal scroll */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterGroupLabel, { color: theme.textSecondary }]}>FILTER BY CATEGORY</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.filterPillsRow}
              >
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.filterPillBtn,
                        { borderColor: theme.glassBorder },
                        isSelected && { backgroundColor: theme.accent, borderColor: theme.accent }
                      ]}
                    >
                      <Text style={[
                        styles.filterPillText,
                        { color: isSelected ? theme.bgGradStart : theme.textPrimary }
                      ]}>
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Status Tabs per active page type */}
            {activeTab === 'expenses' && (
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupLabel, { color: theme.textSecondary }]}>FILTER BY STATUS</Text>
                <View style={styles.filterPillsRow}>
                  {(['paid', 'unpaid'] as const).map((status) => {
                    const isSelected = expenseSubTab === status;
                    return (
                      <Pressable
                        key={status}
                        onPress={() => setExpenseSubTab(status)}
                        style={[
                          styles.filterPillBtn,
                          { borderColor: theme.glassBorder },
                          isSelected && { backgroundColor: theme.accent, borderColor: theme.accent }
                        ]}
                      >
                        <Text style={[
                          styles.filterPillText,
                          { color: isSelected ? theme.bgGradStart : theme.textPrimary }
                        ]}>
                          {status === 'paid' ? 'VERIFIED (PAID)' : 'PENDING (DUE)'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {activeTab === 'returns' && (
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupLabel, { color: theme.textSecondary }]}>FILTER BY WINDOW STATUS</Text>
                <View style={styles.filterPillsRow}>
                  {(['ALL', 'ACTIVE', 'EXPIRING', 'EXPIRED'] as const).map((status) => {
                    const isSelected = selectedReturnStatus === status;
                    return (
                      <Pressable
                        key={status}
                        onPress={() => setSelectedReturnStatus(status)}
                        style={[
                          styles.filterPillBtn,
                          { borderColor: theme.glassBorder },
                          isSelected && { backgroundColor: theme.accent, borderColor: theme.accent }
                        ]}
                      >
                        <Text style={[
                          styles.filterPillText,
                          { color: isSelected ? theme.bgGradStart : theme.textPrimary }
                        ]}>
                          {status}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {activeTab === 'warranties' && (
              <View style={styles.filterGroup}>
                <Text style={[styles.filterGroupLabel, { color: theme.textSecondary }]}>FILTER BY WARRANTY RANGE</Text>
                <View style={styles.filterPillsRow}>
                  {(['ALL', 'ACTIVE', 'EXPIRING', 'EXPIRED'] as const).map((status) => {
                    const isSelected = selectedWarrantyStatus === status;
                    return (
                      <Pressable
                        key={status}
                        onPress={() => setSelectedWarrantyStatus(status)}
                        style={[
                          styles.filterPillBtn,
                          { borderColor: theme.glassBorder },
                          isSelected && { backgroundColor: theme.accent, borderColor: theme.accent }
                        ]}
                      >
                        <Text style={[
                          styles.filterPillText,
                          { color: isSelected ? theme.bgGradStart : theme.textPrimary }
                        ]}>
                          {status}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Search results */}
          <ScrollView style={{ flex: 1, marginTop: 8 }} showsVerticalScrollIndicator={false} className="custom-scroll">
            <Text style={[styles.commandGroupTitle, { color: theme.textSecondary, marginTop: 4 }]}>REGISTRY INDEX NODES</Text>
            {commandResults.length === 0 ? (
              <Text style={[styles.commandEmptyText, { color: theme.textSecondary }]}>No nodes matching search filter.</Text>
            ) : (
              commandResults.map((r) => (
                <Pressable
                  key={r.id}
                  style={({ hovered }: any) => [
                    styles.commandResultItem,
                    hovered && { backgroundColor: 'rgba(255, 255, 255, 0.03)' }
                  ]}
                  onPress={() => {
                    setSelectedReceipt(r);
                    onClose();
                  }}
                  className="cmd-result-item"
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.commandItemTitle, { color: theme.textPrimary }]}>{r.store_name}</Text>
                    <Text style={[styles.commandItemSub, { color: theme.textSecondary }]}>{r.purchase_date} • {r.category.toLowerCase()}</Text>
                  </View>
                  <Text style={[styles.commandItemValue, { color: theme.accent, fontFamily: 'Share Tech Mono, monospace' }]}>
                    ${r.total_amount.toFixed(2)}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  backdropBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  commandMenuContainer: {
    width: '92%',
    maxWidth: 580,
    height: '75%',
    maxHeight: 580,
    zIndex: 2001,
  },
  commandMenuCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  commandSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  commandSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: {},
    }) as any,
  },
  commandCloseBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  commandGroupTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 8,
    opacity: 0.4,
  },
  commandEmptyText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.6,
  },
  commandResultItem: Platform.select({
    web: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 2,
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
    },
    default: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 2,
    }
  }) as any,
  commandItemTitle: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  commandItemSub: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 2,
  },
  commandItemValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  commandFiltersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    gap: 12,
  },
  filterGroup: {
    gap: 6,
  },
  filterGroupLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    opacity: 0.5,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'all 0.2s ease' },
      default: {},
    }) as any,
  },
  filterPillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
