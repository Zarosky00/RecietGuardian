import mockReceiptsData from './mock-receipts.json';
import { Receipt, PendingBill } from '@/types/receipt';

export function getMockReceipts(): Receipt[] {
  return mockReceiptsData as unknown as Receipt[];
}

export function getMockPendingBills(): PendingBill[] {
  return [
    {
      "id": "bill-201",
      "merchant": "Global Cloud Services",
      "amount": 25.00,
      "due_date": "2026-06-15",
      "category": "Tech",
      "is_paid": false
    },
    {
      "id": "bill-202",
      "merchant": "Corporate Domain Registrar",
      "amount": 12.00,
      "due_date": "2026-06-18",
      "category": "Office",
      "is_paid": false
    },
    {
      "id": "bill-203",
      "merchant": "Server Rent Co",
      "amount": 40.00,
      "due_date": "2026-06-10",
      "category": "Tech",
      "is_paid": false
    }
  ];
}
