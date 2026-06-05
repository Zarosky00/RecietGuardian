import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Platform, ActivityIndicator } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ThemeStyles } from '@/hooks/use-sandbox-settings';
import { AlertIcon, ShieldIcon, CheckIcon, ReturnIcon } from './SVGIcons';

// ==========================================
// 1. Pending Warning Console Widget
// ==========================================
interface PendingAlertProps {
  theme: ThemeStyles;
  onSimulatePayment: () => void;
}

export const PendingAlert: React.FC<PendingAlertProps> = ({ theme, onSimulatePayment }) => {
  const [btnHovered, setBtnHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      onSimulatePayment();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <View style={[styles.pendingConsole, { borderColor: '#e28743', backgroundColor: 'rgba(226, 135, 67, 0.05)' }]}>
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes warningPulse {
            0% { opacity: 0.5; box-shadow: 0 0 4px rgba(226, 135, 67, 0.2); }
            50% { opacity: 1; box-shadow: 0 0 16px rgba(226, 135, 67, 0.6); }
            100% { opacity: 0.5; box-shadow: 0 0 4px rgba(226, 135, 67, 0.2); }
          }
          .warning-pulse {
            animation: warningPulse 1.8s infinite ease-in-out;
          }
        `}</style>
      )}
      <View style={styles.consoleHeader}>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: '#e28743' },
          Platform.OS === 'web' && { className: 'warning-pulse' } as any
        ]} />
        <Text style={[styles.consoleTitle, { color: '#e28743', fontFamily: 'Share Tech Mono, monospace' }]}>
          TELEMETRY STATUS: UNPAID_INVOICE
        </Text>
      </View>
      
      <Text style={[styles.consoleBodyText, { color: theme.textPrimary }]}>
        Security seal disabled. Secure transaction index awaits wire balance settlement to register node parameters.
      </Text>

      <Pressable
        onPress={handlePress}
        disabled={isProcessing}
        onHoverIn={() => setBtnHovered(true)}
        onHoverOut={() => setBtnHovered(false)}
        style={[
          styles.premiumBtn,
          { 
            backgroundColor: 'transparent',
            borderColor: '#e28743',
            borderWidth: 1.5,
          },
          btnHovered && { backgroundColor: 'rgba(226, 135, 67, 0.12)', transform: [{ scale: 1.02 }] } as any
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#e28743" />
        ) : (
          <Text style={[styles.premiumBtnText, { color: '#e28743', fontFamily: 'Share Tech Mono, monospace' }]}>
            SIMULATE WIRE SETTLEMENT
          </Text>
        )}
      </Pressable>
    </View>
  );
};

// ==========================================
// 2. Circular SVG Countdown Gauge for Returns
// ==========================================
interface CountdownTrackerProps {
  theme: ThemeStyles;
  deadline: string;
}

export const CountdownTracker: React.FC<CountdownTrackerProps> = ({ theme, deadline }) => {
  const getReturnDaysLeft = (deadlineStr: string) => {
    const today = new Date('2026-06-04');
    const deadlineDate = new Date(deadlineStr);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getReturnDaysLeft(deadline);
  const isExpired = daysLeft < 0;
  
  const totalDays = 30; // standard 30d window
  const percentage = isExpired ? 0 : Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));

  // SVG configurations for 80px circle
  const size = 90;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.glassWidget, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg }]}>
      <View style={styles.gaugeContainer}>
        <View style={styles.svgWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.glassBorder}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground circle with neon glow on web */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isExpired ? '#ef4444' : theme.accent}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </Svg>
          <View style={styles.gaugeCenterText}>
            <Text style={[
              styles.gaugeNumber, 
              { color: isExpired ? '#ef4444' : theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }
            ]}>
              {isExpired ? '0' : daysLeft}
            </Text>
            <Text style={[styles.gaugeLabel, { color: theme.textSecondary }]}>DAYS</Text>
          </View>
        </View>

        <View style={styles.gaugeInfo}>
          <View style={styles.widgetHeaderInline}>
            <ReturnIcon color={theme.accent} size={13} />
            <Text style={[styles.widgetTitle, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>
              RETURN GAUGING MATRIX
            </Text>
          </View>
          <Text style={[styles.gaugeDesc, { color: theme.textPrimary }]}>
            {isExpired 
              ? 'Return eligibility period has closed.' 
              : `Active window remains open until ${deadline}.`}
          </Text>
          {!isExpired && (
            <Text style={[styles.gaugeSubDesc, { color: theme.textSecondary, fontFamily: 'Share Tech Mono, monospace' }]}>
              {percentage.toFixed(0)}% OF TIME WINDOW REMAINING
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// ==========================================
// 3. Checklist & Scanning Barcode Widget
// ==========================================
interface ReturnChecklistProps {
  theme: ThemeStyles;
  receiptId: string;
  addSyncLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const ReturnChecklist: React.FC<ReturnChecklistProps> = ({ theme, receiptId, addSyncLog }) => {
  const [checklist, setChecklist] = useState({
    packaging: false,
    unused: false,
    accessories: false
  });
  const [barcode, setBarcode] = useState<string | null>(null);
  const [barcodeHovered, setBarcodeHovered] = useState(false);
  const [activeCheckHover, setActiveCheckHover] = useState<string | null>(null);

  const toggleCheck = (key: 'packaging' | 'unused' | 'accessories') => {
    const newVal = !checklist[key];
    setChecklist(prev => ({ ...prev, [key]: newVal }));
    
    const logs = {
      packaging: 'RET_SYS: Item packaging flag verified.',
      unused: 'RET_SYS: Wear-and-tear scan completed.',
      accessories: 'RET_SYS: Accessories presence logged.'
    };
    addSyncLog(logs[key], 'info');
  };

  const handleGenerateBarcode = () => {
    if (barcode) return;
    const code = `RET-${receiptId.slice(0, 8).toUpperCase()}-${Math.floor(Date.now() / 1000)}`;
    setBarcode(code);
    addSyncLog(`RET_SYS: Generated return token authorization: ${code}`, 'success');
  };

  const barcodeBars = [
    2, 4, 1, 3, 1, 2, 4, 2, 1, 3, 4, 2, 1, 2, 3, 1, 4, 2, 2, 1, 3, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4
  ];

  return (
    <View style={[styles.glassWidget, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg }]}>
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes laserVerticalSweep {
            0% { transform: translateY(0); }
            50% { transform: translateY(34px); }
            100% { transform: translateY(0); }
          }
          .laser-line {
            animation: laserVerticalSweep 2.2s infinite ease-in-out;
            box-shadow: 0 0 6px #ff3e00, 0 0 12px #ff3e00;
          }
        `}</style>
      )}
      <Text style={[styles.widgetHeadingText, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>
        RETURN AUTHORIZATION PREPARATION
      </Text>

      <View style={styles.checklistGrid}>
        {[
          { key: 'packaging' as const, label: 'Unbroken original seals / boxing' },
          { key: 'unused' as const, label: 'Zero product wear telemetry' },
          { key: 'accessories' as const, label: 'Secondary component verification' }
        ].map(item => {
          const isChecked = checklist[item.key];
          const isHovered = activeCheckHover === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => toggleCheck(item.key)}
              onHoverIn={() => setActiveCheckHover(item.key)}
              onHoverOut={() => setActiveCheckHover(null)}
              style={[
                styles.checkCard,
                { 
                  borderColor: isChecked ? theme.accent : theme.glassBorder,
                  backgroundColor: isChecked ? theme.accentMuted : 'rgba(0,0,0,0.1)'
                },
                isHovered && { transform: [{ scale: 1.01 }] } as any
              ]}
            >
              <View style={[
                styles.customCheckbox,
                { borderColor: theme.glassBorder },
                isChecked && { backgroundColor: theme.accent, borderColor: theme.accent }
              ]}>
                {isChecked && <CheckIcon color="#fff" size={9} />}
              </View>
              <Text style={[styles.checkCardText, { color: theme.textPrimary }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.spacerLine, { backgroundColor: theme.glassBorder }]} />

      {!barcode ? (
        <Pressable
          onPress={handleGenerateBarcode}
          onHoverIn={() => setBarcodeHovered(true)}
          onHoverOut={() => setBarcodeHovered(false)}
          style={[
            styles.actionBarcodeBtn,
            { borderColor: theme.accent },
            barcodeHovered && { backgroundColor: theme.accentMuted, transform: [{ scale: 1.01 }] } as any
          ]}
        >
          <Text style={[styles.actionBarcodeBtnText, { color: theme.accent, fontFamily: 'Syne, sans-serif' }]}>
            GENERATE CRYPTO RMA BARCODE
          </Text>
        </Pressable>
      ) : (
        <View style={styles.barcodeWrapper}>
          <View style={styles.barcodeGraphicBox}>
            {/* Pulsing Red Laser Line (Web only decoration) */}
            {Platform.OS === 'web' && (
              <View style={[styles.laserBar, { backgroundColor: '#ff3e00' }]} className="laser-line" />
            )}
            {barcodeBars.map((width, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.barcodeStripe, 
                  { 
                    width: width, 
                    backgroundColor: idx % 4 === 0 ? 'transparent' : '#1e1e24',
                    marginRight: 1
                  }
                ]} 
              />
            ))}
          </View>
          <Text style={[styles.barcodeLabelCode, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
            {barcode}
          </Text>
        </View>
      )}
    </View>
  );
};

// ==========================================
// 4. Warranty Progress Dashboard Widget
// ==========================================
interface WarrantyTrackerProps {
  theme: ThemeStyles;
  purchaseDate: string;
  expiry: string;
}

export const WarrantyTracker: React.FC<WarrantyTrackerProps> = ({ theme, purchaseDate, expiry }) => {
  const getWarrantyDetails = () => {
    const today = new Date('2026-06-04');
    const start = new Date(purchaseDate);
    const end = new Date(expiry);
    
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = remainingDays <= 0;
    
    const progressPercent = isExpired ? 0 : Math.max(0, Math.min(100, (remainingDays / totalDays) * 100));
    
    return {
      totalDays,
      remainingDays,
      isExpired,
      progressPercent
    };
  };

  const { totalDays, remainingDays, isExpired, progressPercent } = getWarrantyDetails();

  return (
    <View style={[styles.glassWidget, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg }]}>
      <View style={styles.widgetHeaderInline}>
        <ShieldIcon color="#d97706" size={14} />
        <Text style={[styles.widgetTitle, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>
          ACTIVE WARRANTY METER
        </Text>
      </View>

      <View style={styles.warrantyStatsRow}>
        <View>
          <Text style={[
            styles.statNumberText, 
            { color: isExpired ? '#ef4444' : '#eab308', fontFamily: 'Share Tech Mono, monospace' }
          ]}>
            {isExpired ? 'WARR_EXPIRED' : `${remainingDays}d / ${totalDays}d`}
          </Text>
          <Text style={[styles.statLabelText, { color: theme.textSecondary }]}>
            Remaining coverage cycle
          </Text>
        </View>

        <View style={[
          styles.badgeShield, 
          { backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.08)', borderColor: isExpired ? '#ef4444' : '#eab308' }
        ]}>
          <Text style={[
            styles.badgeShieldText, 
            { color: isExpired ? '#ef4444' : '#eab308', fontFamily: 'Share Tech Mono, monospace' }
          ]}>
            {isExpired ? 'INACTIVE' : 'GUARDIAN_SECURED'}
          </Text>
        </View>
      </View>

      {!isExpired && (
        <View style={styles.meterContainer}>
          <View style={[styles.meterOuter, { backgroundColor: theme.glassBorder }]}>
            <View style={[styles.meterInner, { width: `${progressPercent}%`, backgroundColor: '#eab308' }]} />
          </View>
          <View style={styles.meterDates}>
            <Text style={[styles.meterDateText, { color: theme.textSecondary }]}>{purchaseDate}</Text>
            <Text style={[styles.meterDateText, { color: theme.textSecondary }]}>{expiry}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// ==========================================
// 5. Warranty Claims wizard form Widget
// ==========================================
interface WarrantyClaimWizardProps {
  theme: ThemeStyles;
  receiptId: string;
  addSyncLog: (msg: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export const WarrantyClaimWizard: React.FC<WarrantyClaimWizardProps> = ({ theme, receiptId, addSyncLog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [claimText, setClaimText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const handleSubmit = () => {
    if (!claimText.trim()) return;
    setIsSubmitting(true);
    addSyncLog(`WARR_SYS: Packaging claim parameters for record ${receiptId.slice(0, 8)}...`, 'info');
    
    setTimeout(() => {
      const shaSig = `SHA256-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      addSyncLog(`WARR_SYS: Claim registered. Reference signature: ${shaSig}`, 'success');
      setIsSubmitting(false);
      setClaimSuccess(true);
    }, 1200);
  };

  return (
    <View style={[styles.glassWidget, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg }]}>
      <Text style={[styles.widgetHeadingText, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>
        WARRANTY TELEMETRY UPLINK
      </Text>

      {!isOpen ? (
        <Pressable
          onPress={() => setIsOpen(true)}
          onHoverIn={() => setBtnHovered(true)}
          onHoverOut={() => setBtnHovered(false)}
          style={[
            styles.wizardToggleBtn,
            { borderColor: '#eab308' },
            btnHovered && { backgroundColor: 'rgba(234, 179, 8, 0.08)', transform: [{ scale: 1.01 }] } as any
          ]}
        >
          <Text style={[styles.wizardToggleBtnText, { color: '#eab308', fontFamily: 'Share Tech Mono, monospace' }]}>
            INITIATE CLAIMS DISPATCH
          </Text>
        </Pressable>
      ) : claimSuccess ? (
        <View style={styles.successConsole}>
          <View style={[styles.consoleSuccessBadge, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
            <CheckIcon color="#10b981" size={14} />
          </View>
          <Text style={[styles.successConsoleTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
            CLAIM METADATA RECORDED
          </Text>
          <Text style={[styles.successConsoleBody, { color: theme.textSecondary }]}>
            Cryptographic handshake completed. Transaction signature added to the audit logs.
          </Text>
        </View>
      ) : (
        <View style={styles.claimsWizardForm}>
          <Text style={[styles.claimsFieldLabel, { color: theme.textSecondary }]}>
            Specify incident parameters / defects details:
          </Text>
          <TextInput
            style={[
              styles.claimsInputArea,
              { 
                borderColor: theme.glassBorder, 
                color: theme.textPrimary,
                backgroundColor: 'rgba(0,0,0,0.15)',
              }
            ]}
            placeholder="E.g., Component failed during normal power cycles..."
            placeholderTextColor="rgba(255, 255, 255, 0.25)"
            value={claimText}
            onChangeText={setClaimText}
            multiline
            numberOfLines={3}
          />
          <View style={styles.claimsActions}>
            <Pressable 
              onPress={() => setIsOpen(false)}
              style={[styles.smallCancelBtn, { borderColor: theme.glassBorder }]}
            >
              <Text style={[styles.smallCancelBtnText, { color: theme.textSecondary }]}>Abort</Text>
            </Pressable>
            <Pressable 
              onPress={handleSubmit}
              disabled={isSubmitting || !claimText.trim()}
              style={[
                styles.smallSubmitBtn, 
                { backgroundColor: '#eab308' },
                (!claimText.trim() || isSubmitting) && { opacity: 0.5 }
              ]}
            >
              <Text style={styles.smallSubmitBtnText}>
                {isSubmitting ? 'DISPATCHING...' : 'DISPATCH TICKET'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

// ==========================================
// Styles
// ==========================================
const styles = StyleSheet.create({
  pendingConsole: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  consoleTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  consoleBodyText: {
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.8,
  },
  premiumBtn: {
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  premiumBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  glassWidget: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  gaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  svgWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeNumber: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  gaugeLabel: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    opacity: 0.5,
  },
  gaugeInfo: {
    flex: 1,
    gap: 6,
  },
  widgetHeaderInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  widgetTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  gaugeDesc: {
    fontSize: 10.5,
    lineHeight: 14,
    opacity: 0.85,
  },
  gaugeSubDesc: {
    fontSize: 8,
    opacity: 0.4,
  },
  widgetHeadingText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  checklistGrid: {
    gap: 8,
  },
  checkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  customCheckbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCardText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  spacerLine: {
    height: 1,
    opacity: 0.08,
    marginVertical: 14,
  },
  actionBarcodeBtn: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  actionBarcodeBtnText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  barcodeWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  barcodeGraphicBox: {
    height: 38,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  laserBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    zIndex: 2,
  },
  barcodeStripe: {
    height: '70%',
  },
  barcodeLabelCode: {
    fontSize: 9,
    letterSpacing: 1,
    opacity: 0.5,
  },
  warrantyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  statNumberText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabelText: {
    fontSize: 9.5,
    opacity: 0.5,
  },
  badgeShield: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeShieldText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  meterContainer: {
    marginTop: 8,
  },
  meterOuter: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  meterInner: {
    height: '100%',
    borderRadius: 2,
  },
  meterDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  meterDateText: {
    fontSize: 8.5,
    opacity: 0.45,
    fontFamily: 'Share Tech Mono, monospace',
  },
  wizardToggleBtn: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      default: {}
    }) as any,
  },
  wizardToggleBtnText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  claimsWizardForm: {
    gap: 8,
  },
  claimsFieldLabel: {
    fontSize: 10.5,
    opacity: 0.75,
  },
  claimsInputArea: {
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    fontSize: 11,
    textAlignVertical: 'top',
  },
  claimsActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  smallCancelBtn: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {}
    }) as any,
  },
  smallCancelBtnText: {
    fontSize: 10,
    fontWeight: '600',
  },
  smallSubmitBtn: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {}
    }) as any,
  },
  smallSubmitBtnText: {
    color: '#0e0e11',
    fontSize: 10,
    fontWeight: '800',
  },
  successConsole: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  consoleSuccessBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successConsoleTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  successConsoleBody: {
    fontSize: 10,
    lineHeight: 14,
    opacity: 0.65,
    textAlign: 'center',
  },
});
