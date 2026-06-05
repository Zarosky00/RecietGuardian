import React from 'react';
import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { CustomDonutChart, CustomBarChart } from './CustomCharts';
import { Receipt } from '@/types/receipt';

interface InsightsWorkspaceProps {
  theme: any;
  totalPaid: number;
  totalUnpaid: number;
  isDesktop: boolean;
  receipts: Receipt[];
}

export const InsightsWorkspace: React.FC<InsightsWorkspaceProps> = ({
  theme,
  totalPaid,
  totalUnpaid,
  isDesktop,
  receipts,
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} className="custom-scroll">
      <View style={[styles.insightsContentContainer, Platform.OS === 'web' && { className: 'chart-fade-in' } as any]}>
        {/* Hero Metric Widget */}
        <View style={styles.heroMetricWidget}>
          <Text style={[styles.heroMetricLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>
            TOTAL LEDGER OUTLAY
          </Text>
          <Text style={[styles.heroMetricValue, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
            ${(totalPaid + totalUnpaid).toFixed(2)}
          </Text>
        </View>

        <View style={isDesktop ? styles.desktopChartsRow : styles.mobileChartsCol}>
          <View style={isDesktop ? styles.desktopChartColumn : styles.mobileChartItem}>
            <Text style={[styles.sectionHeading, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>CATEGORY OUTLAYS</Text>
            <CustomDonutChart receipts={receipts} />
          </View>
          
          {isDesktop && <View style={[styles.verticalChartsDivider, { backgroundColor: theme.glassBorder }]} />}
          
          <View style={isDesktop ? styles.desktopChartColumn : styles.mobileChartItem}>
            <Text style={[styles.sectionHeading, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>EXPENSE TRENDS</Text>
            <CustomBarChart receipts={receipts} />
          </View>
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  insightsContentContainer: {
    flex: 1,
  },
  heroMetricWidget: {
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  heroMetricLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    opacity: 0.5,
    marginBottom: 4,
  },
  heroMetricValue: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  desktopChartsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 32,
    marginTop: 12,
  },
  desktopChartColumn: {
    flex: 1,
    paddingVertical: 12,
  },
  verticalChartsDivider: {
    width: 1,
    marginVertical: 12,
    opacity: 0.4,
  },
  mobileChartsCol: {
    flexDirection: 'column',
    gap: 16,
  },
  mobileChartItem: {
    paddingVertical: 12,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
});
