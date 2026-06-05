import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { EmailIcon } from './SVGIcons';
import { useSandboxSettings } from '@/hooks/use-sandbox-settings';
import { Receipt, ReceiptItem } from '@/types/receipt';

interface IngestionEmailViewProps {
  onAddReceipt: (r: Receipt) => void;
  onClose: () => void;
}

export const IngestionEmailView: React.FC<IngestionEmailViewProps> = ({
  onAddReceipt,
  onClose,
}) => {
  const { theme, addSyncLog, setIsSyncing } = useSandboxSettings();
  const [emailTemplateSyncing, setEmailTemplateSyncing] = useState<string | null>(null);

  const runEmailSync = (title: string, store: string, total: number, cat: string, itemsList: ReceiptItem[]) => {
    setEmailTemplateSyncing(title);
    setIsSyncing(true);
    addSyncLog(`MAIL_SYNC: Intercepted payload from sync mailbox.`, 'info');
    
    setTimeout(() => {
      addSyncLog(`MAIL_SYNC: Signature verification OK.`, 'info');
      
      setTimeout(() => {
        const newRec: Receipt = {
          id: 'rec-mail-' + Math.random().toString(36).substring(7),
          store_name: store,
          total_amount: total,
          currency: 'USD',
          purchase_date: new Date().toISOString().split('T')[0],
          return_deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          warranty_expiry: null,
          status: 'active',
          is_reimbursable: true,
          is_tax_related: false,
          is_paid: true,
          category: cat.toUpperCase(),
          items: itemsList,
          document: {
            name: `${store.toLowerCase().replace(/\s+/g, '_')}_invoice.pdf`,
            type: 'pdf',
            size: '95 KB',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
          }
        };
        
        onAddReceipt(newRec);
        setIsSyncing(false);
        setEmailTemplateSyncing(null);
        addSyncLog(`MAIL_SYNC: Ingested ride receipt: ${store} ($${total.toFixed(2)})`, 'success');
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <View style={styles.emailContainer}>
      <Text style={[styles.subHeading, { color: theme.textPrimary, fontFamily: 'Syne, sans-serif' }]}>SECURE INBOUND FORWARD ADDRESS</Text>
      <View style={[styles.emailBox, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}>
        <Text style={[styles.emailAddressText, { color: theme.textPrimary, fontFamily: 'Share Tech Mono, monospace', fontSize: 10 }]}>
          vault-ingest-883a@receiptguardian.com
        </Text>
        <Pressable 
          style={[styles.copyBtn, { backgroundColor: 'transparent', borderColor: theme.accent, borderWidth: 1 }]}
          onPress={() => {
            addSyncLog('Copied dynamic secure mailbox.', 'info');
          }}
        >
          <Text style={{ color: theme.accent, fontSize: 9, fontFamily: 'Syne, sans-serif', fontWeight: 'bold' }}>COPY</Text>
        </Pressable>
      </View>
      <Text style={[styles.emailHelpText, { color: theme.textSecondary, fontFamily: 'Sora, sans-serif' }]}>
        Forward digital invoices directly to this mailbox. They will pass cryptographic checks and list inside your workspace ledger.
      </Text>

      <View style={[styles.separator, { backgroundColor: theme.glassBorder }]} />

      <Text style={[styles.subHeading, { color: theme.textPrimary, marginBottom: 12, fontFamily: 'Syne, sans-serif' }]}>
        SIMULATE MAIL SYNC EMULATION
      </Text>
      
      <View style={styles.templateList}>
        <Pressable
          style={[styles.templateCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
          onPress={() => runEmailSync(
            'Amazon Inbound',
            'AMAZON.COM',
            42.99,
            'ELECTRONICS',
            [{ name: 'ANKER POWER BANK 20K', price: 42.99, category: 'ELECTRONICS' }]
          )}
        >
          <View style={styles.templateLeftCol}>
            <View style={styles.templateIconBox}>
              <EmailIcon color={theme.accent} size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textPrimary, fontWeight: '700', fontFamily: 'Syne, sans-serif', fontSize: 11 }}>Amazon.com Delivery Invoice</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 9, fontFamily: 'Sora, sans-serif', marginTop: 2 }}>VAL: $42.99 • DKIM Signature OK</Text>
            </View>
          </View>
          {emailTemplateSyncing === 'Amazon Inbound' ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <Text style={{ color: theme.accent, fontSize: 10, fontFamily: 'Syne, sans-serif', fontWeight: 'bold' }}>SYNC NODE</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.templateCard, { backgroundColor: theme.cardBg, borderColor: theme.glassBorder }]}
          onPress={() => runEmailSync(
            'Uber Inbound',
            'UBER RIDES',
            24.50,
            'DINING',
            [{ name: 'RIDE TO TAX OFFICE', price: 24.50, category: 'TRANSPORT' }]
          )}
        >
          <View style={styles.templateLeftCol}>
            <View style={styles.templateIconBox}>
              <EmailIcon color={theme.accent} size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textPrimary, fontWeight: '700', fontFamily: 'Syne, sans-serif', fontSize: 11 }}>Uber Rides Transit Slip</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 9, fontFamily: 'Sora, sans-serif', marginTop: 2 }}>VAL: $24.50 • SHA-256 Sign OK</Text>
            </View>
          </View>
          {emailTemplateSyncing === 'Uber Inbound' ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <Text style={{ color: theme.accent, fontSize: 10, fontFamily: 'Syne, sans-serif', fontWeight: 'bold' }}>SYNC NODE</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emailContainer: {
    paddingBottom: 16,
  },
  subHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  emailBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  emailAddressText: {
    flex: 1,
  },
  copyBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  emailHelpText: {
    fontSize: 9,
    lineHeight: 13,
    marginBottom: 20,
    opacity: 0.6,
  },
  separator: {
    height: 1,
    marginVertical: 20,
  },
  templateList: {
    gap: 10,
  },
  templateCard: Platform.select({
    web: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      transition: 'all 0.2s ease',
    },
    default: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
    }
  }) as any,
  templateLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  templateIconBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
