import React from 'react';
import Svg, { Rect, Circle, Line, Path, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
  style?: any;
}

export const ReceiptIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Rect x="3" y="3" width="18" height="18" rx={0} />
    <Line x1="7" y1="8" x2="17" y2="8" />
    <Line x1="7" y1="12" x2="17" y2="12" />
    <Line x1="7" y1="16" x2="13" y2="16" />
    <Rect x="15" y="15" width="2" height="2" rx={0} fill={color} />
  </Svg>
);

export const ReturnIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M21 12H3m0 0 5-5m-5 5 5 5" />
    <Rect x="15" y="6" width="6" height="4" rx={0} />
  </Svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polygon points="12 2 20 6 20 12 12 22 4 12 4 6" />
    <Line x1="12" y1="7" x2="12" y2="17" />
  </Svg>
);

export const TaxIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Rect x="3" y="3" width="18" height="18" />
    <Line x1="3" y1="21" x2="21" y2="3" />
    <Circle cx="7.5" cy="7.5" r="1.5" fill={color} />
    <Circle cx="16.5" cy="16.5" r="1.5" fill={color} />
  </Svg>
);

export const CogIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Rect x="8" y="8" width="8" height="8" />
    <Line x1="12" y1="2" x2="12" y2="8" />
    <Line x1="12" y1="16" x2="12" y2="22" />
    <Line x1="2" y1="12" x2="8" y2="12" />
    <Line x1="16" y1="12" x2="22" y2="12" />
  </Svg>
);

export const CameraIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Rect x="2" y="6" width="20" height="14" rx={0} />
    <Rect x="7" y="3" width="10" height="3" rx={0} />
    <Circle cx="12" cy="13" r="3.5" />
    <Rect x="18" y="9" width="1.5" height="1.5" fill={color} />
  </Svg>
);

export const UploadIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polyline points="17 8 12 3 7 8" />
    <Line x1="12" y1="3" x2="12" y2="16" />
    <Line x1="4" y1="20" x2="20" y2="20" />
  </Svg>
);

export const EmailIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Rect x="3" y="4" width="18" height="16" rx={0} />
    <Polyline points="3 7 12 13 21 7" />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" style={style}>
    <Line x1="12" y1="4" x2="12" y2="20" />
    <Line x1="4" y1="12" x2="20" y2="12" />
  </Svg>
);

export const ChevronIcon: React.FC<IconProps & { direction?: 'up' | 'down' | 'left' | 'right' }> = ({
  color = '#ff3e00',
  size = 18,
  direction = 'down',
  style,
}) => {
  const getRotation = () => {
    switch (direction) {
      case 'up': return 'rotate(180deg)';
      case 'left': return 'rotate(90deg)';
      case 'right': return 'rotate(-90deg)';
      default: return 'rotate(0)';
    }
  };

  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      style={{ ...style, transform: getRotation(), transition: 'transform 0.15s ease' }}
    >
      <Polyline points="4 9 12 17 20 9" />
    </Svg>
  );
};

export const TrashIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 16, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polyline points="3 6 5 6 21 6" />
    <Rect x="5" y="6" width="14" height="15" rx={0} />
    <Line x1="10" y1="10" x2="10" y2="16" />
    <Line x1="14" y1="10" x2="14" y2="16" />
    <Line x1="9" y1="3" x2="15" y2="3" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 16, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" style={style}>
    <Polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
  </Svg>
);

export const AlertIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" style={style}>
    <Polygon points="12 2 22 20 2 20" />
    <Line x1="12" y1="9" x2="12" y2="14" />
    <Rect x="11" y="16" width="2" height="2" fill={color} />
  </Svg>
);

export const PencilIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 16, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Polygon points="14 2 22 10 10 22 2 22 2 14" />
    <Line x1="11" y1="5" x2="19" y2="13" />
  </Svg>
);

export const LinkIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 16, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" style={style}>
    <Rect x="3" y="11" width="8" height="8" />
    <Rect x="13" y="5" width="8" height="8" />
    <Line x1="9" y1="13" x2="15" y2="7" />
  </Svg>
);

export const HomeIcon: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

export const CogIconSandbox: React.FC<IconProps> = ({ color = '#ff3e00', size = 18, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" style={style}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);
