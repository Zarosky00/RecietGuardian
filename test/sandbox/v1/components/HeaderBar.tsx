import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const SearchIcon = ({ color = '#ffffff', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

interface HeaderBarProps {
  isDesktop: boolean;
  title: string;
  isSyncing: boolean;
  activeTab: string;
  theme: any;
  onSearchPress: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isDesktop,
  title,
  isSyncing,
  activeTab,
  theme,
  onSearchPress,
}) => {
  const getGreetingText = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'GOOD MORNING';
    if (hr < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  if (isDesktop) {
    return (
      <View style={styles.leftPaneHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.logoBadgeContainer}>
            <View style={[styles.logoOutlineBox, { borderColor: theme.accent }]} />
            <View style={[styles.logoColorBox, { borderColor: theme.accent, backgroundColor: theme.accentMuted }]} />
          </View>
          <Text style={[styles.deckBrandTitle, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
            {title}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable 
            style={styles.workspaceSearchBtn} 
            className="workspace-search-btn"
            onPress={onSearchPress}
          >
            <SearchIcon color={theme.textSecondary} size={15} />
          </Pressable>
          <View style={[styles.topStatusBadge, { borderColor: theme.glassBorder, backgroundColor: theme.accentMuted }]}>
            <View style={[styles.topStatusDot, { backgroundColor: isSyncing ? '#00e5ff' : '#10b981' }]} className="pulse-dot-active" />
            <Text style={{ color: theme.textSecondary, fontSize: 8, fontWeight: '800', fontFamily: 'Share Tech Mono, monospace' }}>
              {isSyncing ? 'SYNCING' : 'SECURED'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Mobile Header layout
  return (
    <View style={styles.welcomeRow}>
      <View>
        {activeTab === 'home' && (
          <Text style={[styles.welcomeGreeting, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif', opacity: 0.6 }]}>
            {getGreetingText()},
          </Text>
        )}
        <Text style={[styles.welcomeUser, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
          {activeTab === 'home' ? 'GUARDIAN ADMIN' : title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable 
          style={styles.workspaceSearchBtn} 
          className="workspace-search-btn"
          onPress={onSearchPress}
        >
          <SearchIcon color={theme.textSecondary} size={16} />
        </Pressable>
        <View style={[styles.avatarWrapper, { borderColor: theme.accent }]}>
          <View style={[styles.avatarDot, { backgroundColor: '#10b981' }]} />
          <Text style={[styles.avatarText, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>GA</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftPaneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    height: 32,
  },
  logoBadgeContainer: {
    position: 'relative',
    width: 14,
    height: 14,
    marginRight: 4,
  },
  logoOutlineBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  logoColorBox: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  deckBrandTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  workspaceSearchBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  topStatusDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeGreeting: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  welcomeUser: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  avatarWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#000',
  },
  avatarText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
