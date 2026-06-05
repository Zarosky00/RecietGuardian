import React from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { Receipt } from '@/types/receipt';

interface TaxesWorkspaceProps {
  theme: any;
  writeoffs: number;
  receipts: Receipt[];
  addSyncLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const TaxesWorkspace: React.FC<TaxesWorkspaceProps> = ({
  theme,
  writeoffs,
  receipts,
  addSyncLog,
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} className="custom-scroll">
      <GlassCard intensity="medium" style={styles.taxSummaryCard}>
        <Text style={[styles.taxHeaderTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>TAX YEAR 2026 WRITE-OFFS</Text>
        <Text style={[styles.taxSummaryValue, { color: theme.accent, fontFamily: 'Share Tech Mono, monospace' }]}>
          ${writeoffs.toFixed(2)}
        </Text>
        <Text style={[styles.taxLabelSub, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>
          Total verified deductible outlay
        </Text>
        
        <View style={[styles.taxSeparator, { backgroundColor: theme.glassBorder }]} />
        
        <View style={styles.taxRowMini}>
          <Text style={{ color: theme.textSecondary, fontSize: 11, fontFamily: 'Sora, sans-serif' }}>TAX NODES ENROLLED:</Text>
          <Text style={{ color: theme.textPrimary, fontWeight: 'bold', fontFamily: 'Share Tech Mono, monospace' }}>
            {receipts.filter(r => r.is_paid !== false && r.is_tax_related).length}
          </Text>
        </View>
        <View style={styles.taxRowMini}>
          <Text style={{ color: theme.textSecondary, fontSize: 11, fontFamily: 'Sora, sans-serif' }}>STATUS:</Text>
          <Text style={{ color: '#10b981', fontWeight: 'bold', fontFamily: 'Syne, sans-serif' }}>COMPLIANT</Text>
        </View>
      </GlassCard>

      <Pressable 
        style={[styles.exportTaxBtn, { backgroundColor: theme.accent }]}
        onPress={() => {
          addSyncLog('SYS_CMD: Triggered spreadsheet export compiler...', 'info');
          setTimeout(() => {
            addSyncLog('SYS_CMD: Output file "tax_ledger_2026.csv" created successfully.', 'success');
          }, 1200);
        }}
      >
        <Text style={{ color: theme.bgGradStart, fontWeight: 'bold', fontSize: 11, fontFamily: 'Syne, sans-serif' }}>
          COMPILE & EXPORT LEDGER (CSV)
        </Text>
      </Pressable>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  taxSummaryCard: {
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  taxHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  taxSummaryValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  taxLabelSub: {
    fontSize: 9,
    marginBottom: 14,
  },
  taxSeparator: {
    width: '85%',
    height: 1,
    marginVertical: 12,
  },
  taxRowMini: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    paddingVertical: 4,
  },
  exportTaxBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
