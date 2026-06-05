import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { GlassCard } from './GlassCard';
import { Receipt } from '@/types/receipt';
import { useSandboxSettings } from '@/hooks/use-sandbox-settings';
import { CameraIcon, UploadIcon, EmailIcon, PencilIcon } from './SVGIcons';
import { IngestionCameraView } from './IngestionCameraView';
import { IngestionUploadView } from './IngestionUploadView';
import { IngestionEmailView } from './IngestionEmailView';
import { IngestionManualView } from './IngestionManualView';

interface IngestionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReceipt: (r: Receipt) => void;
  initialMode?: Mode;
}

type Mode = 'main' | 'camera' | 'upload' | 'email' | 'manual';

export const IngestionOverlay: React.FC<IngestionOverlayProps> = ({
  isOpen,
  onClose,
  onAddReceipt,
  initialMode = 'main',
}) => {
  const { theme, addSyncLog } = useSandboxSettings();
  const [mode, setMode] = useState<Mode>(initialMode);

  // OCR state variables for Camera scan (expected by IngestionCameraView)
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'capturing' | 'scanning' | 'complete'>('idle');
  const [parsedReceipt, setParsedReceipt] = useState<Receipt | null>(null);

  // Reset states on close
  useEffect(() => {
    if (!isOpen) {
      setMode('main');
      setOcrStatus('idle');
      setParsedReceipt(null);
    } else {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  return (
    <View style={styles.modalBackdrop}>
      {/* Web keyframes styling */}
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes overlaySlideIn {
            from { transform: scale(0.96) translateY(20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes laserSweep {
            0% { transform: translateY(0); }
            50% { transform: translateY(240px); }
            100% { transform: translateY(0); }
          }
          .animate-overlay {
            animation: overlaySlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .ocr-laser {
            animation: laserSweep 2.2s ease-in-out infinite;
          }
          
          /* Premium focus inputs styling */
          .premium-input {
            border: 1px solid ${theme.glassBorder} !important;
            background-color: ${theme.cardBg} !important;
            color: ${theme.textPrimary} !important;
            border-radius: 12px !important;
            padding: 12px 16px !important;
            font-family: 'Sora', sans-serif !important;
            font-size: 11px !important;
            outline: none !important;
            box-shadow: none !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          .premium-input:focus {
            border-color: ${theme.accent} !important;
            box-shadow: 0 0 12px ${theme.accentGlow} !important;
          }
          .premium-input::placeholder {
            color: ${theme.textSecondary}77 !important;
          }
          
          .premium-menu-item {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
          .premium-menu-item:hover {
            transform: translateY(-4px) !important;
            border-color: ${theme.accent} !important;
            box-shadow: 0 12px 30px ${theme.shadowGlass} !important;
          }
        `}</style>
      )}

      <GlassCard 
        intensity="high" 
        glow={mode === 'camera' && ocrStatus === 'scanning'}
        style={[
          styles.modalContainer,
          Platform.OS === 'web' ? { className: 'animate-overlay' } as any : {}
        ] as any}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
            {mode === 'main' && 'ADD LEDGER NODE'}
            {mode === 'camera' && 'OCR CAMERA SCANNER'}
            {mode === 'upload' && 'FILE ARCHIVE UPLOAD'}
            {mode === 'email' && 'SMART EMAIL SYNC'}
            {mode === 'manual' && 'MANUAL LEDGER ENTRY'}
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: theme.textSecondary, fontSize: 16, fontFamily: 'Sora, sans-serif' }}>✕</Text>
          </Pressable>
        </View>

        {/* Dynamic Screens */}
        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
          {mode === 'main' && (
            <View style={styles.gridMenu}>
              <Pressable 
                style={[styles.menuItem, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
                {...Platform.select({ web: { className: 'premium-menu-item' } as any, default: {} })}
                onPress={() => setMode('camera')}
              >
                <View style={styles.menuIconBox}>
                  <CameraIcon color={theme.accent} size={22} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>CAMERA SCAN</Text>
                <Text style={[styles.menuDesc, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>Tactical viewfinder scanner</Text>
              </Pressable>

              <Pressable 
                style={[styles.menuItem, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
                {...Platform.select({ web: { className: 'premium-menu-item' } as any, default: {} })}
                onPress={() => setMode('upload')}
              >
                <View style={styles.menuIconBox}>
                  <UploadIcon color={theme.accent} size={22} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>UPLOAD INVOICE</Text>
                <Text style={[styles.menuDesc, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>Parse PDF or image templates</Text>
              </Pressable>

              <Pressable 
                style={[styles.menuItem, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
                {...Platform.select({ web: { className: 'premium-menu-item' } as any, default: {} })}
                onPress={() => setMode('email')}
              >
                <View style={styles.menuIconBox}>
                  <EmailIcon color={theme.accent} size={22} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>MAIL BOX SYNC</Text>
                <Text style={[styles.menuDesc, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>Auto-sync email forwarded receipts</Text>
              </Pressable>

              <Pressable 
                style={[styles.menuItem, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
                {...Platform.select({ web: { className: 'premium-menu-item' } as any, default: {} })}
                onPress={() => setMode('manual')}
              >
                <View style={styles.menuIconBox}>
                  <PencilIcon color={theme.accent} size={22} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>MANUAL REGISTER</Text>
                <Text style={[styles.menuDesc, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>Type ledger node parameter fields</Text>
              </Pressable>
            </View>
          )}

          {/* Camera OCR Section */}
          {mode === 'camera' && (
            <IngestionCameraView
              theme={theme}
              ocrStatus={ocrStatus}
              setOcrStatus={setOcrStatus}
              parsedReceipt={parsedReceipt}
              setParsedReceipt={setParsedReceipt}
              addSyncLog={addSyncLog}
              onAddReceipt={onAddReceipt}
              onClose={onClose}
            />
          )}

          {/* File Upload Section */}
          {mode === 'upload' && (
            <IngestionUploadView
              theme={theme}
              addSyncLog={addSyncLog}
              onAddReceipt={onAddReceipt}
              onClose={onClose}
            />
          )}

          {/* Email Smart Ingestion Section */}
          {mode === 'email' && (
            <IngestionEmailView
              onAddReceipt={onAddReceipt}
              onClose={onClose}
            />
          )}

          {/* Manual Entry Form */}
          {mode === 'manual' && (
            <IngestionManualView
              onAddReceipt={onAddReceipt}
              onClose={onClose}
              onBack={() => setMode('main')}
            />
          )}
        </ScrollView>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(16px)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 16,
  } as any,
  modalContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 540,
  },
  gridMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  menuItem: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  menuDesc: {
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 13,
    opacity: 0.6,
  },
});
