import { ExtractionResult } from './gemini';

export async function extractReceiptFallback(rawText: string, apiKey?: string): Promise<ExtractionResult> {
  // Mock Groq fallback parser
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rawText,
        receipt: {
          store_name: 'Fallback Store',
          total_amount: 100.00,
          currency: 'USD',
          purchase_date: new Date().toISOString().split('T')[0],
          category: 'Misc',
          status: 'active',
        },
      });
    }, 1000);
  });
}
