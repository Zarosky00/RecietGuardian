import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Receipt } from '@/types/receipt';

interface DashboardCleanListProps {
  receipts: Receipt[];
  onSelectReceipt: (receipt: Receipt) => void;
}

export function DashboardCleanList({ receipts, onSelectReceipt }: DashboardCleanListProps) {
  return (
    <View className="mb-8">
      {/* List Window Frame */}
      <View className="bg-retro-card border-2 border-retro-border rounded-lg overflow-hidden">
        {/* Title Bar */}
        <View className="bg-retro-navy px-3 py-1 flex-row justify-between items-center">
          <Text className="text-white text-xs font-bold font-mono">📂 C:\Receipt_Guardian\Vault</Text>
          <Text className="text-white text-[10px] font-mono">{receipts.length} item(s)</Text>
        </View>

        {/* Column Headers */}
        <View className="flex-row bg-retro-gray border-b border-retro-border py-1.5 px-3">
          <Text className="flex-[2] text-[10px] font-bold text-retro-border font-mono">Merchant</Text>
          <Text className="flex-1 text-[10px] font-bold text-retro-border text-center font-mono">Category</Text>
          <Text className="flex-1 text-[10px] font-bold text-retro-border text-right font-mono">Amount</Text>
          <Text className="w-16 text-[10px] font-bold text-retro-border text-center font-mono">Deadline</Text>
        </View>

        {/* Rows */}
        {receipts.length === 0 ? (
          <View className="p-8 justify-center items-center">
            <Text className="text-retro-darkgray text-xs font-mono">Vault is empty.</Text>
          </View>
        ) : (
          receipts.map((receipt) => {
            const isRefunded = receipt.status === 'refunded';
            
            return (
              <Pressable
                key={receipt.id}
                onPress={() => onSelectReceipt(receipt)}
                className="flex-row items-center border-b border-retro-gray py-3 px-3 active:bg-retro-gray"
              >
                {/* Store Name & Folder Icon */}
                <View className="flex-[2] flex-row items-center">
                  <Text className="text-xs mr-2">📄</Text>
                  <Text className="text-xs font-bold text-retro-border font-mono numberOfLines={1}">
                    {receipt.store_name}
                  </Text>
                </View>

                {/* Category */}
                <View className="flex-1 items-center justify-center">
                  <View className="bg-retro-gray border border-retro-darkgray rounded px-1.5 py-0.5">
                    <Text className="text-[9px] font-bold text-retro-darkgray font-mono">{receipt.category}</Text>
                  </View>
                </View>

                {/* Amount */}
                <Text 
                  className={`flex-1 text-xs font-mono font-bold text-right ${
                    isRefunded ? 'text-retro-darkgray' : 'text-retro-border'
                  }`}
                >
                  {isRefunded ? '-' : ''}${receipt.total_amount.toFixed(2)}
                </Text>

                {/* Return Expiry Indicator */}
                <View className="w-16 items-center">
                  {receipt.status === 'refunded' ? (
                    <Text className="text-[9px] font-mono text-retro-darkgray">[REFUND]</Text>
                  ) : receipt.return_deadline ? (
                    <View className="bg-retro-teal rounded px-1 py-0.5">
                      <Text className="text-[8px] font-bold text-white font-mono">ACTIVE</Text>
                    </View>
                  ) : (
                    <Text className="text-[9px] font-mono text-retro-darkgray">[NONE]</Text>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}
