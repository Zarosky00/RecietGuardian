import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { THEMES } from '@/hooks/use-sandbox-settings';

interface SettingsDrawerProps {
  themeName: string;
  theme: any;
  setThemeName: (name: any) => void;
  networkSpeed: string;
  setNetworkSpeed: (speed: any) => void;
  forceError: boolean;
  setForceError: (val: boolean) => void;
  clearAllData: () => void;
  seedDemoData: () => void;
  onClose: () => void;
  style?: any;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  themeName,
  theme,
  setThemeName,
  networkSpeed,
  setNetworkSpeed,
  forceError,
  setForceError,
  clearAllData,
  seedDemoData,
  onClose,
  style,
}) => {
  return (
    <GlassCard intensity="high" style={[styles.floatingSettingsPanel, { borderColor: theme.accent }, style]}>
      <View style={styles.panelHeaderRow}>
        <Text style={[styles.panelTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>VAULT SYSTEMS</Text>
        <Pressable onPress={onClose}>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} className="custom-scroll">
        {/* Themes List */}
        <View style={styles.panelGroup}>
          <Text style={[styles.panelLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>THEME CONTROLLER</Text>
          <View style={styles.themeBadgeRow}>
            {(['cyberpunk', 'mint', 'rose', 'frost-dark', 'frost-light'] as const).map((t) => (
              <Pressable
                key={t}
                style={[
                  styles.themeBadgeBtn,
                  themeName === t && { borderColor: theme.accent, backgroundColor: theme.accentMuted }
                ]}
                onPress={() => setThemeName(t)}
              >
                <View style={[styles.themeBadgeColor, { backgroundColor: THEMES[t].accent }]} />
                <Text style={[styles.themeBadgeText, { color: theme.textPrimary, fontFamily: 'Sora, sans-serif' }]}>
                  {t.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Data Workspace seeds */}
        <View style={styles.panelGroup}>
          <Text style={[styles.panelLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>DATA WORKSPACE</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable style={[styles.panelActionBtn, { borderColor: '#ff3e00', borderWidth: 1 }]} onPress={clearAllData}>
              <Text style={{ color: '#ff3e00', fontSize: 10, fontWeight: 'bold', fontFamily: 'Syne, sans-serif' }}>WIPE WORKSPACE</Text>
            </Pressable>
            <Pressable style={[styles.panelActionBtn, { backgroundColor: theme.accent }]} onPress={seedDemoData}>
              <Text style={{ color: theme.bgGradStart, fontSize: 10, fontWeight: 'bold', fontFamily: 'Syne, sans-serif' }}>SEED ASSETS</Text>
            </Pressable>
          </View>
        </View>

        {/* Network limiting speed indicators */}
        <View style={styles.panelGroup}>
          <Text style={[styles.panelLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>SPEED THROWER</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['fast', 'slow', 'offline'] as const).map((speed) => (
              <Pressable
                key={speed}
                style={[
                  styles.panelSpeedBtn,
                  { borderColor: theme.glassBorder },
                  networkSpeed === speed && { backgroundColor: theme.accent, borderColor: theme.accent }
                ]}
                onPress={() => setNetworkSpeed(speed)}
              >
                <Text style={{ 
                  fontSize: 9, 
                  fontWeight: '800', 
                  fontFamily: 'Syne, sans-serif',
                  color: networkSpeed === speed ? theme.bgGradStart : theme.textPrimary 
                }}>
                  {speed.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Database error inject crash switch */}
        <View style={styles.panelGroup}>
          <Text style={[styles.panelLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>CRASH INJECTION</Text>
          <Pressable style={styles.errorToggleRow} onPress={() => setForceError(!forceError)}>
            <View style={[styles.toggleSwitchOuter, { borderColor: theme.accent, backgroundColor: forceError ? theme.accent : 'transparent' }]}>
              <View style={[styles.toggleSwitchInner, { backgroundColor: forceError ? theme.bgGradStart : theme.textSecondary, alignSelf: forceError ? 'flex-end' : 'flex-start' }]} />
            </View>
            <Text style={{ color: theme.textPrimary, fontSize: 10, fontFamily: 'Sora, sans-serif', fontWeight: '600' }}>
              Simulate Service Crash (503)
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  floatingSettingsPanel: {
    position: 'absolute',
    right: 20,
    top: 75,
    bottom: 110,
    width: 280,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  panelGroup: {
    marginBottom: 18,
  },
  panelLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    opacity: 0.6,
  },
  themeBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  themeBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    gap: 6,
  },
  themeBadgeColor: {
    width: 7,
    height: 7,
    borderRadius: 2,
  },
  themeBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  panelActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelSpeedBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  toggleSwitchOuter: {
    width: 32,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    paddingHorizontal: 1,
    justifyContent: 'center',
  },
  toggleSwitchInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
