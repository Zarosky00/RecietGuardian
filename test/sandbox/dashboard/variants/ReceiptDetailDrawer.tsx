import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Receipt } from '@/types/receipt';

interface ReceiptDetailDrawerProps {
  receipt: Receipt;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function ReceiptDetailDrawer({ receipt, onClose, onDelete }: ReceiptDetailDrawerProps) {
  const isRefunded = receipt.status === 'refunded';

  return (
    <View className="absolute inset-0 bg-black/40 justify-end z-50">
      {/* Tap out spacer to close */}
      <Pressable className="flex-1" onPress={onClose} />

      {/* Slide Drawer Content (Classic Dialog Box style) */}
      <View className="bg-retro-bg border-t-2 border-l-2 border-r-2 border-retro-border rounded-t-2xl p-4 max-h-[75%]">
        
        {/* Bevel handle */}
        <View className="items-center mb-3">
          <View className="w-12 h-1.5 bg-retro-darkgray rounded-full" />
        </View>

        {/* Dialog Header */}
        <View className="bg-retro-navy p-2 flex-row justify-between items-center rounded mb-3">
          <Text className="text-white text-xs font-bold font-mono">📃 Document_Inspector.exe</Text>
          <Pressable onPress={onClose} className="bg-retro-gray px-1.5 border border-retro-border rounded">
            <Text className="text-[10px] text-retro-border font-bold">X</Text>
          </Pressable>
        </View>

        <ScrollView className="mb-4">
          {/* Main Info */}
          <View className="bg-retro-card border border-retro-border p-3 rounded mb-3">
            <Text className="text-[9px] font-bold text-retro-darkgray font-mono uppercase">Merchant</Text>
            <Text className="text-base font-bold text-retro-border font-mono mb-2">{receipt.store_name}</Text>
            
            <Text className="text-[9px] font-bold text-retro-darkgray font-mono uppercase">Total Paid</Text>
            <Text className={`text-xl font-bold font-mono ${isRefunded ? 'text-retro-darkgray line-through' : 'text-retro-border'}`}>
              {isRefunded ? '-' : ''}${receipt.total_amount.toFixed(2)} {receipt.currency}
            </Text>
          </View>

          {/* Dates & Deadlines */}
          <View className="bg-retro-card border border-retro-border p-3 rounded mb-3 space-y-2">
            <View>
              <Text className="text-[9px] font-bold text-retro-darkgray font-mono uppercase">Purchase Date</Text>
              <Text className="text-xs font-mono text-retro-border">{receipt.purchase_date}</Text>
            </View>

            <View className="h-[1px] bg-retro-gray" />

            <View>
              <Text className="text-[9px] font-bold text-retro-darkgray font-mono uppercase">Return Windows</Text>
              {isRefunded ? (
                <Text className="text-xs font-mono text-retro-darkgray">Item refunded — window closed</Text>
              ) : receipt.return_deadline ? (
                <Text className="text-xs font-mono font-bold text-retro-teal">
                  Active Coverage until {receipt.return_deadline}
                </Text>
              ) : (
                <Text className="text-xs font-mono text-retro-darkgray">No return deadline recorded</Text>
              )}
            </View>

            {receipt.warranty_expiry && (
              <>
                <View className="h-[1px] bg-retro-gray" />
                <View>
                  <Text className="text-[9px] font-bold text-retro-darkgray font-mono uppercase">Warranty Expiry</Text>
                  <Text className="text-xs font-mono font-bold text-retro-navy">
                    Manufacturer coverage until {receipt.warranty_expiry}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Itemized list */}
          <View className="bg-retro-card border border-retro-border p-3 rounded mb-2">
            <Text className="text-[9px] font-bold text-retro-darkgray font-mono uppercase mb-2">Itemized Breakdown</Text>
            
            {receipt.items.map((item, idx) => (
              <View key={idx} className="flex-row justify-between py-1 border-b border-retro-gray">
                <Text className="text-xs font-mono text-retro-border flex-1 mr-2">{item.name}</Text>
                <Text className="text-xs font-mono text-retro-border">${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row space-x-2">
          <Pressable
            onPress={onClose}
            className="flex-1 bg-retro-gray border-2 border-retro-border rounded py-2 items-center active:bg-retro-border"
          >
            <Text className="text-xs font-bold text-retro-border font-mono">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => onDelete(receipt.id)}
            className="flex-1 bg-red-600 border-2 border-retro-border rounded py-2 items-center active:opacity-90"
          >
            <Text className="text-xs font-bold text-white font-mono">Delete Log</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
