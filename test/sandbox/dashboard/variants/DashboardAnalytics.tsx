import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Receipt, PendingBill } from '@/types/receipt';

interface DashboardAnalyticsProps {
  receipts: Receipt[];
  pendingBills: PendingBill[];
  budgetLimit: number;
  totalSpent: number;
  onPayBill: (id: string) => void;
  onIncreaseBudget: () => void;
  onDecreaseBudget: () => void;
}

export function DashboardAnalytics({
  receipts,
  pendingBills,
  budgetLimit,
  totalSpent,
  onPayBill,
  onIncreaseBudget,
  onDecreaseBudget,
}: DashboardAnalyticsProps) {
  // Budget Math
  const budgetPercentage = Math.min(100, Math.round((totalSpent / budgetLimit) * 100));
  
  // Alert colors
  let progressColor = 'bg-retro-teal';
  let borderHighlight = 'border-retro-teal';
  if (budgetPercentage >= 80 && budgetPercentage < 100) {
    progressColor = 'bg-retro-navy';
    borderHighlight = 'border-retro-navy';
  } else if (budgetPercentage >= 100) {
    progressColor = 'bg-red-600';
    borderHighlight = 'border-red-600';
  }

  // Group spends by category
  const categorySpends = receipts.reduce((acc, curr) => {
    if (curr.status === 'refunded') return acc; // ignore refunds
    acc[curr.category] = (acc[curr.category] || 0) + curr.total_amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <View className="mb-8 space-y-4">
      {/* 📊 1. Budget Panel (Retro Progress Bar) */}
      <View className={`bg-retro-card border-2 ${borderHighlight} rounded-lg p-4`}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-xs text-retro-border font-mono">📅 Monthly Budget Status</Text>
          <Text className="text-xs font-mono font-bold text-retro-border">
            {budgetPercentage}% of ${budgetLimit}
          </Text>
        </View>

        {/* Retro Progress Track */}
        <View className="h-6 bg-retro-gray border border-retro-border rounded overflow-hidden p-0.5 mb-3 flex-row">
          <View 
            style={{ width: `${budgetPercentage}%` }} 
            className={`h-full ${progressColor}`}
          />
        </View>

        {/* Budget Control Buttons */}
        <View className="flex-row justify-between items-center">
          <Text className="text-[10px] text-retro-darkgray font-mono">Adjust Limit:</Text>
          <View className="flex-row space-x-1">
            <Pressable 
              onPress={onDecreaseBudget}
              className="bg-retro-gray border border-retro-border rounded px-2.5 py-1 active:bg-retro-border"
            >
              <Text className="text-[9px] font-bold text-retro-border font-mono">- $200</Text>
            </Pressable>
            <Pressable 
              onPress={onIncreaseBudget}
              className="bg-retro-gray border border-retro-border rounded px-2.5 py-1 active:bg-retro-border"
            >
              <Text className="text-[9px] font-bold text-retro-border font-mono">+ $200</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 📈 2. Category Distribution */}
      <View className="bg-retro-card border-2 border-retro-border rounded-lg p-4">
        <Text className="font-bold text-xs text-retro-border font-mono mb-3">🏷️ Spend by Category</Text>
        
        {Object.keys(categorySpends).length === 0 ? (
          <Text className="text-[10px] text-retro-darkgray font-mono text-center py-2">No category spends recorded.</Text>
        ) : (
          Object.entries(categorySpends).map(([category, amount]) => {
            const pct = Math.round((amount / (totalSpent || 1)) * 100);
            return (
              <View key={category} className="mb-2">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-[10px] font-bold text-retro-border font-mono">{category}</Text>
                  <Text className="text-[10px] font-mono font-bold text-retro-darkgray">
                    ${amount.toFixed(2)} ({pct}%)
                  </Text>
                </View>
                <View className="h-2 bg-retro-gray border border-retro-gray rounded overflow-hidden">
                  <View style={{ width: `${pct}%` }} className="h-full bg-retro-darkgray" />
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 📅 3. Pending Bills (Local Ingest Widget) */}
      <View className="bg-retro-card border-2 border-retro-border rounded-lg p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="font-bold text-xs text-retro-border font-mono">⏳ Pending Bills Ledger</Text>
          <View className="bg-retro-darkgray rounded px-1.5 py-0.5">
            <Text className="text-[8px] font-bold text-white font-mono">{pendingBills.length} UNPAID</Text>
          </View>
        </View>

        {pendingBills.length === 0 ? (
          <View className="py-4 justify-center items-center">
            <Text className="text-[10px] text-retro-darkgray font-mono">All bills are settled! 🎉</Text>
          </View>
        ) : (
          pendingBills.map((bill) => (
            <View 
              key={bill.id} 
              className="flex-row justify-between items-center border border-retro-gray p-2 rounded mb-2 bg-retro-gray"
            >
              <View className="flex-1 mr-2">
                <Text className="text-xs font-bold text-retro-border font-mono numberOfLines={1}">{bill.merchant}</Text>
                <Text className="text-[9px] text-retro-darkgray font-mono">Due: {bill.due_date} | {bill.category}</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Text className="text-xs font-mono font-bold text-retro-border">${bill.amount.toFixed(2)}</Text>
                <Pressable
                  onPress={() => onPayBill(bill.id)}
                  className="bg-retro-teal border border-retro-border rounded px-2 py-1 active:opacity-90"
                >
                  <Text className="text-[8px] font-bold text-white font-mono">PAY BILL</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
