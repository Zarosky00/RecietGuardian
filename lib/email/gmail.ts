import { Receipt } from '@/types/receipt';

export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedDate: string;
}

export function parseGmailReceipt(email: EmailMessage): Partial<Receipt> | null {
  // Simple regex-based receipt text parser
  const totalRegex = /total:\s*\$?(\d+(\.\d{2})?)/i;
  const totalMatch = email.body.match(totalRegex);
  const total = totalMatch ? parseFloat(totalMatch[1]) : 0;

  return {
    store_name: email.sender,
    total_amount: total,
    currency: 'USD',
    purchase_date: email.receivedDate,
    status: 'active',
    category: 'Email Ingestion',
    items: [],
  };
}
