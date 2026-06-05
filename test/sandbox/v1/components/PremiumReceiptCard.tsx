import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Receipt } from '@/types/receipt';
import { ThemeStyles } from '@/hooks/use-sandbox-settings';

interface PremiumReceiptCardProps {
  receipt: Receipt;
  theme: ThemeStyles;
  onPress: () => void;
  showReturnInfo?: boolean;
  showWarrantyInfo?: boolean;
}

export const PremiumReceiptCard: React.FC<PremiumReceiptCardProps> = ({
  receipt,
  theme,
  onPress,
  showReturnInfo = false,
  showWarrantyInfo = false,
}) => {
  const [hovered, setHovered] = useState(false);

  const getReturnDaysLeft = (deadlineStr: string) => {
    const today = new Date('2026-06-04');
    const deadline = new Date(deadlineStr);
    const diff = deadline.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const returnDays = getReturnDaysLeft(receipt.return_deadline);
  const isReturnExpired = returnDays < 0;

  const getWarrantyInfoHelper = (expiryStr: string | null) => {
    if (!expiryStr) return null;
    const today = new Date('2026-06-04');
    const expiry = new Date(expiryStr);
    const diff = expiry.getTime() - today.getTime();
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return { isExpired: daysLeft <= 0, daysLeft };
  };

  const warranty = getWarrantyInfoHelper(receipt.warranty_expiry);
  const isDark = theme.name !== 'rose' && theme.name !== 'frost-light';

  // Determine what status or deadline text to show in the center column
  const getCenterStatusText = () => {
    if (showReturnInfo) {
      return isReturnExpired ? 'return expired' : `return: ${returnDays}d left`;
    }
    if (showWarrantyInfo && warranty) {
      return warranty.isExpired ? 'warranty expired' : `warranty: ${warranty.daysLeft}d left`;
    }
    return receipt.category.toLowerCase();
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.pressableRow,
        { borderBottomColor: theme.glassBorder },
        Platform.OS === 'web' && hovered && {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.01)',
          transform: 'translateX(2px)'
        } as any
      ]}
      className="receipt-row-item"
    >
      <View style={styles.rowContent}>
        {/* Column 1: Store Name */}
        <View style={styles.vendorCol}>
          <Text numberOfLines={1} style={[styles.vendorText, { color: theme.textPrimary }]}>
            {receipt.store_name}
          </Text>
        </View>

        {/* Column 2: Date */}
        <View style={styles.dateCol}>
          <Text numberOfLines={1} style={[styles.dateText, { color: theme.textSecondary, fontFamily: 'Share Tech Mono, monospace' }]}>
            {receipt.purchase_date}
          </Text>
        </View>

        {/* Column 3: Contextual Status/Category (No wrapping, extremely clean) */}
        <View style={styles.statusCol}>
          <Text numberOfLines={1} style={[
            styles.statusText, 
            { 
              color: (showReturnInfo && isReturnExpired) || (showWarrantyInfo && warranty?.isExpired) ? '#ff3e00' : theme.textSecondary 
            }
          ]}>
            {getCenterStatusText()}
          </Text>
        </View>

        {/* Column 4: Amount & Minimal status dot */}
        <View style={styles.valueCol}>
          <Text style={[styles.amountValue, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace' }]}>
            ${receipt.total_amount.toFixed(2)}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: receipt.is_paid ? '#10b981' : '#ff3e00' }]} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableRow: Platform.select({
    web: {
      width: '100%',
      borderBottomWidth: 1,
      paddingVertical: 16,
      paddingHorizontal: 8,
      cursor: 'pointer',
      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    default: {
      width: '100%',
      borderBottomWidth: 1,
      paddingVertical: 16,
      paddingHorizontal: 8,
    }
  }) as any,
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  vendorCol: {
    flex: 1.8,
    justifyContent: 'center',
  },
  dateCol: {
    flex: 1.0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statusCol: {
    flex: 1.4,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  valueCol: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  vendorText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  dateText: {
    fontSize: 10,
    opacity: 0.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.65,
  },
  amountValue: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
