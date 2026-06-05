# Receipt Guardian (React Native & Expo)

> Never miss a return window again. Mobile-first receipt management, AI metadata extraction, and smart return alerts.

---

> [!IMPORTANT]
> **DEVELOPER COMPLIANCE & RULES BOOK**
> Before performing any task, creating files, or writing code, **all human developers and AI coding assistants must strictly read and adhere to** the [Developer Rules & Code Quality Standards](file:///d:/coding/crazy%20idea/Receipt%20Guardian/docs/developer-rules.md).
> 
> AI assistants: open and anchor [developer-rules.md](file:///d:/coding/crazy%20idea/Receipt%20Guardian/docs/developer-rules.md) as the first step of any session (compliance with Rule 6 is mandatory).

---

## Overview

Receipt Guardian is an integrated mobile application designed for iOS, Android, and Web built using **React Native**, **Expo SDK**, and **TypeScript**. 

Forward your order confirmation emails or scan paper receipts. Receipt Guardian automatically extracts itemized metadata, cost metrics, warranties, and return deadlines using Gemini AI, securing them inside a local and cloud-synced vault ledger.

### Core Capabilities
* **Receipt-to-Expense Ledger:** Net spending computation, tracking active cash-flows, and automatic refund deductions.
* **Interactive Budget Indicators:** Progress tracking with custom alert thresholds (Amber at 80%, Red at 100%).
* **Tax & Reimbursement Workspace:** Flagging write-offs, tracking reimbursable corporate expenses, and compiling ledger logs for CSV export.
* **Smart Alert Calendars:** Automatic monitoring of active return windows and warranty ranges with alerts before deadlines expire.

---

## Subdirectory Boundaries

Receipt Guardian follows a strict directory responsibility contract. Refer to [developer-rules.md](file:///d:/coding/crazy%20idea/Receipt%20Guardian/docs/developer-rules.md) for detailed boundaries:

* **`app/`**: Expo Router screen routing files and layouts. Contains production-only views.
* **`components/ui/`**: Pure UI visual primitives styled via Tailwind props. (No business logic, state, or hooks allowed).
* **`components/layout/`**: Structural containers, global headers, nav bars, and modal sheets.
* **`components/features/`**: Domain-specific components containing visual layout and callbacks.
* **`hooks/`**: Custom state, hardware controllers, and API/Supabase data integrations.
* **`lib/`**: Stateless parsing engines, AI integration helper classes, and SDK configurations.
* **`types/`**: Shared TypeScript definitions.
* **`test/`**: Isolated visual prototyping sandbox (`test/sandbox/`) and testing utilities.

---

## Getting Started

### Prerequisites
Ensure you have the latest LTS version of Node.js installed.

### Installation
```bash
# Install package dependencies
npm install
```

### Running the App
Receipt Guardian runs in two different modes controlled via environment variables:

#### 1. Isolated UI Sandbox Mode (Prototyping)
Launch the sandbox to prototype views with mocked data on an isolated port (`8082`):
```bash
npm run web:sandbox
```

#### 2. Production Enclave Mode
Start the production client app connected to the backend resources:
```bash
# Start Expo bundler
npm run start

# Run on specific target platforms
npm run ios
npm run android
npm run web
```

---

## Workspace Controls & Quality Checks

Before committing code or preparing pull requests, you must run the following validation scripts:

```bash
# Run typescript compilation and import integrity check
npm run ts:check
```
