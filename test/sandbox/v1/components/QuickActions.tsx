import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { CameraIcon, UploadIcon, EmailIcon, TaxIcon } from './SVGIcons';

interface QuickActionsProps {
  theme: any;
  openIngestion: (mode: 'camera' | 'upload' | 'email') => void;
  setActiveTab: (tab: any) => void;
  setSelectedReceipt: (receipt: any) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  theme,
  openIngestion,
  setActiveTab,
  setSelectedReceipt,
}) => {
  return (
    <View style={styles.quickActionsContainer}>
      <Pressable 
        style={[styles.quickActionBtn, { borderColor: theme.glassBorder }]}
        className="cat-pill-anim"
        onPress={() => openIngestion('camera')}
      >
        <CameraIcon color={theme.accent} size={13} />
        <Text style={[styles.quickActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>SCAN RECEIPT</Text>
      </Pressable>

      <Pressable 
        style={[styles.quickActionBtn, { borderColor: theme.glassBorder }]}
        className="cat-pill-anim"
        onPress={() => openIngestion('upload')}
      >
        <UploadIcon color={theme.accent} size={13} />
        <Text style={[styles.quickActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>UPLOAD FILE</Text>
      </Pressable>

      <Pressable 
        style={[styles.quickActionBtn, { borderColor: theme.glassBorder }]}
        className="cat-pill-anim"
        onPress={() => openIngestion('email')}
      >
        <EmailIcon color={theme.accent} size={13} />
        <Text style={[styles.quickActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>SYNC INBOX</Text>
      </Pressable>

      <Pressable 
        style={[styles.quickActionBtn, { borderColor: theme.glassBorder }]}
        className="cat-pill-anim"
        onPress={() => {
          setActiveTab('taxes');
          setSelectedReceipt(null);
        }}
      >
        <TaxIcon color={theme.accent} size={13} />
        <Text style={[styles.quickActionText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>EXPORT TAX</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
    width: '100%',
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' },
      default: {}
    }) as any,
  },
  quickActionText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
