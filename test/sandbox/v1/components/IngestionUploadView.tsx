import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { UploadIcon } from './SVGIcons';
import { Receipt } from '@/types/receipt';

interface IngestionUploadViewProps {
  theme: any;
  addSyncLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
  onAddReceipt: (r: Receipt) => void;
  onClose: () => void;
}

export const IngestionUploadView: React.FC<IngestionUploadViewProps> = ({
  theme,
  addSyncLog,
  onAddReceipt,
  onClose,
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'parsing' | 'complete'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedReceipt, setParsedReceipt] = useState<Receipt | null>(null);

  const runFileUpload = (fileName: string, size: string) => {
    setUploadStatus('uploading');
    setUploadProgress(10);
    addSyncLog(`FILE_INGEST: Uploading ${fileName} (${size})...`, 'info');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('parsing');
          addSyncLog('OCR_PROC: Parsing metadata key-value arrays...', 'info');
          
          setTimeout(() => {
            setUploadStatus('complete');
            addSyncLog('FILE_INGEST: Document parsing success.', 'success');
            
            const mockParsed: Receipt = {
              id: 'rec-upload-' + Math.random().toString(36).substring(7),
              store_name: 'HOME DEPOT',
              total_amount: 322.18,
              currency: 'USD',
              purchase_date: '2026-06-02',
              return_deadline: '2026-09-02',
              warranty_expiry: '2029-06-02',
              status: 'active',
              is_reimbursable: false,
              is_tax_related: true,
              is_paid: true,
              category: 'APPLIANCES',
              items: [
                { name: 'DEWALT 20V DRILL KIT', price: 159.00, category: 'TOOLS' },
                { name: 'SMART WIFI THERMOSTAT', price: 139.00, category: 'APPLIANCES' },
                { name: 'ASSORTED HARDWARE SEC', price: 24.18, category: 'HARDWARE' }
              ],
              document: {
                name: fileName,
                type: fileName.endsWith('.pdf') ? 'pdf' : 'png',
                size: size,
                url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
              }
            };
            setParsedReceipt(mockParsed);
          }, 1200);

          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <View style={styles.scannerWrapper}>
      {uploadStatus === 'idle' && (
        <Pressable 
          style={[styles.uploadZone, { borderColor: theme.accent, backgroundColor: theme.cardBg }]}
          onPress={() => runFileUpload('invoice_bill.pdf', '482 KB')}
        >
          <View style={styles.uploadIconLarge}>
            <UploadIcon color={theme.accent} size={32} />
          </View>
          <Text style={[styles.uploadZoneTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>SELECT INVOICE ARCHIVE</Text>
          <Text style={[styles.uploadZoneSub, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>PDF, PNG or JPG files up to 10MB</Text>
          <View style={[styles.simulateBtn, { borderColor: theme.glassBorder, borderRadius: 10, backgroundColor: theme.glassBg }]}>
            <Text style={{ color: theme.accent, fontSize: 10, fontFamily: 'Syne, sans-serif', fontWeight: 'bold' }}>SIMULATE EXPLORER SELECT</Text>
          </View>
        </Pressable>
      )}

      {(uploadStatus === 'uploading' || uploadStatus === 'parsing') && (
        <View style={styles.uploadProgressWrapper}>
          <Text style={[styles.progressStateText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
            {uploadStatus === 'uploading' ? `UPLOADING RECORD MATRIX: ${uploadProgress}%` : 'CRYPTO PARSING EXTRAC ARRAY...'}
          </Text>
          
          <View style={[styles.progressBarTrack, { backgroundColor: theme.glassBorder }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: uploadStatus === 'uploading' ? `${uploadProgress}%` : '99%',
                  backgroundColor: theme.accent,
                }
              ]} 
            />
          </View>

          <ActivityIndicator size="small" color={theme.accent} style={{ marginTop: 24 }} />
        </View>
      )}

      {uploadStatus === 'complete' && parsedReceipt && (
        <View style={styles.ocrOutput}>
          <View style={[styles.successBadge, { backgroundColor: theme.accentMuted, borderColor: theme.accent, borderWidth: 1 }]}>
            <Text style={{ color: theme.accent, fontWeight: 'bold', fontFamily: 'Syne, sans-serif', fontSize: 11 }}>✓ INVOICE PARSING SUCCESSFUL</Text>
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
            <View style={styles.receiptDraftRow}>
              <Text style={[styles.draftLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>WARRANTY</Text>
              <Text style={[styles.draftValue, { color: theme.textPrimary, fontFamily: 'Sora, sans-serif' }]}>3 Years Protection</Text>
            </View>
            
            <Text style={[styles.draftLabel, { color: theme.textSecondary, marginTop: 12, marginBottom: 6, fontFamily: 'Syne, sans-serif', fontWeight: 'bold' }]}>PARSED ITEMS MATRIX:</Text>
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
              onPress={() => setUploadStatus('idle')}
            >
              <Text style={{ color: theme.textPrimary, fontFamily: 'Syne, sans-serif', fontSize: 11 }}>CANCEL</Text>
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
    alignItems: 'center',
    paddingBottom: 16,
  },
  uploadZone: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 40,
    alignItems: 'center',
  },
  uploadIconLarge: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadZoneTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  uploadZoneSub: {
    fontSize: 9,
    marginBottom: 20,
    opacity: 0.5,
  },
  simulateBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  uploadProgressWrapper: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  progressStateText: {
    fontSize: 10,
    marginBottom: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  ocrOutput: {
    width: '100%',
  },
  successBadge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptDraftCard: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
  },
  receiptDraftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  receiptDraftItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingVertical: 5,
  },
  draftLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  draftValue: {
    fontSize: 11,
  },
  actionBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  halfBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
