import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { Receipt } from '@/types/receipt';

interface IngestionCameraViewProps {
  theme: any;
  ocrStatus: 'idle' | 'capturing' | 'scanning' | 'complete';
  setOcrStatus: (status: 'idle' | 'capturing' | 'scanning' | 'complete') => void;
  parsedReceipt: Receipt | null;
  setParsedReceipt: (r: Receipt | null) => void;
  addSyncLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
  onAddReceipt: (r: Receipt) => void;
  onClose: () => void;
}

export const IngestionCameraView: React.FC<IngestionCameraViewProps> = ({
  theme,
  ocrStatus,
  setOcrStatus,
  parsedReceipt,
  setParsedReceipt,
  addSyncLog,
  onAddReceipt,
  onClose,
}) => {
  const runCameraScan = () => {
    setOcrStatus('capturing');
    addSyncLog('SYS_INIT: Activating viewfinder scanning matrix...', 'info');
    
    setTimeout(() => {
      setOcrStatus('scanning');
      addSyncLog('OCR_PROC: Sweeping receipt raster map...', 'info');
      
      setTimeout(() => {
        setOcrStatus('complete');
        addSyncLog('OCR_PROC: Extraction completed. Node validated.', 'success');
        
        const mockParsed: Receipt = {
          id: 'rec-ocr-' + Math.random().toString(36).substring(7),
          store_name: 'TARGET STORES',
          total_amount: 84.20,
          currency: 'USD',
          purchase_date: new Date().toISOString().split('T')[0],
          return_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          warranty_expiry: null,
          status: 'active',
          is_reimbursable: false,
          is_tax_related: false,
          is_paid: true,
          category: 'GROCERY',
          items: [
            { name: 'PAPER TOWELS 12-PACK', price: 22.50, category: 'GENERAL' },
            { name: 'ORGANIC MILK GALLON', price: 6.80, category: 'GROCERY' },
            { name: 'BLUETOOTH EARBUDS V5', price: 54.90, category: 'ELECTRONICS' }
          ],
          document: {
            name: 'camera_capture_receipt.jpg',
            type: 'jpg',
            size: '720 KB',
            url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600&auto=format&fit=crop'
          }
        };
        setParsedReceipt(mockParsed);
      }, 2000);
    }, 800);
  };

  return (
    <View style={styles.scannerWrapper}>
      {ocrStatus === 'idle' && (
        <View style={[styles.viewfinderPlaceholder, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
          <Text style={[styles.scannerHint, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>
            Place receipt directly inside the viewfinder boundary box to launch scanning.
          </Text>
          <Pressable 
            style={[styles.actionBtn, { backgroundColor: theme.accent }]}
            onPress={runCameraScan}
          >
            <Text style={[styles.actionBtnText, { color: theme.bgGradStart, fontFamily: 'Syne, sans-serif' }]}>START SCANNER VIEW</Text>
          </Pressable>
        </View>
      )}

      {(ocrStatus === 'capturing' || ocrStatus === 'scanning') && (
        <View style={[styles.viewfinder, { borderColor: theme.accent }]}>
          {/* Focus corner brackets */}
          <View style={[styles.cornerBracket, styles.bracketTL, { borderColor: theme.accent }]} />
          <View style={[styles.cornerBracket, styles.bracketTR, { borderColor: theme.accent }]} />
          <View style={[styles.cornerBracket, styles.bracketBL, { borderColor: theme.accent }]} />
          <View style={[styles.cornerBracket, styles.bracketBR, { borderColor: theme.accent }]} />
          
          {/* Scanner Grid Overlay */}
          <View style={styles.cropGridHorizontal} />
          <View style={styles.cropGridVertical} />
          <View style={[styles.crosshair, { borderColor: theme.accent + '44' }]} />
          
          {ocrStatus === 'scanning' && (
            <View 
              style={[
                styles.scanLaser, 
                { backgroundColor: theme.accent, boxShadow: `0 0 10px ${theme.accent}` } as any,
                Platform.OS === 'web' ? { className: 'ocr-laser' } : {}
              ]} 
            />
          )}
          
          <Text style={[styles.ocrStatusOverlay, { color: theme.bgGradStart, backgroundColor: theme.accent, fontFamily: 'Syne, sans-serif' }]}>
            {ocrStatus === 'capturing' ? 'CAPTURING HARDWARE LINK...' : 'RUNNING OCR RASTER SWEEP...'}
          </Text>
        </View>
      )}

      {ocrStatus === 'complete' && parsedReceipt && (
        <View style={styles.ocrOutput}>
          <View style={[styles.successBadge, { backgroundColor: theme.accentMuted, borderColor: theme.accent, borderWidth: 1 }]}>
            <Text style={{ color: theme.accent, fontWeight: 'bold', fontFamily: 'Syne, sans-serif', fontSize: 11 }}>✓ SCAN COMPLETE. LEDGER ALIGNED.</Text>
          </View>
          
          <View style={[styles.receiptDraftCard, { borderColor: theme.glassBorder }]}>
            <View style={styles.receiptDraftRow}>
              <Text style={[styles.draftLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>VENDOR</Text>
              <Text style={[styles.draftValue, { color: theme.textPrimary, fontFamily: 'Sora, sans-serif', fontWeight: 'bold' }]}>{parsedReceipt.store_name}</Text>
            </View>
            <View style={styles.receiptDraftRow}>
              <Text style={[styles.draftLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>VALUATION</Text>
              <Text style={[styles.draftValue, { color: theme.accent, fontFamily: 'Share Tech Mono, monospace', fontWeight: 'bold' }]}>
                ${parsedReceipt.total_amount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.receiptDraftRow}>
              <Text style={[styles.draftLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>CATEGORY</Text>
              <Text style={[styles.draftValue, { color: theme.textPrimary, fontFamily: 'Sora, sans-serif' }]}>{parsedReceipt.category}</Text>
            </View>
            
            <Text style={[styles.draftLabel, { color: theme.textSecondary, marginTop: 12, marginBottom: 6, fontFamily: 'Syne, sans-serif', fontWeight: 'bold' }]}>LINE ITEMS ARRAY:</Text>
            {parsedReceipt.items.map((it, idx) => (
              <View key={idx} style={styles.receiptDraftItemRow}>
                <Text style={{ color: theme.textPrimary, fontSize: 10, fontFamily: 'Sora, sans-serif' }}>• {it.name.toLowerCase()}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 10, fontFamily: 'Share Tech Mono, monospace' }}>${it.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionBtnRow}>
            <Pressable 
              style={[styles.halfBtn, { borderColor: theme.glassBorder, borderWidth: 1 }]}
              onPress={() => setOcrStatus('idle')}
            >
              <Text style={{ color: theme.textPrimary, fontFamily: 'Syne, sans-serif', fontSize: 11 }}>RETRY SCAN</Text>
            </Pressable>
            <Pressable 
              style={[styles.halfBtn, { backgroundColor: theme.accent }]}
              onPress={() => {
                onAddReceipt(parsedReceipt);
                onClose();
              }}
            >
              <Text style={{ color: theme.bgGradStart, fontWeight: 'bold', fontFamily: 'Syne, sans-serif', fontSize: 11 }}>SAVE TO VAULT</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scannerWrapper: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewfinderPlaceholder: {
    width: '100%',
    height: 280,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scannerHint: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 20,
    opacity: 0.8,
  },
  actionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  viewfinder: {
    width: '100%',
    height: 280,
    borderWidth: 1,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cornerBracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
  },
  bracketTL: {
    top: 16,
    left: 16,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  bracketTR: {
    top: 16,
    right: 16,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bracketBL: {
    bottom: 16,
    left: 16,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bracketBR: {
    bottom: 16,
    right: 16,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cropGridHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    height: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cropGridVertical: {
    position: 'absolute',
    left: '50%',
    top: 16,
    bottom: 16,
    width: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  scanLaser: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    height: 2,
    zIndex: 10,
  },
  ocrStatusOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ocrOutput: {
    width: '100%',
  },
  successBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  receiptDraftCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  receiptDraftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  draftLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  draftValue: {
    fontSize: 11,
  },
  receiptDraftItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
