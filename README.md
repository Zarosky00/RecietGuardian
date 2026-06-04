# Receipt Guardian (Mobile Client)

> Never miss a return window or tax deduction again.

Receipt Guardian is a cross-platform mobile application built with **React Native and Expo**. It acts as your private financial command center—automatically extracting return deadlines, manufacturer warranties, pricing details, and tax categories from forwarded emails, scanned photos, or PDFs using a tiered AI strategy (Gemini + Groq).

---

## 🚀 Key Features & Modules

### 1. Ingestion Pipelines
* **Gmail Auto-Fetch:** Scans Gmail inboxes for order receipts via API keys/tokens. Allows toggling sync checks, adjusting days/limit depth, and displaying terminal-style scan logs.
* **Manual Mail Forwarding:** Generates a custom personal forwarding address so users can forward receipts directly.
* **AI Text Extractor:** An input area where users paste raw email/receipt body text, which is parsed into a structured receipt by Gemini/Groq.
* **Direct Camera Scanning (Scan Camera):** Interface for using the device camera to take physical receipt photos.
* **Direct File Upload (Upload File):** Uploads PDF, JPG, and PNG receipts/invoices.

### 2. 💳 The Expense Tracking System
Receipt Guardian goes beyond tracking return deadlines by serving as an interactive personal expense ledger:
* **Receipt-to-Expense Mapping:** Every scanned or forwarded receipt is mapped directly into your spending history.
* **Refund Deduction Math:** Any receipt record marked as `status === "refunded"` contains a negative representation of the price. The system automatically computes your net monthly spending:
  $$\text{Net Spending} = \sum(\text{Active/Warranty Receipts}) - \sum(\text{Refunded Receipts})$$
* **Interactive Budget Thresholds:** Tracks spending against a monthly budget limit set in your profile.
  * **Green (< 80%):** Healthy spending state.
  * **Amber (80% - 99%):** Warning highlight (nearing limit).
  * **Red (>= 100%):** Alert (over budget limit).
* **Pending Bills Ledger:** A dedicated screen to log unpaid incoming invoices. Tapping "Pay Bill" dynamically transitions the item out of the pending ledger and into the active database expense feed.
* **Category Scroller:** Filters receipt cards dynamically across segments (Food, Tech, Apparel, Home, Travel, etc.).

### 3. 📄 The Tax & Reimbursement System
Simplifies tax filing and corporate expense reports:
* **Tax Dedutibility Identification:** The AI extraction engine identifies and tags tax-deductible items from receipts based on merchants, items, or user manually selected parameters.
* **Reimbursements:** Tracks business expenses with a toggle switch (`is_reimbursable: boolean`) to distinguish personal outlays from company out-of-pocket costs.
* **Tax Flags:** Marks transactions as tax-related (`is_tax_related: boolean`) to easily compile and export audited records for tax season.

---

## 🛠️ Project Structure

Following a strict **decoupled, uncluttered architecture**, the directories are structured as follows:

```
Receipt Guardian/
├── 📁 app/               # Expo Router Screen components & layouts
├── 📁 components/        # Visual components (ui/, layout/, features/)
├── 📁 hooks/             # Custom state hooks (e.g. useReceipts, useCamera)
├── 📁 lib/               # Pure libraries (ai/, email/, supabase/)
├── 📁 types/             # Core TypeScript interfaces
└── 📁 test/              # Sandbox playground (sandbox/, mock-data/, scripts/)
```

*Note: All development, visual experimentation, and testing occur inside `test/sandbox/` using mock data factories. Production folders (`app/`, `components/`) remain 100% clean and compile-ready.*

---

## 🏃‍♂️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
# Start the Expo bundler
npm run start

# Run specifically on Android emulator
npm run android

# Run specifically on iOS simulator
npm run ios
```

*To preview on a physical phone, download the **Expo Go** app from the App Store or Google Play Store and scan the QR code printed in the terminal.*

---

## 🔒 AI Assistant Guardrails
All AI coding assistants editing this workspace must adhere to these two safety rules:
1. **Absolute Path Aliases Only:** Never write relative imports (e.g., `../../../../`). You must use absolute paths prefixed with `@/` (e.g., `@/components/ui/button`) to support plug-and-play directory transitions.
2. **No Placeholder Code Truncation:** Do not replace working code logic with placeholder comments (e.g., `// ... rest of the code here`). Always write complete, functional blocks.
