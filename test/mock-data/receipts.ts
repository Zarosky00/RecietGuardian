export interface ReceiptItem {
  name: string;
  price: number;
  category: string;
}

export interface Receipt {
  id: string;
  merchant: string;
  purchaseDate: string;
  returnDeadline: string;
  totalAmount: number;
  items: ReceiptItem[];
  status: 'active' | 'refunded' | 'expired';
  isTaxRelated: boolean;
  isReimbursable: boolean;
  category: string;
  orderNumber: string;
  paymentMethod: string;
  warrantyExpiry?: string;
}

export const mockReceipts: Receipt[] = [
  {
    id: 'RG-1049',
    merchant: 'Pear Electronics Corp.',
    purchaseDate: '2026-05-28',
    returnDeadline: '2026-06-07', // 3 days from local current time (2026-06-04)
    totalAmount: 1299.99,
    category: 'Electronics',
    orderNumber: 'ORD-984321-PEAR',
    paymentMethod: 'Amex ending 4002',
    status: 'active',
    isTaxRelated: true,
    isReimbursable: true,
    warrantyExpiry: '2027-05-28',
    items: [
      { name: 'PearBook Pro 14"', price: 1199.99, category: 'Electronics' },
      { name: 'USB-C Multi-Hub Adaptor', price: 79.99, category: 'Accessories' },
      { name: 'Premium Care Protection Plan', price: 20.00, category: 'Services' },
    ]
  },
  {
    id: 'RG-1048',
    merchant: 'Nouveau Chic Clothing',
    purchaseDate: '2026-05-15',
    returnDeadline: '2026-05-30', // Already expired return window
    totalAmount: 245.50,
    category: 'Apparel',
    orderNumber: 'ORD-87114-NC',
    paymentMethod: 'Visa ending 1089',
    status: 'active',
    isTaxRelated: false,
    isReimbursable: false,
    items: [
      { name: 'Tailored Wool Blazer', price: 180.00, category: 'Apparel' },
      { name: 'Silk Button-down Shirt', price: 65.50, category: 'Apparel' }
    ]
  },
  {
    id: 'RG-1047',
    merchant: 'Megacorp Office Supply',
    purchaseDate: '2026-05-22',
    returnDeadline: '2026-06-22', // Safe return window (18 days left)
    totalAmount: 389.20,
    category: 'Office',
    orderNumber: 'ORD-449102-MC',
    paymentMethod: 'Corporate Visa 8820',
    status: 'active',
    isTaxRelated: true,
    isReimbursable: true,
    warrantyExpiry: '2028-05-22',
    items: [
      { name: 'Ergonomic Task Chair Mk.II', price: 349.00, category: 'Office Furniture' },
      { name: 'Recycled Printer Paper (Box)', price: 40.20, category: 'Office Supplies' }
    ]
  },
  {
    id: 'RG-1046',
    merchant: 'Adventure Quest Outfitters',
    purchaseDate: '2026-05-10',
    returnDeadline: '2026-06-09', // Safe return window (5 days left)
    totalAmount: 112.40,
    category: 'Sports & Outdoors',
    orderNumber: 'ORD-722109-AQ',
    paymentMethod: 'Mastercard ending 5510',
    status: 'refunded', // Refunded - will deduct from Net Spending ledger!
    isTaxRelated: false,
    isReimbursable: false,
    items: [
      { name: 'All-Weather Waterproof Jacket', price: 89.90, category: 'Apparel' },
      { name: 'Heavy Duty Camping Stakes (4pk)', price: 22.50, category: 'Hardware' }
    ]
  },
  {
    id: 'RG-1045',
    merchant: 'Apex Tool Warehouse',
    purchaseDate: '2026-05-01',
    returnDeadline: '2026-05-15', // Expired
    totalAmount: 532.10,
    category: 'Hardware',
    orderNumber: 'ORD-300481-APX',
    paymentMethod: 'Visa ending 1089',
    status: 'active',
    isTaxRelated: true,
    isReimbursable: false,
    warrantyExpiry: '2029-05-01',
    items: [
      { name: 'Heavy Duty Rotary Hammer Drill', price: 420.00, category: 'Hardware' },
      { name: 'Concrete Drill Bits Set', price: 75.00, category: 'Hardware' },
      { name: 'Premium Heavy Duty Carry Case', price: 37.10, category: 'Hardware' }
    ]
  },
  {
    id: 'RG-1044',
    merchant: 'Organic Harvest Foods',
    purchaseDate: '2026-06-02',
    returnDeadline: '2026-06-05', // Expiring in 1 day! (Immediate action)
    totalAmount: 76.80,
    category: 'Groceries',
    orderNumber: 'ORD-228190-OH',
    paymentMethod: 'Debit Card ending 0049',
    status: 'active',
    isTaxRelated: false,
    isReimbursable: false,
    items: [
      { name: 'Premium Cold Press Olive Oil', price: 42.00, category: 'Foods' },
      { name: 'Organic Artisanal Cheese Tray', price: 34.80, category: 'Foods' }
    ]
  }
];

export const mockPendingBills = [
  {
    id: 'PB-201',
    merchant: 'AWS Cloud Services',
    dueDate: '2026-06-15',
    amount: 148.92,
    category: 'Infrastructure',
    isTaxRelated: true,
    isReimbursable: true
  },
  {
    id: 'PB-202',
    merchant: 'Creative Suite Monthly SaaS',
    dueDate: '2026-06-20',
    amount: 54.99,
    category: 'Software License',
    isTaxRelated: true,
    isReimbursable: false
  },
  {
    id: 'PB-203',
    merchant: 'Office Broadband Corp.',
    dueDate: '2026-06-25',
    amount: 85.00,
    category: 'Utilities',
    isTaxRelated: true,
    isReimbursable: true
  }
];
