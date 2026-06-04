import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Theme } from './RetroCard';

interface OCRScannerProps {
  onClose: () => void;
  onScanSuccess: (mockReceipt: any) => void;
  theme: Theme;
}

export default function OCRScanner({ onClose, onScanSuccess, theme }: OCRScannerProps) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  
  const isDark = theme.mode === 'dark';

  const scanLines = [
    'CONNECTING INTEGRATED IMAGE CAPTURE SYSTEM... OK',
    'EXPOSING PHOTO-DIODE ARRAY... DETECTED',
    'CAPTURING EMAIL ORDER CONFIRMATION IN-MEMORY DUMP...',
    'RUNNING INTEL-GEMINI SHAPE ANALYSIS...',
    'LOCATED MERCHANT HEADER: Pear Electronics Corp.',
    'PARSING ITEM MATRIX DATAGRID...',
    '  - ITEM 1: PearBook Pro 14" ($1199.99)',
    '  - ITEM 2: USB-C Multi-Hub Adaptor ($79.99)',
    '  - ITEM 3: Premium Care Protection Plan ($20.00)',
    'TOTAL SUM CHECK: $1299.99 ... MATHEMATICAL MATCH',
    'EXTRACTED TRANSACTION TIMESTAMP: 2026-05-28',
    'CALCULATING RETURN WINDOW DEADLINE: 2026-06-07 [10 DAYS]',
    'DETECTING REIMBURSEMENT TAGS... is_reimbursable = true',
    'DETERMINING TAX APPLICABILITY... is_tax_related = true',
    'INGESTING NEW EXPENSE TO LEDGER...',
    'DB INGESTION COMPLETED WITH STATUS: 201 CREATED',
  ];

  useEffect(() => {
    // Scanline animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Sequentially print logs
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < scanLines.length) {
        setLogs((prev) => [...prev, scanLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        // Automatically close and add mock receipt after log ends
        setTimeout(() => {
          onScanSuccess({
            id: 'RG-' + Math.floor(Math.random() * 900 + 1100),
            merchant: 'Pear Electronics Corp.',
            purchaseDate: '2026-05-28',
            returnDeadline: '2026-06-07',
            totalAmount: 1299.99,
            category: 'Electronics',
            orderNumber: 'ORD-984321-PEAR',
            paymentMethod: 'Amex ending 4002',
            status: 'active',
            isTaxRelated: true,
            isReimbursable: true,
            items: [
              { name: 'PearBook Pro 14"', price: 1199.99, category: 'Electronics' },
              { name: 'USB-C Multi-Hub Adaptor', price: 79.99, category: 'Accessories' },
              { name: 'Premium Care Protection Plan', price: 20.00, category: 'Services' },
            ]
          });
        }, 1200);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [logs]);

  // Translate scanning value (0 to 1) to height percentage
  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160], // corresponds to the height of scanning area
  });

  const laserColor = isDark ? '#00ff66' : '#ff3b30';

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
      {/* Dialogue Header bar */}
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
            OCR INGESTION TASK
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

      {/* Scanning viewports */}
      <View style={[styles.scannerViewport, { borderColor: theme.borderColor, backgroundColor: isDark ? '#000000' : '#030202' }]}>
        {/* Reticle grid */}
        <View style={styles.reticleContainer}>
          <View style={[styles.crosshairH, { backgroundColor: laserColor }]} />
          <View style={[styles.crosshairV, { backgroundColor: laserColor }]} />
          <View style={[styles.reticleCircle, { borderColor: laserColor }]} />
        </View>

        {/* Floating Scan Laser */}
        <Animated.View
          style={[
            styles.laserBeam,
            { 
              transform: [{ translateY }],
              backgroundColor: laserColor,
              shadowColor: laserColor,
            }
          ]}
        />

        {/* Receipt Mock Paper */}
        <View style={[styles.mockReceiptPaper, { backgroundColor: isDark ? '#1e1b18' : '#ffffff', borderColor: isDark ? theme.borderColor : '#595959' }]}>
          <Text style={[styles.receiptHeader, { color: isDark ? theme.textColorMuted : '#595959' }]}>--- INVOICE ---</Text>
          <View style={[styles.receiptLineDivider, { backgroundColor: isDark ? '#00ff6620' : '#e8e8e8' }]} />
          <View style={[styles.receiptMockBlock, { backgroundColor: isDark ? '#0c0a09' : '#f5f5f5' }]} />
          <View style={[styles.receiptMockBlock, { backgroundColor: isDark ? '#0c0a09' : '#f5f5f5' }]} />
          <View style={[styles.receiptMockBlock, { backgroundColor: isDark ? '#0c0a09' : '#f5f5f5' }]} />
          <View style={[styles.receiptPriceBadge, { backgroundColor: isDark ? '#00ff6610' : '#ff4d4f20', borderColor: isDark ? '#00ff6630' : '#ff4d4f50' }]}>
            <Text style={[styles.receiptPriceText, { color: isDark ? theme.textColor : '#cf1322' }]}>$1299.99</Text>
          </View>
          <Text style={[styles.receiptFooter, { color: isDark ? 'rgba(0, 255, 102, 0.3)' : '#bfbfbf' }]}>THANK YOU</Text>
        </View>
      </View>

      {/* Terminal logs printed on notepad bg */}
      <ScrollView
        ref={scrollRef}
        style={[
          styles.logContainer, 
          { 
            backgroundColor: theme.cardBg, 
            borderColor: theme.borderColor,
            shadowColor: isDark ? 'transparent' : 'rgba(0,0,0,0.05)',
          }
        ]}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {logs.map((log, idx) => (
          <Text key={idx} style={[styles.logText, { color: theme.textColor }]}>
            &gt; {log}
          </Text>
        ))}
      </ScrollView>

      {/* Footer loading status */}
      <View style={[styles.footerBar, { borderColor: theme.borderColor }]}>
        <Text style={[styles.footerTextLeft, { color: isDark ? theme.textColorMuted : '#595959' }]}>
          CAMERA PIPE: ONLINE
        </Text>
        <Text style={[styles.footerTextRight, { color: isDark ? theme.textColor : '#cf1322' }]}>
          EXTRACTING TEXT...
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
  scannerViewport: {
    height: 160,
    borderWidth: 2,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairH: {
    width: '100%',
    height: 1,
    position: 'absolute',
  },
  crosshairV: {
    height: '100%',
    width: 1,
    position: 'absolute',
  },
  reticleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  laserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  mockReceiptPaper: {
    width: 96,
    height: 128,
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    alignItems: 'center',
    opacity: 0.9,
    justifyContent: 'space-between',
  },
  receiptHeader: {
    fontSize: 5,
    fontFamily: 'monospace',
  },
  receiptLineDivider: {
    width: '100%',
    height: 1,
  },
  receiptMockBlock: {
    width: '100%',
    height: 4,
    borderRadius: 1,
  },
  receiptPriceBadge: {
    width: '100%',
    height: 14,
    borderRadius: 2,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptPriceText: {
    fontSize: 5,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  receiptFooter: {
    fontSize: 4,
    fontFamily: 'monospace',
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
