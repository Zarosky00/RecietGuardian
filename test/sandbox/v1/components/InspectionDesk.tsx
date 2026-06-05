import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { ReceiptDetailModal } from './ReceiptDetailModal';
import { Receipt } from '@/types/receipt';

interface InspectionDeskProps {
  activeTab: string;
  selectedReceipt: Receipt | null;
  setSelectedReceipt: (receipt: Receipt | null) => void;
  theme: any;
  deleteReceipt: (id: string) => void;
  updateReceipt: (receipt: Receipt) => void;
  networkSpeed: string;
  forceError: boolean;
  syncLogs: Array<{ id: string; timestamp: string; message: string; type: string }>;
}

export const InspectionDesk: React.FC<InspectionDeskProps> = ({
  activeTab,
  selectedReceipt,
  setSelectedReceipt,
  theme,
  deleteReceipt,
  updateReceipt,
  networkSpeed,
  forceError,
  syncLogs,
}) => {
  const terminalScrollRef = useRef<ScrollView | null>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollToEnd({ animated: true });
    }
  }, [syncLogs]);

  if (selectedReceipt) {
    return (
      <View style={{ height: '100%', flex: 1 }}>
        <ReceiptDetailModal
          activeTab={activeTab}
          isInline={true}
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
      </View>
    );
  }

  return (
    <View style={styles.hudRightContainer}>
      {/* Monochromatic Blueprint View */}
      <GlassCard intensity="medium" style={[styles.blueprintCard, { borderColor: theme.glassBorder }]}>
        <View style={styles.blueprintGrid} className="blueprint-grid">
          <View style={styles.blueprintHeader}>
            <Text style={[styles.blueprintMonospace, { color: theme.accent, fontFamily: 'Share Tech Mono, monospace' }]}>[ SYSTEM STATUS: ONLINE ]</Text>
            <Text style={[styles.blueprintMonospace, { color: theme.textSecondary, fontFamily: 'Share Tech Mono, monospace' }]}>V_ENCLAVE_2.0</Text>
          </View>
          <View style={styles.blueprintDivider} />
          <View style={styles.blueprintBody}>
            <Text style={[styles.blueprintTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>REGISTRY LEDGER INACTIVE</Text>
            <Text style={[styles.blueprintDescription, { color: theme.textSecondary }]}>
              Awaiting client stream allocation. Choose a transaction index node from the active registry database to map metadata assets, cryptographic credentials, and barcode telemetry.
            </Text>
            <View style={[styles.blueprintStatsBox, { borderColor: theme.glassBorder, backgroundColor: theme.accentMuted }]}>
              <Text style={[styles.blueprintStatLine, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
                ❯ CONNECTION: ACTIVE_ENCLAVE
              </Text>
              <Text style={[styles.blueprintStatLine, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
                ❯ LIMITER: {networkSpeed.toUpperCase()}
              </Text>
              <Text style={[styles.blueprintStatLine, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
                ❯ DB_CRASH_TEST: {forceError ? 'INJECTED_503' : 'PASS_200'}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>

      {/* Live System Log Output terminal */}
      <GlassCard intensity="low" style={[styles.terminalCard, { borderColor: theme.glassBorder }]}>
        <View style={styles.terminalHeader}>
          <Text style={[styles.terminalTitle, { color: theme.accent, fontFamily: 'Syne, sans-serif' }]}>SYSTEM TERMINAL LOG</Text>
          <View style={styles.terminalLightRow}>
            <View style={[styles.terminalMiniDot, { backgroundColor: '#10b981' }]} />
            <Text style={[styles.terminalMiniText, { color: theme.textSecondary }]}>SYNCED</Text>
          </View>
        </View>
        <View style={styles.terminalDivider} />
        <ScrollView 
          className="custom-scroll terminal-log-scroll" 
          style={{ flex: 1 }} 
          showsVerticalScrollIndicator={true}
          ref={terminalScrollRef}
        >
          {syncLogs.map((log) => (
            <View key={log.id} style={styles.logRow}>
              <Text style={styles.logTimestamp}>[{log.timestamp}]</Text>
              <Text style={[
                styles.logMessage, 
                { color: log.type === 'success' ? '#10b981' : log.type === 'warn' ? '#fbbf24' : log.type === 'error' ? '#ff3e00' : theme.textSecondary }
              ]}>
                {log.message}
              </Text>
            </View>
          ))}
        </ScrollView>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  hudRightContainer: {
    flex: 1,
    height: '100%',
    gap: 16,
  },
  blueprintCard: {
    flex: 1.2,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  blueprintGrid: {
    flex: 1,
  },
  blueprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blueprintMonospace: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  blueprintDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 12,
  },
  blueprintBody: {
    flex: 1,
    justifyContent: 'center',
  },
  blueprintTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  blueprintDescription: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  blueprintStatsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  blueprintStatLine: {
    fontSize: 8,
    letterSpacing: 0.2,
  },
  terminalCard: {
    flex: 0.8,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  terminalTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  terminalLightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  terminalMiniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  terminalMiniText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  terminalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginVertical: 10,
  },
  logRow: {
    flexDirection: 'row',
    marginVertical: 2,
    gap: 8,
  },
  logTimestamp: {
    color: '#6366f1',
    fontSize: 9,
    fontFamily: 'Share Tech Mono, monospace',
  },
  logMessage: {
    fontSize: 9,
    flex: 1,
    fontFamily: 'Share Tech Mono, monospace',
    lineHeight: 12,
  },
});
