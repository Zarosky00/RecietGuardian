export interface ReceiptItem {
  name: string;
  price: number;
  category: string;
}

export type ReceiptStatus = 'active' | 'expired' | 'refunded';

export interface ReceiptDocument {
  name: string;
  type: 'pdf' | 'png' | 'jpg';
  size: string;
  url: string;
}

export interface Receipt {
  id: string;
  store_name: string;
  total_amount: number;
  currency: string;
  purchase_date: string;
  return_deadline: string;
  warranty_expiry: string | null;
  status: ReceiptStatus;
  is_reimbursable: boolean;
  is_tax_related: boolean;
  category: string;
  items: ReceiptItem[];
  is_paid?: boolean;
  due_date?: string;
  document?: ReceiptDocument;
}

