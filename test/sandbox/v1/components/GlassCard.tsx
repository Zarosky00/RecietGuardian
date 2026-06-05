import React from 'react';
import { View, StyleSheet, Platform, ViewProps } from 'react-native';
import { useSandboxSettings } from '@/hooks/use-sandbox-settings';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  glow?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  bordered?: boolean;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glow = false,
  intensity = 'medium',
  bordered = true,
  hoverable = false,
  style,
  ...props
}) => {
  const { theme } = useSandboxSettings();

  // Detect if flex layout is applied to the card to forward it to the inner container
  const isFlexed = React.useMemo(() => {
    if (!style) return false;
    const flat = StyleSheet.flatten(style);
    return flat && flat.flex !== undefined;
  }, [style]);


  const getGlassOpacity = () => {
    if (theme.name === 'rose') return intensity === 'low' ? 0.6 : intensity === 'medium' ? 0.75 : 0.88;
    if (theme.name === 'frost-light') return intensity === 'low' ? 0.5 : intensity === 'medium' ? 0.7 : 0.85;
    return intensity === 'low' ? 0.35 : intensity === 'medium' ? 0.5 : 0.65;
  };

  const getBlurRadius = () => {
    return intensity === 'low' ? '16px' : intensity === 'medium' ? '32px' : '48px';
  };

  const isDark = theme.name !== 'rose' && theme.name !== 'frost-light';

  const glassStyle = Platform.select({
    web: {
      backdropFilter: `blur(${getBlurRadius()}) saturate(160%)`,
      WebkitBackdropFilter: `blur(${getBlurRadius()}) saturate(160%)`,
      // Premium linear gradient reflecting light diagonally
      background: isDark
        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%), ${theme.glassBg}`
        : `linear-gradient(135deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.20) 100%), ${theme.glassBg}`,
      borderWidth: bordered ? 1 : 0,
      borderColor: theme.glassBorder,
      borderRadius: 24,
      // Elegant box shadow pairing ambient occlusion with an optional accent glow halo
      boxShadow: glow 
        ? `0 20px 50px 0 ${theme.shadowGlass}, 0 0 25px -5px ${theme.accentGlow}, inset 0 1px 0 0 ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.8)'}`
        : `0 8px 32px 0 ${theme.shadowGlass}, inset 0 1px 0 0 ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.6)'}`,
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'relative',
    },
    default: {
      backgroundColor: theme.cardBg,
      borderWidth: bordered ? 1 : 0,
      borderColor: theme.glassBorder,
      borderRadius: 24,
      shadowColor: theme.shadowGlass,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
  });

  return (
    <View 
      style={[
        styles.card, 
        glassStyle, 
        hoverable && Platform.OS === 'web' ? (styles.hoverableWeb as any) : {},
        style
      ]} 
      {...props}
    >
      {/* Subtle top gloss edge overlay for extra premium depth on web */}
      {Platform.OS === 'web' && <div style={styles.glossOverlay as any} />}
      <View style={[{ zIndex: 2 }, isFlexed ? { flex: 1, minHeight: 0, overflow: 'hidden' } : {}]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  hoverableWeb: Platform.select({
    web: {
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-6px) scale(1.01)',
        boxShadow: '0 24px 60px 0 rgba(0, 0, 0, 0.35)',
      }
    },
    default: {}
  }) as any,
  glossOverlay: Platform.select({
    web: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '40%',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    default: {}
  }) as any,
});

