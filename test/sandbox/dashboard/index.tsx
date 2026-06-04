import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { getMockReceipts, getMockPendingBills } from '../../mock-data/mock-receipt-generator';
import { DashboardCleanList } from './variants/DashboardCleanList';
import { DashboardRetroGrid } from './variants/DashboardRetroGrid';
import { DashboardAnalytics } from './variants/DashboardAnalytics';
import { ReceiptDetailDrawer } from './variants/ReceiptDetailDrawer';
import { Receipt } from '@/types/receipt';

export default function SandboxDashboard() {
  const [variant, setVariant] = useState<'list' | 'grid' | 'insights'>('grid');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  
  // States to emulate interactive data updates in sandbox
  const [receipts, setReceipts] = useState<Receipt[]>(getMockReceipts());
  const [pendingBills, setPendingBills] = useState(getMockPendingBills());
  const [budgetLimit, setBudgetLimit] = useState(1200);

  // Math triggers
  const totalSpent = receipts.reduce((acc, curr) => {
    if (curr.status === 'refunded') {
      return acc - curr.total_amount;
    }
    return acc + curr.total_amount;
  }, 0);

  const activeReturnsCount = receipts.filter(
    (r) => r.status === 'active' && r.return_deadline
  ).length;

  const activeWarrantiesCount = receipts.filter(
    (r) => r.status === 'active' && r.warranty_expiry
  ).length;

  // Handles paying a pending bill
  const handlePayBill = (billId: string) => {
    const bill = pendingBills.find((b) => b.id === billId);
    if (!bill) return;

    // Remove from pending
    setPendingBills(pendingBills.filter((b) => b.id !== billId));

    // Convert to completed receipt record
    const newReceipt: Receipt = {
      id: `rec-${Date.now()}`,
      store_name: bill.merchant,
      total_amount: bill.amount,
      currency: 'USD',
      purchase_date: new Date().toISOString().split('T')[0],
      return_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days preset
      warranty_expiry: null,
      status: 'active',
      is_reimbursable: false,
      is_tax_related: true,
      category: bill.category,
      items: [
        {
          name: `${bill.category} Subscription / Bill`,
          price: bill.amount,
          category: bill.category
        }
      ]
    };

    setReceipts([newReceipt, ...receipts]);
  };

  // Handles updating budget from stats pass in the sandbox
  const handleIncreaseBudget = () => {
    setBudgetLimit(prev => prev + 200);
  };
  
  const handleDecreaseBudget = () => {
    setBudgetLimit(prev => Math.max(200, prev - 200));
  };

  // Handles deleting a receipt in sandbox
  const handleDeleteReceipt = (receiptId: string) => {
    setReceipts(receipts.filter(r => r.id !== receiptId));
    setSelectedReceipt(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-retro-bg">
      {/* 🛠️ Sandbox Variant Toolbar */}
      <View className="bg-retro-gray border-b-2 border-retro-border p-3 flex-row justify-between items-center z-50">
        <View>
          <Text className="text-retro-border font-bold text-xs uppercase tracking-wider">Sandbox UI Controller</Text>
          <Text className="text-retro-darkgray text-[10px]">Testing visual variant templates</Text>
        </View>
        <View className="flex-row space-x-1">
          <Pressable
            onPress={() => setVariant('list')}
            className={`px-3 py-1.5 border-2 rounded ${
              variant === 'list' 
                ? 'bg-retro-navy border-retro-border' 
                : 'bg-retro-gray border-retro-border'
            }`}
          >
            <Text className={`text-[10px] font-bold ${variant === 'list' ? 'text-white' : 'text-retro-border'}`}>
              [A] Clean Directory
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVariant('grid')}
            className={`px-3 py-1.5 border-2 rounded ${
              variant === 'grid' 
                ? 'bg-retro-navy border-retro-border' 
                : 'bg-retro-gray border-retro-border'
            }`}
          >
            <Text className={`text-[10px] font-bold ${variant === 'grid' ? 'text-white' : 'text-retro-border'}`}>
              [B] Win95 Dialogs
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVariant('insights')}
            className={`px-3 py-1.5 border-2 rounded ${
              variant === 'insights' 
                ? 'bg-retro-navy border-retro-border' 
                : 'bg-retro-gray border-retro-border'
            }`}
          >
            <Text className={`text-[10px] font-bold ${variant === 'insights' ? 'text-white' : 'text-retro-border'}`}>
              [C] Analytics Panel
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 🏦 Stats Header (Wallet Pass) */}
      <View className="p-4 bg-retro-bg">
        <View className="bg-retro-card border-2 border-retro-border p-3 rounded-lg flex-row justify-between">
          <View className="flex-1 border-r border-retro-gray pr-3">
            <Text className="text-[10px] font-bold text-retro-darkgray uppercase">Net Expenses</Text>
            <Text className="text-xl font-mono font-bold text-retro-border">${totalSpent.toFixed(2)}</Text>
          </View>
          <View className="flex-1 border-r border-retro-gray px-3">
            <Text className="text-[10px] font-bold text-retro-darkgray uppercase">Active Windows</Text>
            <Text className="text-xl font-mono font-bold text-retro-teal">{activeReturnsCount} Returns</Text>
          </View>
          <View className="flex-1 pl-3">
            <Text className="text-[10px] font-bold text-retro-darkgray uppercase">Warranties</Text>
            <Text className="text-xl font-mono font-bold text-retro-navy">{activeWarrantiesCount} Active</Text>
          </View>
        </View>
      </View>

      {/* 🚀 Active Layout Rendering */}
      <ScrollView className="flex-1 px-4">
        {variant === 'list' && (
          <DashboardCleanList 
            receipts={receipts} 
            onSelectReceipt={setSelectedReceipt} 
          />
        )}
        {variant === 'grid' && (
          <DashboardRetroGrid 
            receipts={receipts} 
            onSelectReceipt={setSelectedReceipt} 
          />
        )}
        {variant === 'insights' && (
          <DashboardAnalytics 
            receipts={receipts} 
            pendingBills={pendingBills}
            budgetLimit={budgetLimit}
            totalSpent={totalSpent}
            onPayBill={handlePayBill}
            onIncreaseBudget={handleIncreaseBudget}
            onDecreaseBudget={handleDecreaseBudget}
          />
        )}
      </ScrollView>

      {/* 📑 Overlay Details Drawer */}
      {selectedReceipt && (
        <ReceiptDetailDrawer 
          receipt={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)}
          onDelete={handleDeleteReceipt}
        />
      )}
    </SafeAreaView>
  );
}
