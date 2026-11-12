// Simulated intelligent Receipt OCR Service
// Extracts Merchant, Date, Amount, and Category with confidence score

export interface OcrExtractionResult {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  confidence: number;
  rawTextPreview: string;
  detectedPaymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash';
}

export const sampleReceiptTemplates = [
  {
    name: 'Organic Grocery Supermarket',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    data: {
      merchant: "Nature's Basket Organic Groceries",
      amount: 3450,
      date: new Date().toISOString().split('T')[0],
      category: 'Groceries',
      confidence: 96,
      rawTextPreview: "NATURE'S BASKET LTD\nGSTIN: 27AABCN1234F1Z\nINV #NB-8821\n1x Himalayan Pink Salt ₹180\n2x Cold-Pressed Mustard Oil ₹640\n1x Farm Fresh Organic Veggies ₹1250\n1x A2 Organic Cow Milk ₹380\nSUBTOTAL: ₹2950\nCGST+SGST: ₹500\nTOTAL: ₹3450\nPAID VIA: UPI / GPAY",
      detectedPaymentMethod: 'UPI' as const
    }
  },
  {
    name: 'Tech & Coworking Hub',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    data: {
      merchant: 'WeWork Coworking & Fiber',
      amount: 8500,
      date: new Date().toISOString().split('T')[0],
      category: 'Workspace / Rent',
      confidence: 98,
      rawTextPreview: 'WEWORK INDIA PRIVATE LIMITED\nTAX INVOICE #WW-2026-901\nDedicated Desk Membership (Nov 2026)\nHigh-speed fiber broadband included\nTOTAL AMOUNT: ₹8,500.00\nPAYMENT: HDFC Corporate Debit Card ending **4012\nSTATUS: SUCCESSFUL',
      detectedPaymentMethod: 'Debit Card' as const
    }
  },
  {
    name: 'Digital Hardware & Office Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    data: {
      merchant: 'Croma Electronics Retail',
      amount: 4200,
      date: new Date().toISOString().split('T')[0],
      category: 'Office / Shopping',
      confidence: 94,
      rawTextPreview: 'CROMA - INFINITI RETAIL LTD\nStore: Indiranagar, Bengaluru\nItem: Logitech Ergonomic Wireless Keyboard\nSerial: 26019A82\nTotal Paid: ₹4,200\nAuth Code: 881290\nCard: Visa Platinum',
      detectedPaymentMethod: 'Credit Card' as const
    }
  }
];

export async function processReceiptOcr(fileOrTemplateUrl: string): Promise<OcrExtractionResult> {
  // Simulate OCR model inference delay (500ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const matched = sampleReceiptTemplates.find((t) => t.imageUrl === fileOrTemplateUrl);
  if (matched) {
    return matched.data;
  }

  // Fallback heuristic extraction for arbitrary uploads
  return {
    merchant: 'Merchant Bill / Invoice',
    amount: 1850,
    date: new Date().toISOString().split('T')[0],
    category: 'Shopping',
    confidence: 88,
    rawTextPreview: `TAX INVOICE\nDATE: ${new Date().toLocaleDateString()}\nITEM TOTAL: ₹1,850\nPAYMENT MODE: UPI AUTO-VERIFIED\nTHANK YOU FOR SHOPPING!`,
    detectedPaymentMethod: 'UPI'
  };
}

