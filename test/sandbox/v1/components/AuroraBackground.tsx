import React from 'react';
import { Platform } from 'react-native';

interface AuroraBackgroundProps {
  theme: any;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ theme }) => {
  if (Platform.OS !== 'web') return null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Sora:wght@300;400;500;600;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --bg-grad-start: ${theme.bgGradStart};
          --bg-grad-end: ${theme.bgGradEnd};
          --glass-bg: ${theme.glassBg};
          --glass-border: ${theme.glassBorder};
          --text-primary: ${theme.textPrimary};
          --text-secondary: ${theme.textSecondary};
          --accent-color: ${theme.accent};
          --accent-muted: ${theme.accentMuted};
          --card-bg: ${theme.cardBg};
        }

        body {
          background-color: var(--bg-grad-end) !important;
          color: var(--text-primary) !important;
          transition: background-color 0.4s ease;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        * {
          font-family: 'Sora', sans-serif !important;
        }

        /* Scrollbars styling */
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--accent-color) !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Search trigger interaction */
        .workspace-search-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          justifyContent: center;
          align-items: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .workspace-search-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        .filter-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .filter-btn:hover {
          background-color: rgba(255, 255, 255, 0.03) !important;
          border-color: var(--accent-color) !important;
        }
        .dropdown-item-btn {
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .dropdown-item-btn:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .filter-dropdown-content {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: var(--glass-bg) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
        }
        .workspace-list-card {
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.55),
                      inset 0 1px 0 rgba(255, 255, 255, 0.07) !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
          border: 1px solid var(--glass-border) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .cat-pill-anim {
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
          cursor: pointer;
          opacity: 0.55;
        }
        .cat-pill-anim:hover {
          opacity: 0.85;
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
        .cat-pill-anim.active {
          opacity: 1;
          background-color: var(--accent-muted) !important;
        }
        .segment-btn-anim {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
          cursor: pointer;
        }
        .segment-btn-anim:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        @keyframes chartFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chart-fade-in {
          animation: chartFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Floating Capsule Dock transitions */
        .capsule-dock {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.75), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.5) !important;
          border: 1px solid var(--glass-border) !important;
          background: var(--glass-bg) !important;
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
        }
        .capsule-dock.expanded {
          transform: scale(1.03);
        }

        .dock-item-pressable {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.6;
          position: relative;
          cursor: pointer;
        }
        .dock-item-pressable:hover {
          opacity: 1;
          transform: translateY(-4px) scale(1.15);
        }
        .dock-item-pressable.active {
          opacity: 1;
          transform: translateY(-2px) scale(1.02);
        }

        .dock-item-icon-only {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.6;
          cursor: pointer;
        }
        .dock-item-icon-only:hover {
          opacity: 1;
          transform: rotate(90deg) scale(1.15);
        }

        .dock-plus-trigger {
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .dock-plus-trigger:hover {
          transform: scale(1.15) rotate(90deg);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
        }

        .dock-action-pressable {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.8;
          cursor: pointer;
        }
        .dock-action-pressable:hover {
          opacity: 1;
          transform: translateY(-4px) scale(1.15);
        }

        .dock-close-trigger {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .dock-close-trigger:hover {
          transform: scale(1.15);
          background-color: rgba(239, 68, 68, 0.2) !important;
        }

        /* Blueprint Vector Grid background */
        .blueprint-grid {
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: center;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
          border-radius: 20px;
          overflow: hidden;
        }

        /* Aurora background canvas dynamic blobs */
        .aurora-canvas {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .aurora-glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.12;
          pointer-events: none;
          animation: aurora-move 25s infinite alternate ease-in-out;
        }
        .glow-1 {
          top: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background-color: var(--accent-color);
        }
        .glow-2 {
          bottom: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background-color: var(--accent-color);
          animation-delay: -8s;
        }
        .glow-3 {
          top: 30%;
          left: 40%;
          width: 350px;
          height: 350px;
          background-color: var(--accent-color);
          animation-delay: -15s;
          opacity: 0.08;
        }

        @keyframes aurora-move {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(60px, -50px) scale(1.1) rotate(120deg); }
          100% { transform: translate(-30px, 30px) scale(0.95) rotate(240deg); }
        }

        .pulse-dot-active {
          box-shadow: 0 0 0 0 var(--accent-color);
          animation: pulse-ring 2s infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}</style>
      <div className="aurora-canvas">
        <div className="aurora-glow-blob glow-1" />
        <div className="aurora-glow-blob glow-2" />
        <div className="aurora-glow-blob glow-3" />
      </div>
    </>
  );
};
