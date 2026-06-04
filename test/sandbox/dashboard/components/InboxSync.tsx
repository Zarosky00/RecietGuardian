import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Theme } from './RetroCard';

interface InboxSyncProps {
  onClose: () => void;
  onSyncSuccess: (mockReceipt: any) => void;
  theme: Theme;
}

export default function InboxSync({ onClose, onSyncSuccess, theme }: InboxSyncProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  
  // Waveform animated heights for visual 56k dialup noise
  const wave1 = useRef(new Animated.Value(10)).current;
  const wave2 = useRef(new Animated.Value(25)).current;
  const wave3 = useRef(new Animated.Value(8)).current;
  const wave4 = useRef(new Animated.Value(18)).current;
  const wave5 = useRef(new Animated.Value(12)).current;

  const isDark = theme.mode === 'dark';

  const syncLogs = [
    'ATZ... OK [RESET MODEM]',
    'ATDT GMAIL.GUARDIAN.SERVER:443... [DIALING]',
    'CONNECTING... [CARRIER DETECTED]',
    'HANDSHAKE PROTOCOL: V.90 (56000 BPS)... CONNECTED',
    'INITIALIZING SECURE TLS SESSION... SECURE',
    'GMAIL-AGENT IDENT: zarosky.receipts@gmail.com',
    'SENDING PROTOCOL SIGNATURE... AUTHENTICATED',
    'READING INCOMING GMAIL INBOX STREAM...',
    '  - MESSAGE ID: 18fbd8821a0094e1 ... EXTRACTED',
    '  - SENDER: orders@apextool.com ... MATCHED',
    '  - SUBJECT: Your Apex Tool Purchase Invoice ... PARSING',
    'RUNNING PARSER PIPELINE (GEMINI AI FALLBACK GROQ)...',
    '  - EXTRACTED TOTAL: $532.10',
    '  - EXTRACTED DEADLINE: 2026-05-15 [EXPIRED]',
    '  - SAVED TO GMAIL_LOGS TABLE... ID_OK',
    'UPDATING ACCOUNT LOCAL BALANCE LEDGER...',
    'LEDGER SYNCHRONIZED SUCCESSFULLY.',
    'ATH... DISCONNECT OK',
  ];

  useEffect(() => {
    // Sequentially print logs
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < syncLogs.length) {
        setLogs((prev) => [...prev, syncLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        // Sync complete: add a new receipt to the list
        setTimeout(() => {
          onSyncSuccess({
            id: 'RG-1045',
            merchant: 'Apex Tool Warehouse',
            purchaseDate: '2026-05-01',
            returnDeadline: '2026-05-15',
            totalAmount: 532.10,
            category: 'Hardware',
            orderNumber: 'ORD-300481-APX',
            paymentMethod: 'Visa ending 1089',
            status: 'active',
            isTaxRelated: true,
            isReimbursable: false,
            items: [
              { name: 'Heavy Duty Rotary Hammer Drill', price: 420.00, category: 'Hardware' },
              { name: 'Concrete Drill Bits Set', price: 75.00, category: 'Hardware' },
              { name: 'Premium Heavy Duty Carry Case', price: 37.10, category: 'Hardware' }
            ]
          });
        }, 1200);
      }
    }, 250);

    // Audio waveform animation
    const animateWave = (animValue: Animated.Value, maxVal: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, { toValue: maxVal, duration: Math.random() * 300 + 150, useNativeDriver: false }),
          Animated.timing(animValue, { toValue: 5, duration: Math.random() * 300 + 150, useNativeDriver: false }),
        ])
      ).start();
    };

    animateWave(wave1, 35);
    animateWave(wave2, 45);
    animateWave(wave3, 25);
    animateWave(wave4, 40);
    animateWave(wave5, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [logs]);

  const waveColor = isDark ? '#00ff66' : '#000080';

  return (
    <View 
      style={[
        styles.outerOverlay,
        {
          backgroundColor: theme.bg,
          borderColor: theme.borderColor,
          shadowColor: theme.shadowColor,
          shadowOffset: theme.shadowOffset,
          shadowOpacity: theme.shadowOpacity,
          borderWidth: isDark ? 2 : 2.5,
        }
      ]}
    >
      {/* Title bar header */}
      <View 
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.accentColor,
            borderColor: theme.borderColor,
            borderWidth: isDark ? 1.5 : 2,
          }
        ]}
      >
        <View style={styles.headerTitleContainer}>
          <View style={[styles.controlBox, { backgroundColor: theme.controlBg, borderColor: theme.borderColor }]}>
            <View style={[styles.minusLine, { backgroundColor: theme.textColor }]} />
          </View>
          <Text style={[styles.headerText, { color: isDark ? theme.textColor : '#ffffff' }]}>
            MODEM SYNCHRONIZATION
          </Text>
        </View>
        <Pressable 
          onPress={onClose} 
          style={[
            styles.abortButton,
            {
              backgroundColor: theme.controlBg,
              borderColor: theme.borderColor,
              shadowColor: isDark ? 'transparent' : theme.shadowColor,
            }
          ]}
        >
          <Text style={[styles.abortButtonText, { color: theme.textColor }]}>Abort</Text>
        </Pressable>
      </View>

      {/* Audio Waveform panel on white paper bg */}
      <View 
        style={[
          styles.waveformContainer,
          {
            backgroundColor: isDark ? '#000000' : '#ffffff',
            borderColor: theme.borderColor,
            borderWidth: isDark ? 1.5 : 2,
          }
        ]}
      >
        <View style={styles.waveformLabelContainer}>
          <Text style={[styles.waveformLabel, { color: isDark ? theme.textColorMuted : '#8c8c8c' }]}>
            56K ACOUSTIC CARRIER STREAM
          </Text>
        </View>
        <Animated.View style={[styles.waveBar, { height: wave1, backgroundColor: waveColor }]} />
        <Animated.View style={[styles.waveBar, { height: wave2, backgroundColor: waveColor }]} />
        <Animated.View style={[styles.waveBar, { height: wave3, backgroundColor: waveColor }]} />
        <Animated.View style={[styles.waveBar, { height: wave4, backgroundColor: waveColor }]} />
        <Animated.View style={[styles.waveBar, { height: wave5, backgroundColor: waveColor }]} />
      </View>

      {/* Terminal log panel on white paper bg */}
      <ScrollView
        ref={scrollRef}
        style={[
          styles.logContainer,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor,
          }
        ]}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {logs.map((log, idx) => (
          <Text key={idx} style={[styles.logText, { color: theme.textColor }]}>
            &gt;&gt; {log}
          </Text>
        ))}
      </ScrollView>

      {/* Syncing Status Indicator */}
      <View style={[styles.footerBar, { borderColor: theme.borderColor }]}>
        <Text style={[styles.footerTextLeft, { color: isDark ? theme.textColorMuted : '#595959' }]}>
          TELCO CONNECT: ACTIVE
        </Text>
        <Text style={[styles.footerTextRight, { color: isDark ? theme.textColor : '#008080' }]}>
          DIAL-UP CONNECTING...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 64,
    bottom: 64,
    zIndex: 50,
    padding: 16,
    justifyContent: 'space-between',
    borderRadius: 6,
    shadowRadius: 0,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -16,
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  minusLine: {
    width: 6,
    height: 2,
  },
  headerText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  abortButton: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  abortButtonText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  waveformContainer: {
    height: 80,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 24,
    position: 'relative',
  },
  waveformLabelContainer: {
    position: 'absolute',
    left: 16,
    top: 8,
  },
  waveformLabel: {
    fontFamily: 'monospace',
    fontSize: 7,
    fontWeight: 'bold',
  },
  waveBar: {
    width: 8,
    borderRadius: 4,
  },
  logContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 4,
    padding: 12,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 9,
    lineHeight: 14,
    marginBottom: 4,
  },
  footerBar: {
    marginTop: 16,
    borderTopWidth: 1.5,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTextLeft: {
    fontFamily: 'monospace',
    fontSize: 8,
    fontWeight: 'bold',
  },
  footerTextRight: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
