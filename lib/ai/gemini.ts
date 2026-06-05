import { Receipt } from '@/types/receipt';

export interface ExtractionResult {
  receipt: Partial<Receipt> | null;
  rawText: string;
  error?: string;
}

export async function extractReceiptFromImage(imageUri: string, apiKey?: string): Promise<ExtractionResult> {
  // Mock Gemini API extraction delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rawText: "MOCK RECEIPT TEXT:\nSTORE: Pear Electronics\nTOTAL: $1299.99\nDATE: 2026-05-28",
        receipt: {
          store_name: 'Pear Electronics Corp.',
          total_amount: 1299.99,
          currency: 'USD',
          purchase_date: '2026-05-28',
          category: 'Electronics',
          status: 'active',
        },
      });
    }, 1500);
  });
}
