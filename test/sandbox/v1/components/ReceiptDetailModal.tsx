import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform, ActivityIndicator } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';
import { Receipt } from '@/types/receipt';
import { ThemeStyles, useSandboxSettings } from '@/hooks/use-sandbox-settings';
import { GlassCard } from './GlassCard';
import { 
  TrashIcon,
  PencilIcon,
  CheckIcon,
} from './SVGIcons';
import {
  PendingAlert,
  CountdownTracker,
  ReturnChecklist,
  WarrantyTracker,
  WarrantyClaimWizard,
} from './DetailModalWidgets';
import { styles } from './ReceiptDetailModal.styles';

interface ReceiptDetailModalProps {
  activeTab: string;
  receipt: Receipt;
  theme: ThemeStyles;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (updated: Receipt) => void;
  isInline?: boolean;
}

// Local Custom Icons for Reference Layout
const ReloadIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#000', size = 12 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </Svg>
);

const DocumentIcon: React.FC<{ color?: string; size?: number }> = ({ color = '#e28743', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
  </Svg>
);

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  activeTab,
  receipt,
  theme,
  onClose,
  onDelete,
  onUpdateStatus,
  isInline = false,
}) => {
  const { addSyncLog } = useSandboxSettings();
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Hover states for web UI
  const [editHovered, setEditHovered] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);
  const [keepHovered, setKeepHovered] = useState(false);
  const [returnedHovered, setReturnedHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  // Toggle return panels via the Returned button
  const [showReturnPanel, setShowReturnPanel] = useState(activeTab === 'returns');

  const getReturnDaysLeft = (deadlineStr: string) => {
    const today = new Date('2026-06-04');
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days < 0 ? 'Expired' : `${days} Days`;
  };

  const handleCopyHash = () => {
    if (copied) return;
    setCopied(true);
    addSyncLog(`SYS_CMD: Copied transaction key #${receipt.id.slice(0, 8)} to clipboard.`, 'info');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (downloadProgress !== null || downloadComplete) return;
    setDownloadProgress(0);
    addSyncLog(`SYS_CMD: Compiling original PDF record...`, 'info');
    
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadComplete(true);
          setDownloadProgress(null);
          addSyncLog(`SYS_CMD: Retracted and validated PDF file attachment.`, 'success');
          setTimeout(() => {
            setDownloadComplete(false);
          }, 3000);
          return null;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleKeep = () => {
    addSyncLog(`LEDGER: Record verified and saved. Closing telemetry channel.`, 'success');
    onClose();
  };

  const togglePaymentStatus = () => {
    const nextStatus = !receipt.is_paid;
    onUpdateStatus({
      ...receipt,
      is_paid: nextStatus
    });
    addSyncLog(
      `LEDGER: Invoice #${receipt.id.slice(0, 8)} toggled to ${nextStatus ? 'PAID_SETTLED' : 'UNPAID_PENDING'}.`,
      nextStatus ? 'success' : 'warn'
    );
  };

  const getAvatarGradient = () => {
    const name = receipt.store_name.toLowerCase();
    if (name.includes('apple') || name.includes('electronic')) return ['#8b5cf6', '#3b82f6'];
    if (name.includes('uber') || name.includes('grab')) return ['#10b981', '#059669'];
    if (name.includes('coffee') || name.includes('starbucks')) return ['#eab308', '#d97706'];
    return ['#ec4899', '#f43f5e'];
  };

  const avatarColors = getAvatarGradient();

  const content = (
    <GlassCard 
      intensity="high" 
      bordered={!isInline} 
      style={[
        styles.modalCard, 
        isInline ? { height: '100%', borderRadius: 20, padding: 20 } : {}, 
        { borderColor: theme.glassBorder, backgroundColor: theme.glassBg }
      ]}
    >
      <View style={styles.modalContentMax}>
        {/* iOS drag sheet indicator */}
        {!isInline && (
          <View style={styles.dragHandleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: theme.glassBorder }]} />
          </View>
        )}

        {/* Header Block (Adobe-style mockup) */}
        <View style={[styles.headerRow, Platform.OS === 'web' && { className: 'stagger-item' } as any]}>
          <View style={styles.headerTextCol}>
            <Text style={[styles.topCategoryLabel, { color: theme.accent, fontFamily: 'Share Tech Mono, monospace' }]}>
              {receipt.store_name.toUpperCase()}
            </Text>
            <Text numberOfLines={1} style={[styles.mainTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
              {receipt.items[0]?.name || `${receipt.category} Charge`}
            </Text>
          </View>

          {/* Circular Action Buttons */}
          {!isInline && (
            <View style={styles.headerActionsRow}>
              {/* Edit Button */}
              <Pressable
                onHoverIn={() => setEditHovered(true)}
                onHoverOut={() => setEditHovered(false)}
                style={[
                  styles.circularBtn,
                  { borderColor: theme.glassBorder, backgroundColor: theme.cardBg },
                  editHovered && { transform: [{ scale: 1.05 }], backgroundColor: theme.accentMuted } as any
                ]}
                onPress={() => addSyncLog('SYS_CMD: Edit node form initialized.', 'info')}
              >
                <PencilIcon color={theme.textPrimary} size={11} />
              </Pressable>

              {/* Close Button */}
              <Pressable
                onHoverIn={() => setCloseHovered(true)}
                onHoverOut={() => setCloseHovered(false)}
                style={[
                  styles.circularBtn,
                  { borderColor: theme.glassBorder, backgroundColor: theme.cardBg },
                  closeHovered && { transform: [{ scale: 1.05 }], backgroundColor: 'rgba(255, 62, 0, 0.12)', borderColor: 'rgba(255, 62, 0, 0.2)' } as any
                ]}
                onPress={onClose}
              >
                <Text style={{ color: closeHovered ? '#ff3e00' : theme.textPrimary, fontSize: 11, fontWeight: '700' }}>✕</Text>
              </Pressable>
            </View>
          )}
        </View>

        <ScrollView 
          style={styles.scrollBody} 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 24 }}
          className="custom-scroll"
        >
          {/* Card 1: Purchase Amount (Mockup Banner Card) */}
          <View style={[
            styles.subCard, 
            { borderColor: theme.glassBorder, backgroundColor: theme.cardBg },
            Platform.OS === 'web' && { className: 'stagger-item' } as any
          ]}>
            <View style={styles.rowSpaceBetween}>
              <Text style={[styles.cardLabelTiny, { color: theme.textSecondary }]}>PURCHASE AMOUNT</Text>
              <Text style={[
                styles.largeAmountText, 
                { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }
              ]}>
                ${receipt.total_amount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Card 2: Expense Settlement (Sub-card) */}
          <View style={[
            styles.subCard,
            { borderColor: theme.glassBorder, backgroundColor: theme.cardBg },
            Platform.OS === 'web' && { className: 'stagger-item' } as any
          ]}>
            <View style={styles.settlementHeaderRow}>
              <Text style={[styles.cardLabelTiny, { color: theme.textSecondary }]}>EXPENSE SETTLEMENT</Text>
              
              <Pressable 
                onPress={togglePaymentStatus}
                style={[
                  styles.settlementStatusBadge, 
                  receipt.is_paid 
                    ? { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: '#10b981' } 
                    : { backgroundColor: 'rgba(226, 135, 67, 0.08)', borderColor: '#e28743' }
                ]}
              >
                <Text style={[
                  styles.settlementStatusBadgeText, 
                  { color: receipt.is_paid ? '#10b981' : '#e28743', fontFamily: 'Syne, sans-serif' }
                ]}>
                  {receipt.is_paid ? 'PAID & SETTLED' : 'AWAITING SETTLEMENT'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.keyValList}>
              <View style={styles.keyValRow}>
                <Text style={[styles.keyText, { color: theme.textSecondary }]}>Payment Status</Text>
                <Text style={[styles.valueText, { color: theme.textPrimary }]}>
                  {receipt.is_paid ? 'Cleared via Connected Account' : 'Pending Wire Settlement'}
                </Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={[styles.keyText, { color: theme.textSecondary }]}>Tax Treatment</Text>
                <Text style={[styles.valueText, { color: receipt.is_tax_related ? '#10b981' : theme.textPrimary }]}>
                  {receipt.is_tax_related ? 'Eligible for Write-off (100%)' : 'Non-Taxable Expense'}
                </Text>
              </View>

              <View style={styles.keyValRow}>
                <Text style={[styles.keyText, { color: theme.textSecondary }]}>Expense Type</Text>
                <Text style={[styles.valueText, { color: receipt.is_tax_related ? theme.accent : theme.textPrimary }]}>
                  {receipt.is_tax_related ? 'Business Reimbursement' : 'Personal Expense'}
                </Text>
              </View>
            </View>
          </View>

          {/* Dynamic Panels Insertion point */}
          {(showReturnPanel || activeTab === 'warranties' || !receipt.is_paid) && (
            <View style={Platform.OS === 'web' && { className: 'stagger-item' } as any}>
              {!receipt.is_paid && (
                <PendingAlert 
                  theme={theme}
                  onSimulatePayment={() => {
                    onUpdateStatus({ ...receipt, is_paid: true });
                    addSyncLog(`PAYMENT_SIM: Wire settlement compiled. Node balance cleared.`, 'success');
                  }}
                />
              )}

              {showReturnPanel && (
                <>
                  <CountdownTracker theme={theme} deadline={receipt.return_deadline} />
                  <ReturnChecklist theme={theme} receiptId={receipt.id} addSyncLog={addSyncLog} />
                </>
              )}

              {activeTab === 'warranties' && receipt.warranty_expiry && (
                <>
                  <WarrantyTracker 
                    theme={theme} 
                    purchaseDate={receipt.purchase_date} 
                    expiry={receipt.warranty_expiry} 
                  />
                  <WarrantyClaimWizard 
                    theme={theme} 
                    receiptId={receipt.id} 
                    addSyncLog={addSyncLog} 
                  />
                </>
              )}
            </View>
          )}

          {/* Card Row 3: Expense Details (Left) & Original Document (Right) */}
          <View style={[styles.detailsGridRow, Platform.OS === 'web' && { className: 'stagger-item' } as any]}>
            {/* Left: Details */}
            <View style={[styles.gridCardHalf, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg }]}>
              <Text style={[styles.gridCardTitle, { color: theme.textSecondary }]}>EXPENSE DETAILS</Text>
              
              <View style={styles.gridItemsList}>
                <View style={styles.gridItemRow}>
                  <Text style={[styles.gridItemLabel, { color: theme.textSecondary }]}>Category</Text>
                  <Text style={[styles.gridItemValue, { color: theme.textPrimary }]}>{receipt.category}</Text>
                </View>

                <View style={styles.gridItemRow}>
                  <Text style={[styles.gridItemLabel, { color: theme.textSecondary }]}>Status</Text>
                  <Text style={[styles.gridItemValue, { color: '#10b981' }]}>ACTIVE</Text>
                </View>

                <View style={styles.gridItemRow}>
                  <Text style={[styles.gridItemLabel, { color: theme.textSecondary }]}>Tax Write-off</Text>
                  <Text style={[styles.gridItemValue, { color: receipt.is_tax_related ? '#10b981' : theme.textPrimary }]}>
                    {receipt.is_tax_related ? 'Eligible' : 'None'}
                  </Text>
                </View>

                <View style={styles.gridItemRow}>
                  <Text style={[styles.gridItemLabel, { color: theme.textSecondary }]}>Return Window</Text>
                  <Text style={[styles.gridItemValue, { color: theme.textPrimary }]}>
                    {getReturnDaysLeft(receipt.return_deadline)}
                  </Text>
                </View>

                <View style={[styles.gridItemRow, { marginTop: 4, borderTopWidth: 0.5, borderTopColor: theme.glassBorder, paddingTop: 8 }]}>
                  <View style={{ flex: 1, paddingRight: 4 }}>
                    <Text style={[styles.gridItemLabel, { color: theme.textSecondary, fontSize: 7.5, fontFamily: 'Share Tech Mono, monospace' }]}>REGISTRY SHA HASH</Text>
                    <Text numberOfLines={1} style={{ fontSize: 9, opacity: 0.6, fontFamily: 'Share Tech Mono, monospace', color: theme.textPrimary }}>
                      {receipt.id}
                    </Text>
                  </View>
                  <Pressable 
                    onPress={handleCopyHash}
                    onHoverIn={() => setCopyHovered(true)}
                    onHoverOut={() => setCopyHovered(false)}
                    style={[
                      styles.copyBtn, 
                      { backgroundColor: theme.accentMuted },
                      copyHovered && { backgroundColor: theme.glassBorder } as any
                    ]}
                  >
                    <Text style={[styles.copyBtnText, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
                      {copied ? 'COPIED' : 'COPY'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Right: Document preview */}
            <Pressable 
              onPress={handleDownload}
              onHoverIn={() => setCopyHovered(true)}
              onHoverOut={() => setCopyHovered(false)}
              style={[
                styles.gridCardHalf, 
                { borderColor: theme.glassBorder, backgroundColor: theme.cardBg },
                copyHovered && { transform: [{ scale: 1.02 }], backgroundColor: theme.accentMuted } as any
              ]}
            >
              <Text style={[styles.gridCardTitle, { color: theme.textSecondary }]}>ORIGINAL DOCUMENT</Text>
              
              <View style={styles.documentPreviewBox}>
                <View style={[styles.docIconContainer, { backgroundColor: theme.accentMuted }]}>
                  {downloadProgress !== null ? (
                    <ActivityIndicator size="small" color={theme.accent} />
                  ) : (
                    <DocumentIcon color={theme.accent} size={15} />
                  )}
                </View>
                {receipt.document ? (
                  <>
                    <Text numberOfLines={1} style={[styles.docFileName, { color: theme.textPrimary }]}>
                      {receipt.document.name}
                    </Text>
                    <Text style={[styles.docFileSize, { color: theme.textSecondary }]}>
                      {receipt.document.size}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.docFileName, { color: theme.textSecondary }]}>
                      No Doc Attached
                    </Text>
                    <Text style={[styles.docFileSize, { color: theme.textSecondary }]}>
                      TAP TO DISPATCH
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Sticky Action Footer (Mockup Footer) */}
        <View style={[styles.footerBlock, { borderTopColor: theme.glassBorder }]}>
          <View style={styles.footerInlineRow}>
            {/* Keep button */}
            <Pressable 
              onPress={handleKeep}
              onHoverIn={() => setKeepHovered(true)}
              onHoverOut={() => setKeepHovered(false)}
              style={[
                styles.keepActionBtn, 
                { backgroundColor: '#e65c00' },
                keepHovered && { transform: [{ scale: 1.02 }], backgroundColor: '#cc5200' } as any
              ]}
            >
              <CheckIcon color="#ffffff" size={11} />
              <Text style={styles.keepActionText}>Keep</Text>
            </Pressable>

            {/* Returned button */}
            <Pressable 
              onPress={() => setShowReturnPanel(prev => !prev)}
              onHoverIn={() => setReturnedHovered(true)}
              onHoverOut={() => setReturnedHovered(false)}
              style={[
                styles.returnedActionBtn, 
                { borderColor: theme.glassBorder, backgroundColor: theme.cardBg },
                returnedHovered && { transform: [{ scale: 1.02 }], backgroundColor: theme.accentMuted } as any
              ]}
            >
              <ReloadIcon color={theme.textPrimary} size={11} />
              <Text style={[styles.returnedActionText, { color: theme.textPrimary }]}>Returned</Text>
            </Pressable>
          </View>

          {/* Wide Delete button */}
          <Pressable 
            onPress={() => onDelete(receipt.id)}
            onHoverIn={() => setDeleteHovered(true)}
            onHoverOut={() => setDeleteHovered(false)}
            style={[
              styles.deleteActionBtnWide, 
              { backgroundColor: 'rgba(255, 62, 0, 0.07)', borderColor: 'rgba(255, 62, 0, 0.12)', borderWidth: 1 },
              deleteHovered && { backgroundColor: 'rgba(255, 62, 0, 0.12)', borderColor: '#ff3e00' } as any
            ]}
          >
            <TrashIcon color="#ff3e00" size={11} />
            <Text style={[styles.deleteActionText, { color: '#ff3e00' }]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </GlassCard>
  );

  if (isInline) {
    return content;
  }

  return (
    <View style={styles.modalBackdrop}>
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes backdropFadeIn {
            from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); }
          }
          @keyframes iosSheetSlideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes itemCascade {
            from { transform: translateY(16px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .backdrop-glass-anim {
            animation: backdropFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            background-color: rgba(6, 6, 8, 0.6) !important;
          }
          
          .modal-content-anim {
            width: 100% !important;
            max-width: 100% !important;
            height: 80% !important;
            max-height: 720px !important;
            border-radius: 28px 28px 0 0 !important;
            border: 1px solid var(--glass-border) !important;
            border-bottom: none !important;
            border-left: none !important;
            border-right: none !important;
            box-shadow: 0 -15px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06) !important;
            animation: iosSheetSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            align-self: flex-end !important;
            overflow: hidden !important;
          }
          
          @media (max-width: 768px) {
            .modal-content-anim {
              height: calc(100% - 48px) !important;
              margin-top: 48px !important;
              border-radius: 20px 20px 0 0 !important;
              box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.4) !important;
              animation: iosSheetSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              align-self: flex-end !important;
            }
          }

          .stagger-item {
            animation: itemCascade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .stagger-item:nth-child(1) { animation-delay: 0.05s; }
          .stagger-item:nth-child(2) { animation-delay: 0.12s; }
          .stagger-item:nth-child(3) { animation-delay: 0.18s; }
          .stagger-item:nth-child(4) { animation-delay: 0.24s; }
          .stagger-item:nth-child(5) { animation-delay: 0.30s; }
        `}</style>
      )}

      <Pressable 
        style={[styles.backdropBackground, Platform.OS === 'web' && { className: 'backdrop-glass-anim' } as any]} 
        onPress={onClose} 
      />

      <View style={[styles.modalCenterContainer, Platform.OS === 'web' && { className: 'modal-content-anim' } as any]}>
        {content}
      </View>
    </View>
  );
};
