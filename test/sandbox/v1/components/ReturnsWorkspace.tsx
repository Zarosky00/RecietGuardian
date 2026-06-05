import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { PremiumReceiptCard } from './PremiumReceiptCard';
import { Receipt } from '@/types/receipt';

interface ReturnsWorkspaceProps {
  isDesktop: boolean;
  theme: any;
  returnsList: Receipt[];
  setSelectedReceipt: (receipt: Receipt | null) => void;
  renderLedgerHeader: (showStatus: boolean) => React.ReactNode;
  renderVelocityCard: () => React.ReactNode;
}

export const ReturnsWorkspace: React.FC<ReturnsWorkspaceProps> = ({
  isDesktop,
  theme,
  returnsList,
  setSelectedReceipt,
  renderLedgerHeader,
  renderVelocityCard,
}) => {
  const Wrapper = isDesktop ? View : ScrollView;
  const wrapperProps = isDesktop
    ? { style: { flex: 1, minHeight: 0 } as any }
    : { style: { flex: 1 }, showsVerticalScrollIndicator: false, contentContainerStyle: { paddingBottom: 100 } } as any;

  return (
    <Wrapper {...wrapperProps}>
      {renderVelocityCard()}
      <Text style={[styles.tabIntroText, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif', marginTop: 4, marginBottom: 8 }]}>
        Monitor refund deadlines and return window status.
      </Text>
      <GlassCard 
        intensity="low" 
        bordered={true} 
        style={[styles.workspaceListCard, !isDesktop && { flex: undefined, minHeight: undefined }, { borderColor: theme.glassBorder }]} 
        className="workspace-list-card"
      >
        {renderLedgerHeader(true)}
        <ScrollView 
          scrollEnabled={isDesktop}
          showsVerticalScrollIndicator={false} 
          className="custom-scroll" 
          style={isDesktop ? { flex: 1, minHeight: 0 } : {}}
        >
          {returnsList.length === 0 ? (
            <View style={styles.emptyFeedBox}>
              <Text style={{ color: theme.textSecondary, fontFamily: 'Sora, sans-serif', fontSize: 11 }}>
                No return items found matching selected filters.
              </Text>
            </View>
          ) : (
            returnsList.map((r) => (
              <PremiumReceiptCard
                key={r.id}
                receipt={r}
                theme={theme}
                onPress={() => setSelectedReceipt(r)}
                showReturnInfo={true}
              />
            ))
          )}
          {isDesktop && <View style={{ height: 40 }} />}
        </ScrollView>
      </GlassCard>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  tabIntroText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 14,
  },
  workspaceListCard: {
    flex: 1,
    minHeight: 0,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 8,
  },
  emptyFeedBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
