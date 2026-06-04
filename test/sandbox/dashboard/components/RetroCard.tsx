import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Theme {
  mode: 'dark' | 'light';
  bg: string;
  cardBg: string;
  textColor: string;
  textColorMuted: string;
  borderColor: string;
  accentColor: string; // Title bar bg
  accentTeal: string;
  accentRed: string;
  accentOrange: string;
  accentGray: string;
  btnBg: string;
  btnText: string;
  controlBg: string;
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
}

interface RetroCardProps {
  children: React.ReactNode;
  title?: string;
  accentColor?: string; // Optional override for header title bar bg
  headerRight?: React.ReactNode;
  theme: Theme;
}

export default function RetroCard({
  children,
  title,
  accentColor,
  headerRight,
  theme,
}: RetroCardProps) {
  const isDark = theme.mode === 'dark';
  const headerBg = accentColor || theme.accentColor;

  return (
    <View 
      style={[
        styles.cardContainer, 
        { 
          backgroundColor: theme.cardBg, 
          borderColor: theme.borderColor,
          shadowColor: theme.shadowColor,
          shadowOffset: theme.shadowOffset,
          shadowOpacity: theme.shadowOpacity,
          shadowRadius: isDark ? 12 : 0,
          borderWidth: isDark ? 2 : 2.5,
        }
      ]}
    >
      {/* Decorative Corner Brackets */}
      <View style={[styles.corner, styles.topLeft, { borderColor: theme.borderColor, borderTopWidth: isDark ? 2 : 2.5, borderLeftWidth: isDark ? 2 : 2.5 }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: theme.borderColor, borderTopWidth: isDark ? 2 : 2.5, borderRightWidth: isDark ? 2 : 2.5 }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.borderColor, borderBottomWidth: isDark ? 2 : 2.5, borderLeftWidth: isDark ? 2 : 2.5 }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: theme.borderColor, borderBottomWidth: isDark ? 2 : 2.5, borderRightWidth: isDark ? 2 : 2.5 }]} />

      {/* Classic OS Window Title Bar */}
      {title && (
        <View 
          style={[
            styles.headerBar, 
            { 
              backgroundColor: headerBg, 
              borderColor: theme.borderColor,
              borderWidth: isDark ? 1.5 : 2,
            }
          ]}
        >
          <View style={styles.headerTitleContainer}>
            {/* Clickable System Menu Button */}
            <View style={[styles.controlBox, { backgroundColor: theme.controlBg, borderColor: theme.borderColor }]}>
              <View style={[styles.minusLine, { backgroundColor: theme.textColor }]} />
            </View>
            <Text style={[styles.headerText, { color: isDark ? theme.textColor : '#ffffff' }]}>
              {title}
            </Text>
          </View>
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}

      {/* Card Body */}
      <View style={styles.body}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    position: 'relative',
    shadowRadius: 0,
  },
  corner: {
    position: 'absolute',
    width: 6,
    height: 6,
  },
  topLeft: {
    top: -2.5,
    left: -2.5,
  },
  topRight: {
    top: -2.5,
    right: -2.5,
  },
  bottomLeft: {
    bottom: -2.5,
    left: -2.5,
  },
  bottomRight: {
    bottom: -2.5,
    right: -2.5,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -16,
    marginBottom: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
  body: {
    position: 'relative',
  },
});
