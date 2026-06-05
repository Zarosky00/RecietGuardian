import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { Receipt } from '@/types/receipt';
import { useSandboxSettings } from '@/hooks/use-sandbox-settings';

interface ChartProps {
  receipts: Receipt[];
}

export const CustomDonutChart: React.FC<ChartProps> = ({ receipts }) => {
  const { theme } = useSandboxSettings();

  // Group receipts by category
  const categoryTotals: Record<string, number> = {};
  let totalSpent = 0;

  receipts.forEach((r) => {
    if (r.status !== 'refunded') {
      categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.total_amount;
      totalSpent += r.total_amount;
    }
  });

  const categories = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
    percentage: totalSpent > 0 ? (categoryTotals[cat] / totalSpent) * 100 : 0,
  })).sort((a, b) => b.value - a.value);

  // SVG parameters
  const radius = 35;
  const strokeWidth = 8;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * radius;

  // Visual colors mapping
  const categoryColors = [
    theme.accent,
    theme.textPrimary + 'cc',
    theme.textPrimary + '99',
    theme.textSecondary + 'cc',
    theme.textSecondary + '88',
    theme.textSecondary + '44',
  ];

  let currentOffset = 0;
  const isLight = theme.name === 'frost-light' || theme.name === 'rose';

  if (totalSpent === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.chartWrapper}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              stroke={isLight ? 'rgba(9, 9, 11, 0.05)' : 'rgba(255, 255, 255, 0.04)'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          </Svg>
          <View style={styles.centerTextContainer}>
            <Text style={[styles.centerTextValue, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>$0</Text>
            <Text style={[styles.centerTextLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>No Data</Text>
          </View>
        </View>
        <Text style={[styles.emptyLabel, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>No ledger records active.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, Platform.OS === 'web' && { className: 'chart-fade-in' } as any]}>
      <View style={styles.chartWrapper}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }], overflow: 'visible' }}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={isLight ? 'rgba(9, 9, 11, 0.05)' : 'rgba(255, 255, 255, 0.04)'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {categories.map((cat, idx) => {
            const strokeDashoffset = circumference - (cat.percentage / 100) * circumference;
            const strokeDasharray = `${circumference} ${circumference}`;
            const color = categoryColors[idx % categoryColors.length];
            const rotationOffset = (currentOffset / circumference) * 360;
            currentOffset += (cat.percentage / 100) * circumference;

            return (
              <Circle
                key={cat.name}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                strokeLinecap="round"
                transform={`rotate(${rotationOffset - 90}, ${cx}, ${cy})`}
              />
            );
          })}
        </Svg>
        <View style={styles.centerTextContainer}>
          <Text style={[styles.centerTextValue, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
            ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text style={[styles.centerTextLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>TOTAL</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        {categories.slice(0, 4).map((cat, idx) => {
          const color = categoryColors[idx % categoryColors.length];
          return (
            <View key={cat.name} style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View style={[styles.legendColorBox, { backgroundColor: color }]} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={[styles.legendLabel, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>
                    {cat.name.toUpperCase()}
                  </Text>
                  
                  {/* Premium inline progress meter */}
                  <View style={[styles.inlineProgressTrack, { backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }]}>
                    <View style={[styles.inlineProgressFill, { width: `${cat.percentage}%`, backgroundColor: color }]} />
                  </View>
                </View>
              </View>
              <View style={styles.legendRight}>
                <Text style={[styles.legendValue, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
                  ${cat.value.toFixed(2)}
                </Text>
                <Text style={[styles.legendPercentage, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>
                  {cat.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const CustomBarChart: React.FC<ChartProps> = ({ receipts }) => {
  const { theme } = useSandboxSettings();
  const isLight = theme.name === 'frost-light' || theme.name === 'rose';

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData: Record<string, number> = {};

  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthNames[d.getMonth()];
    monthlyData[label] = 0;
  }

  receipts.forEach((r) => {
    if (r.status !== 'refunded') {
      try {
        const d = new Date(r.purchase_date);
        const label = monthNames[d.getMonth()];
        if (monthlyData[label] !== undefined) {
          monthlyData[label] += r.total_amount;
        }
      } catch (e) {}
    }
  });

  const data = Object.keys(monthlyData).map((key) => ({
    label: key,
    value: monthlyData[key],
  }));

  const maxVal = Math.max(...data.map((d) => d.value), 100);

  const points = data.map((d, index) => {
    const x = 10 + index * 20;
    const y = 65 - (d.value / maxVal) * 45;
    return { x, y, label: d.label };
  });

  let splinePath = '';
  let fillPath = '';

  if (points.length > 0) {
    splinePath = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + 10;
      const cp1y = p0.y;
      const cp2x = p1.x - 10;
      const cp2y = p1.y;
      splinePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    fillPath = `${splinePath} L ${points[points.length - 1].x} 70 L ${points[0].x} 70 Z`;
  }

  return (
    <View style={[styles.barContainer, Platform.OS === 'web' && { className: 'chart-fade-in' } as any]}>
      <View style={styles.splineFrame}>
        <Svg width="100%" height="100%" viewBox="0 0 100 80" style={{ overflow: 'visible' }}>
          <Line x1="5" y1="20" x2="95" y2="20" stroke={isLight ? 'rgba(9, 9, 11, 0.04)' : 'rgba(255,255,255,0.04)'} strokeWidth="0.5" />
          <Line x1="5" y1="45" x2="95" y2="45" stroke={isLight ? 'rgba(9, 9, 11, 0.04)' : 'rgba(255,255,255,0.04)'} strokeWidth="0.5" />
          <Line x1="5" y1="70" x2="95" y2="70" stroke={isLight ? 'rgba(9, 9, 11, 0.08)' : 'rgba(255,255,255,0.08)'} strokeWidth="0.5" />

          {points.length > 0 && (
            <>
              {/* Fill Area with standard solid overlay for mobile SVG stability */}
              <Path d={fillPath} fill={theme.accent} fillOpacity={0.15} />

              <Path
                d={splinePath}
                fill="none"
                stroke={theme.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {points.map((p, idx) => (
                <React.Fragment key={idx}>
                  {/* Outer pulse indicator */}
                  <Circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill={theme.accent}
                    fillOpacity="0.25"
                  />
                  {/* Sharp core center */}
                  <Circle
                    cx={p.x}
                    cy={p.y}
                    r="2"
                    fill={theme.accent}
                    stroke={theme.cardBg}
                    strokeWidth="0.75"
                  />
                </React.Fragment>
              ))}
            </>
          )}
        </Svg>
      </View>
      
      <View style={styles.xAxisRow}>
        {points.map((p, idx) => (
          <Text key={idx} style={[styles.xAxisText, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>
            {p.label.toUpperCase()}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  chartWrapper: {
    position: 'relative',
    width: 130,
    height: 130,
  },
  centerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTextValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  centerTextLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 2,
    opacity: 0.8,
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 24,
    justifyContent: 'center',
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  legendColorBox: {
    width: 8,
    height: 8,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  inlineProgressTrack: {
    height: 3,
    borderRadius: 1.5,
    marginTop: 5,
    width: '80%',
    overflow: 'hidden',
  },
  inlineProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  legendRight: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  legendValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  legendPercentage: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
    opacity: 0.7,
  },
  emptyLabel: {
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 12,
  },

  // Spline Chart
  barContainer: {
    height: 160,
    justifyContent: 'flex-end',
    marginVertical: 12,
  },
  splineFrame: {
    flex: 1,
    paddingHorizontal: 4,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '8%',
    marginTop: 12,
  },
  xAxisText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
