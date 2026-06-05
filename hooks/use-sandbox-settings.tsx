import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type ThemeType = 'cyberpunk' | 'mint' | 'rose' | 'frost-light' | 'frost-dark';
export type NetworkSpeed = 'fast' | 'slow' | 'offline';

export interface ThemeStyles {
  name: ThemeType;
  bgGradStart: string;
  bgGradEnd: string;
  glassBg: string;
  glassBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentMuted: string;
  accentGlow: string;
  cardBg: string;
  shadowGlass: string;
  tabActive: string;
  tabInactive: string;
}

export const THEMES: Record<ThemeType, ThemeStyles> = {
  cyberpunk: {
    name: 'cyberpunk', // Matte Carbon
    bgGradStart: '#09090b',
    bgGradEnd: '#09090b',
    glassBg: 'rgba(9, 9, 11, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    accent: '#ffffff', // Pure High-Contrast White
    accentMuted: 'rgba(255, 255, 255, 0.08)',
    accentGlow: 'rgba(255, 255, 255, 0.15)',
    cardBg: 'rgba(18, 18, 22, 0.65)',
    shadowGlass: 'rgba(0, 0, 0, 0.5)',
    tabActive: '#ffffff',
    tabInactive: '#71717a',
  },
  mint: {
    name: 'mint', // Indigo Matte
    bgGradStart: '#0b0f19',
    bgGradEnd: '#0b0f19',
    glassBg: 'rgba(11, 15, 25, 0.85)',
    glassBorder: 'rgba(99, 102, 241, 0.15)',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    accent: '#6366f1', // Indigo Accent
    accentMuted: 'rgba(99, 102, 241, 0.08)',
    accentGlow: 'rgba(99, 102, 241, 0.2)',
    cardBg: 'rgba(17, 24, 39, 0.6)',
    shadowGlass: 'rgba(0, 0, 0, 0.45)',
    tabActive: '#6366f1',
    tabInactive: '#64748b',
  },
  rose: {
    name: 'rose', // Champagne Luxe
    bgGradStart: '#fbfbfa',
    bgGradEnd: '#fbfbfa',
    glassBg: 'rgba(251, 251, 250, 0.85)',
    glassBorder: 'rgba(24, 24, 27, 0.06)',
    textPrimary: '#18181b',
    textSecondary: '#71717a',
    accent: '#18181b', // Pure Charcoal
    accentMuted: 'rgba(24, 24, 27, 0.06)',
    accentGlow: 'rgba(24, 24, 27, 0.1)',
    cardBg: 'rgba(255, 255, 255, 0.7)',
    shadowGlass: 'rgba(0, 0, 0, 0.03)',
    tabActive: '#18181b',
    tabInactive: '#8b857d',
  },
  'frost-dark': {
    name: 'frost-dark', // Deep Velvet
    bgGradStart: '#0d0d0f',
    bgGradEnd: '#0d0d0f',
    glassBg: 'rgba(13, 13, 15, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.06)',
    textPrimary: '#e4e4e7',
    textSecondary: '#71717a',
    accent: '#a1a1aa', // Slate Silver
    accentMuted: 'rgba(161, 161, 170, 0.08)',
    accentGlow: 'rgba(161, 161, 170, 0.15)',
    cardBg: 'rgba(24, 24, 27, 0.5)',
    shadowGlass: 'rgba(0, 0, 0, 0.6)',
    tabActive: '#a1a1aa',
    tabInactive: '#52525b',
  },
  'frost-light': {
    name: 'frost-light', // Platinum Light
    bgGradStart: '#ffffff',
    bgGradEnd: '#ffffff',
    glassBg: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(15, 23, 42, 0.08)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    accent: '#2563eb', // Corporate Blue
    accentMuted: 'rgba(37, 99, 235, 0.06)',
    accentGlow: 'rgba(37, 99, 235, 0.12)',
    cardBg: 'rgba(248, 250, 252, 0.9)',
    shadowGlass: 'rgba(15, 23, 42, 0.03)',
    tabActive: '#2563eb',
    tabInactive: '#64748b',
  },
};

export interface SyncLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface SandboxSettingsContextType {
  themeName: ThemeType;
  theme: ThemeStyles;
  setThemeName: (t: ThemeType) => void;
  networkSpeed: NetworkSpeed;
  setNetworkSpeed: (s: NetworkSpeed) => void;
  forceError: boolean;
  setForceError: (e: boolean) => void;
  syncLogs: SyncLog[];
  addSyncLog: (msg: string, type?: SyncLog['type']) => void;
  clearSyncLogs: () => void;
  isSyncing: boolean;
  setIsSyncing: (s: boolean) => void;
}

const SandboxSettingsContext = createContext<SandboxSettingsContextType | undefined>(undefined);

export const SandboxSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeType>('cyberpunk');
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>('fast');
  const [forceError, setForceError] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const theme = THEMES[themeName];

  const addSyncLog = (msg: string, type: SyncLog['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog: SyncLog = {
      id: Math.random().toString(36).substring(7),
      timestamp,
      message: msg,
      type,
    };
    setSyncLogs((prev) => [newLog, ...prev].slice(0, 100)); // Cap at 100 logs
  };

  const clearSyncLogs = () => {
    setSyncLogs([]);
  };

  // Seed initial logs
  useEffect(() => {
    addSyncLog('Sandbox Engine Initialized.', 'success');
    addSyncLog('Local storage ready. Pub-Sub service listening on channel "receipt-events".', 'info');
    addSyncLog('Interactive email inbox simulator configured.', 'info');
  }, []);

  return (
    <SandboxSettingsContext.Provider
      value={{
        themeName,
        theme,
        setThemeName,
        networkSpeed,
        setNetworkSpeed,
        forceError,
        setForceError,
        syncLogs,
        addSyncLog,
        clearSyncLogs,
        isSyncing,
        setIsSyncing,
      }}
    >
      {children}
    </SandboxSettingsContext.Provider>
  );
};

export const useSandboxSettings = () => {
  const context = useContext(SandboxSettingsContext);
  if (!context) {
    throw new Error('useSandboxSettings must be used within a SandboxSettingsProvider');
  }
  return context;
};
