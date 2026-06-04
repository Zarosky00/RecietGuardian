export interface ReceiptItem {
  id?: string;
  receipt_id?: string;
  name: string;
  price: number;
  category: string;
}

export interface Receipt {
  id: string;
  user_id?: string;
  store_name: string;
  total_amount: number;
  currency: string;
  purchase_date: string; // YYYY-MM-DD
  return_deadline: string | null; // YYYY-MM-DD
  warranty_expiry: string | null; // YYYY-MM-DD
  status: 'active' | 'returned' | 'expired' | 'refunded';
  is_reimbursable: boolean;
  is_tax_related: boolean;
  category: string;
  items: ReceiptItem[];
  created_at?: string;
}

export interface PendingBill {
  id: string;
  merchant: string;
  amount: number;
  due_date: string;
  category: string;
  is_paid: boolean;
}
