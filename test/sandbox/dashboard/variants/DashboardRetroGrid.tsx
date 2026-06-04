import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Receipt } from '@/types/receipt';

interface DashboardRetroGridProps {
  receipts: Receipt[];
  onSelectReceipt: (receipt: Receipt) => void;
}

export function DashboardRetroGrid({ receipts, onSelectReceipt }: DashboardRetroGridProps) {
  return (
    <View className="mb-8 flex-row flex-wrap justify-between">
      {receipts.map((receipt) => {
        const isRefunded = receipt.status === 'refunded';
        
        return (
          <Pressable
            key={receipt.id}
            onPress={() => onSelectReceipt(receipt)}
            className="w-[48%] mb-4 bg-retro-card border-2 border-retro-border rounded-lg shadow-sm active:opacity-90"
          >
            {/* Card Header (Classic Window Title Bar) */}
            <View className="bg-retro-navy px-2 py-1 flex-row justify-between items-center rounded-t-[5px]">
              <Text className="text-[10px] font-bold text-white font-mono numberOfLines={1}">
                {receipt.store_name}
              </Text>
              <Text className="text-[9px] text-white">🗖</Text>
            </View>

            {/* Card Body */}
            <View className="p-3">
              {/* Category & Status */}
              <View className="flex-row justify-between items-center mb-2">
                <View className="bg-retro-gray border border-retro-darkgray rounded px-1.5 py-0.5">
                  <Text className="text-[8px] font-bold text-retro-darkgray font-mono uppercase">{receipt.category}</Text>
                </View>
                {isRefunded && (
                  <View className="bg-retro-darkgray rounded px-1 py-0.25">
                    <Text className="text-[8px] font-bold text-white font-mono">REFUNDED</Text>
                  </View>
                )}
              </View>

              {/* Price Tag */}
              <Text className={`text-lg font-mono font-bold ${isRefunded ? 'text-retro-darkgray line-through' : 'text-retro-border'}`}>
                {isRefunded ? '-' : ''}${receipt.total_amount.toFixed(2)}
              </Text>

              {/* Line Divider */}
              <View className="h-[1px] bg-retro-gray my-2" />

              {/* Return Window Countdown */}
              <View>
                {isRefunded ? (
                  <Text className="text-[9px] font-mono text-retro-darkgray">Returned & Settled</Text>
                ) : receipt.return_deadline ? (
                  <View className="flex-row items-center">
                    <Text className="text-[10px] mr-1">🕒</Text>
                    <Text className="text-[9px] font-mono font-bold text-retro-teal">
                      Deadline: {receipt.return_deadline}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-[9px] font-mono text-retro-darkgray">No return window</Text>
                )}
              </View>

              {/* Items Summary Count */}
              <Text className="text-[8px] text-retro-darkgray font-mono mt-1">
                Contains {receipt.items.length} item(s)
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
