import { useState, useEffect } from 'react';
import { Receipt } from '@/types/receipt';
import { useSandboxSettings } from '@/hooks/use-sandbox-settings';

export const DEMO_RECEIPTS: Receipt[] = [
  {
    id: 'rec-apple-123',
    store_name: 'Apple Store',
    total_amount: 1299.00,
    currency: 'USD',
    purchase_date: '2026-05-15',
    return_deadline: '2026-06-15',
    warranty_expiry: '2027-05-15',
    status: 'active',
    is_reimbursable: false,
    is_tax_related: true,
    is_paid: true,
    category: 'Electronics',
    items: [
      { name: 'MacBook Air M3', price: 1199.00, category: 'Electronics' },
      { name: 'USB-C Multiport Adapter', price: 100.00, category: 'Electronics' }
    ],
    document: {
      name: 'apple_store_invoice_123.pdf',
      type: 'pdf',
      size: '245 KB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  },
  {
    id: 'rec-pge-456',
    store_name: 'Pacific Gas & Electric',
    total_amount: 184.50,
    currency: 'USD',
    purchase_date: '2026-06-01',
    return_deadline: '2026-06-01', // Bills generally don't have return deadlines
    warranty_expiry: null,
    status: 'active',
    is_reimbursable: false,
    is_tax_related: false,
    is_paid: false, // Unpaid bill
    due_date: '2026-06-15',
    category: 'Utilities',
    items: [
      { name: 'Electricity Charge May 2026', price: 184.50, category: 'Utilities' }
    ],
    document: {
      name: 'pge_statement_june2026.pdf',
      type: 'pdf',
      size: '184 KB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  },
  {
    id: 'rec-starbucks-789',
    store_name: 'Starbucks Coffee',
    total_amount: 18.75,
    currency: 'USD',
    purchase_date: '2026-06-03',
    return_deadline: '2026-06-03', // Past return window
    warranty_expiry: null,
    status: 'active',
    is_reimbursable: true,
    is_tax_related: false,
    is_paid: true,
    category: 'Dining',
    items: [
      { name: 'Caramel Macchiato Large', price: 6.25, category: 'Dining' },
      { name: 'Avocado Sourdough Toast', price: 8.50, category: 'Dining' },
      { name: 'Stainless steel straw', price: 4.00, category: 'Merchandise' }
    ],
    document: {
      name: 'starbucks_receipt_789.png',
      type: 'png',
      size: '92 KB',
      url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop'
    }
  },
  {
    id: 'rec-nike-101',
    store_name: 'Nike Store',
    total_amount: 120.00,
    currency: 'USD',
    purchase_date: '2026-05-28',
    return_deadline: '2026-06-10', // Expiring in 6 days
    warranty_expiry: null,
    status: 'active',
    is_reimbursable: false,
    is_tax_related: false,
    is_paid: true,
    category: 'Clothing',
    items: [
      { name: 'Pegasus Running Shoes', price: 120.00, category: 'Clothing' }
    ],
    document: {
      name: 'nike_store_invoice.pdf',
      type: 'pdf',
      size: '144 KB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  },
  {
    id: 'rec-bestbuy-202',
    store_name: 'Best Buy',
    total_amount: 450.00,
    currency: 'USD',
    purchase_date: '2025-12-01',
    return_deadline: '2025-12-15', // Past return window
    warranty_expiry: '2026-12-01', // Active warranty (6 months left)
    status: 'active',
    is_reimbursable: false,
    is_tax_related: false,
    is_paid: true,
    category: 'Appliances',
    items: [
      { name: 'Dyson V8 Vacuum Cleaner', price: 450.00, category: 'Appliances' }
    ],
    document: {
      name: 'bestbuy_dyson_invoice.jpg',
      type: 'jpg',
      size: '310 KB',
      url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600&auto=format&fit=crop'
    }
  },
  {
    id: 'rec-adobe-303',
    store_name: 'Adobe Creative Cloud',
    total_amount: 54.99,
    currency: 'USD',
    purchase_date: '2026-05-20',
    return_deadline: '2026-05-20',
    warranty_expiry: null,
    status: 'active',
    is_reimbursable: false,
    is_tax_related: true, // Business Tax Deductible
    is_paid: true,
    category: 'Software',
    items: [
      { name: 'Adobe Creative Cloud Monthly', price: 54.99, category: 'Software' }
    ],
    document: {
      name: 'adobe_cc_subscription.pdf',
      type: 'pdf',
      size: '80 KB',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  },
  {
    id: 'rec-walmart-404',
    store_name: 'Walmart Supercenter',
    total_amount: 89.00,
    currency: 'USD',
    purchase_date: '2024-05-01',
    return_deadline: '2024-05-15',
    warranty_expiry: '2025-05-01', // Expired warranty!
    status: 'expired',
    is_reimbursable: false,
    is_tax_related: false,
    is_paid: true,
    category: 'Appliances',
    items: [
      { name: 'Digital Countertop Microwave', price: 89.00, category: 'Appliances' }
    ],
    document: {
      name: 'walmart_receipt_microwave.png',
      type: 'png',
      size: '115 KB',
      url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=600&auto=format&fit=crop'
    }
  }
];

export function useReceipts() {
  const { networkSpeed, forceError, addSyncLog } = useSandboxSettings();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);

    // Latency simulator
    let delay = 300;
    if (networkSpeed === 'slow') {
      delay = 2500;
      addSyncLog('Simulating slow 3G latency (2.5s network throttle)...', 'warn');
    }

    const timer = setTimeout(() => {
      if (forceError) {
        setError(new Error('Simulated Database Connection Failure (Error Code: 503)'));
        addSyncLog('Mock Error Injected: Database fetch failed with code 503.', 'error');
        setLoading(false);
        return;
      }

      if (networkSpeed === 'offline') {
        setError(new Error('No internet connection. Fetch aborted.'));
        addSyncLog('Mock Error: Network is offline.', 'error');
        setLoading(false);
        return;
      }

      // Default start is seeded with demo receipts for rich first-glance dashboard
      // If user wants to reset or start empty they can do so in Settings.
      setReceipts((prev) => (prev.length === 0 ? DEMO_RECEIPTS : prev));
      setLoading(false);
      addSyncLog('Fetched receipts list successfully.', 'success');
    }, delay);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    loadData();
  }, [networkSpeed, forceError]);

  const addReceipt = (newReceipt: Receipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
    addSyncLog(`Added receipt: ${newReceipt.store_name} ($${newReceipt.total_amount.toFixed(2)})`, 'success');
  };

  const updateReceipt = (updated: Receipt) => {
    setReceipts((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    addSyncLog(`Updated receipt: ${updated.store_name}`, 'info');
  };

  const deleteReceipt = (id: string) => {
    const target = receipts.find((r) => r.id === id);
    setReceipts((prev) => prev.filter((r) => r.id !== id));
    if (target) {
      addSyncLog(`Deleted receipt: ${target.store_name}`, 'warn');
    }
  };

  const seedDemoData = () => {
    setReceipts(DEMO_RECEIPTS);
    setError(null);
    addSyncLog('Reset local state and seeded demo receipts database.', 'success');
  };

  const clearAllData = () => {
    setReceipts([]);
    setError(null);
    addSyncLog('Truncated local database. Ready for ingestion testing.', 'warn');
  };

  return {
    receipts,
    loading,
    error,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    seedDemoData,
    clearAllData,
    refetch: loadData,
  };
}
