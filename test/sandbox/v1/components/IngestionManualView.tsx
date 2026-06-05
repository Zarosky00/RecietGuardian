import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Platform } from 'react-native';
import { CheckIcon } from './SVGIcons';
import { useSandboxSettings } from '@/hooks/use-sandbox-settings';
import { Receipt, ReceiptItem } from '@/types/receipt';

interface IngestionManualViewProps {
  onAddReceipt: (r: Receipt) => void;
  onClose: () => void;
  onBack: () => void;
}

export const IngestionManualView: React.FC<IngestionManualViewProps> = ({
  onAddReceipt,
  onClose,
  onBack,
}) => {
  const { theme } = useSandboxSettings();

  // Manual entry states
  const [storeName, setStoreName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDays, setReturnDays] = useState('30');
  const [warrantyYears, setWarrantyYears] = useState('0');
  const [isTaxRelated, setIsTaxRelated] = useState(false);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Manual input item helper
  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) return;
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum)) return;

    setItems([...items, { name: newItemName.toUpperCase(), price: priceNum, category: category.toUpperCase() }]);
    
    // Auto-calculate total
    const currentTotal = items.reduce((acc, it) => acc + it.price, 0) + priceNum;
    setTotalAmount(currentTotal.toFixed(2));

    setNewItemName('');
    setNewItemPrice('');
  };

  const handleManualSubmit = () => {
    if (!storeName || !totalAmount) return;
    const amountNum = parseFloat(totalAmount);
    if (isNaN(amountNum)) return;

    // Calculate dates
    const purchase = new Date(purchaseDate);
    const returnDeadline = new Date(purchase);
    returnDeadline.setDate(returnDeadline.getDate() + parseInt(returnDays || '30'));
    
    let warrantyExpiry: string | null = null;
    const wYears = parseInt(warrantyYears || '0');
    if (wYears > 0) {
      const wExpiry = new Date(purchase);
      wExpiry.setFullYear(wExpiry.getFullYear() + wYears);
      warrantyExpiry = wExpiry.toISOString().split('T')[0];
    }

    const newRec: Receipt = {
      id: 'rec-manual-' + Math.random().toString(36).substring(7),
      store_name: storeName,
      total_amount: amountNum,
      currency: 'USD',
      purchase_date: purchaseDate,
      return_deadline: returnDeadline.toISOString().split('T')[0],
      warranty_expiry: warrantyExpiry,
      status: 'active',
      is_reimbursable: false,
      is_tax_related: isTaxRelated,
      category: category.toUpperCase(),
      items: items.length > 0 ? items : [{ name: 'Total Purchase', price: amountNum, category: category.toUpperCase() }],
      is_paid: true,
      document: {
        name: `${storeName.toLowerCase().replace(/\s+/g, '_')}_receipt.pdf`,
        type: 'pdf',
        size: '110 KB',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    };

    onAddReceipt(newRec);
    onClose();
  };

  return (
    <View style={styles.manualForm}>
      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>VENDOR NAME</Text>
        <TextInput
          style={[styles.formInput, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
          {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
          value={storeName}
          onChangeText={setStoreName}
          placeholder="e.g. Starbucks"
          placeholderTextColor={theme.textSecondary + '77'}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={[styles.formLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>AMOUNT ($)</Text>
          <TextInput
            style={[styles.formInput, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
            {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
            value={totalAmount}
            onChangeText={setTotalAmount}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary + '77'}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={[styles.formLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>CATEGORY</Text>
          <TextInput
            style={[styles.formInput, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
            {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
            value={category}
            onChangeText={setCategory}
            placeholder="GENERAL"
            placeholderTextColor={theme.textSecondary + '77'}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>TRANSACTION DATE</Text>
        <TextInput
          style={[styles.formInput, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
          {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.textSecondary + '77'}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={[styles.formLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>RETURN AUTH (DAYS)</Text>
          <TextInput
            style={[styles.formInput, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
            {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
            value={returnDays}
            onChangeText={setReturnDays}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={[styles.formLabel, { color: theme.textSecondary, fontFamily: 'Syne, sans-serif' }]}>WARRANTY SHIELD (YRS)</Text>
          <TextInput
            style={[styles.formInput, { borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
            {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
            value={warrantyYears}
            onChangeText={setWarrantyYears}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Tax Switcher */}
      <Pressable 
        style={styles.checkboxRow} 
        onPress={() => setIsTaxRelated(!isTaxRelated)}
      >
        <View style={[
          styles.checkbox, 
          { 
            borderColor: theme.accent, 
            backgroundColor: isTaxRelated ? theme.accent : 'transparent',
          }
        ]}>
          {isTaxRelated && <CheckIcon color={theme.bgGradStart} size={10} />}
        </View>
        <Text style={[styles.checkboxLabel, { color: theme.textPrimary, fontFamily: 'Sora, sans-serif' }]}>
          Mark Ledger Node as Tax Deductible
        </Text>
      </Pressable>

      {/* Add items table */}
      <View style={[styles.itemsFormSection, { borderTopColor: theme.glassBorder }]}>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>LEDGER LINE ITEMS BREAKDOWN</Text>
        
        {items.length > 0 && (
          <View style={styles.itemListContainer}>
            {items.map((it, idx) => (
              <View key={idx} style={[styles.itemBadgeRow, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder, borderRadius: 10 }]}>
                <Text style={{ color: theme.textPrimary, fontSize: 10, fontFamily: 'Sora, sans-serif' }}>{it.name.toLowerCase()}</Text>
                <Text style={{ color: theme.accent, fontSize: 10, fontFamily: 'Share Tech Mono, monospace', fontWeight: 'bold' }}>
                  ${it.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.formRow}>
          <TextInput
            style={[styles.formInput, { flex: 2, marginRight: 8, borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
            {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
            value={newItemName}
            onChangeText={setNewItemName}
            placeholder="Item Label"
            placeholderTextColor={theme.textSecondary + '77'}
          />
          <TextInput
            style={[styles.formInput, { flex: 1, marginRight: 8, borderColor: theme.glassBorder, backgroundColor: theme.cardBg, color: theme.textPrimary }]}
            {...Platform.select({ web: { className: 'premium-input' } as any, default: {} })}
            value={newItemPrice}
            onChangeText={setNewItemPrice}
            placeholder="Price"
            keyboardType="numeric"
            placeholderTextColor={theme.textSecondary + '77'}
          />
          <Pressable 
            style={[styles.addButton, { backgroundColor: 'transparent', borderColor: theme.accent, borderWidth: 1 }]}
            onPress={handleAddItem}
          >
            <Text style={{ color: theme.accent, fontWeight: 'bold', fontSize: 11, fontFamily: 'Syne, sans-serif' }}>ADD</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.formActionRow}>
        <Pressable 
          style={[styles.halfBtn, { borderColor: theme.glassBorder, borderWidth: 1, borderRadius: 12 }]}
          onPress={onBack}
        >
          <Text style={{ color: theme.textPrimary, fontFamily: 'Syne, sans-serif', fontSize: 11 }}>BACK</Text>
        </Pressable>
        <Pressable 
          style={[styles.halfBtn, { backgroundColor: theme.accent, borderRadius: 12 }]}
          onPress={handleManualSubmit}
        >
          <Text style={{ color: theme.bgGradStart, fontWeight: 'bold', fontFamily: 'Syne, sans-serif', fontSize: 11 }}>SAVE TO VAULT</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  manualForm: {
    paddingBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    borderRadius: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemsFormSection: {
    marginTop: 18,
    borderTopWidth: 1,
    paddingTop: 18,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  itemListContainer: {
    marginBottom: 14,
    gap: 8,
  },
  itemBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  addButton: {
    width: 60,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 8,
  },
  halfBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
