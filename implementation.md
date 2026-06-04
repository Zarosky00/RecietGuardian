# Receipt Guardian — Fresh Build & Setup Implementation Plan

This document serves as the living checklist and developer rules for building **Receipt Guardian** from scratch. It enforces a strict separation of concerns to prevent clutter, establishes a clean UI sandbox workflow, and implements the premium features directly.

---

## 🏗️ 1. Directory Architecture

To prevent code clutter, every file must have a single responsibility. No mixed logic is allowed.

```
Receipt Guardian/
├── 📁 app/               # PATHS & PAGES ONLY (Zero raw CSS, zero AI configs)
│   └── (dashboard)/      # Reads data from hooks and passes it to components.
├── 📁 components/        # PURELY VISUAL COMPONENTS (Zero API fetching)
│   ├── ui/               # - Primitives (Radix/shadcn: buttons, sheets, dialogs)
│   ├── layout/           # - Layout frames (header, bottom navigation bar)
│   └── features/         # - Specific UI cards (receipt grid, stats widgets)
├── 📁 hooks/             # STATE & SYNC SYSTEM (Glue between visual UI & backend)
│   ├── use-auth.ts       # - Handles Supabase auth sessions
│   ├── use-receipts.ts   # - Handles Supabase fetches & realtime subscriptions
│   └── use-camera.ts     # - Handles device camera streams & states
├── 📁 lib/               # ENGINE ROOM (Pure business logic; zero React/UI code)
│   ├── ai/               # - Google AI Studio (Gemini), Groq, Vertex AI
│   ├── email/            # - Gmail parser & ingestion logic
│   └── utils.ts          # - Date formatting & styling utilities
└── 📁 test/              # DE-CLUTTERING SHIELD (Excluded from production builds)
    ├── sandbox/          # - UI prototyping playground with mock JSON files
    └── logs/             # - Local error logs & sample test emails
```

### 🚫 Root Folder Restriction Policy
Only the following files are permitted directly in the project root:
* **Package Management:** `package.json`, `package-lock.json`
* **Configurations:** `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`
* **Environments & Git:** `.env.local`, `.env.example`, `.gitignore`
* **Documentation:** `README.md`, `implementation.md`

*All other files, temporary scripts, and debug logs must be placed inside the `test/` subdirectory.*

---

## 🔄 2. Sandbox-to-Production Workflow

To support continuous UI changes without breaking backend logic:

1. **Draft in Sandbox (`test/sandbox/`):** 
   * Prototype new page layouts or components inside the sandbox using static JSON data.
   * Preview changes at the `/test-sandbox` route on the local dev server.
2. **Refactor & Split:**
   * Once you approve the UI layout, refactor the code.
   * Move generic primitives to `components/ui/` and feature blocks to `components/features/`.
3. **Connect to Backend:**
   * Wire the refactored components into production files inside the `app/` folder.
   * Hook up live data fetches using custom hooks (e.g., `useReceipts()`).
4. **Cleanup:**
   * Delete or archive the temporary sandbox draft files.

---

## 📝 3. Execution Checklist

### [ ] Phase 1: Workspace Initialization & Core Configs
* [ ] Initialize Git repository.
* [ ] Create `.gitignore` (exhibit strict exclusions for `node_modules`, `.next`, `.env.local`, and `test/logs/*`).
* [ ] Initialize clean package configurations (`package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`).
* [ ] Install dependencies (`npm install`).

### [ ] Phase 2: Architectural Blueprints & Developer Rules
* [ ] Create `docs/developer-rules.md` detailing folder-level boundaries and component rules.
* [ ] Create `docs/architecture.md` illustrating data flows and module interactions.

### [ ] Phase 3: Setup UI Prototyping Sandbox
* [ ] Set up the `/test-sandbox` dev route.
* [ ] Create mock data JSON templates under `test/sandbox/` for simulating receipts and budget limits.

### [ ] Phase 4: Database Prep & Environment
* [ ] Copy `.env.local` to the root and verify key bindings.
* [ ] Set up Supabase Client SDK connections inside `lib/supabase/`.
* [ ] Run clean database schemas and truncate/clear existing user data in Supabase.

### [ ] Phase 5: Clean Backend Logic Implementation
* [ ] Implement AI extractor client (`lib/ai/`) supporting Gemini & Groq fallback.
* [ ] Implement Gmail API connection & email content processing client (`lib/email/`).
* [ ] Set up background cron handler endpoints with strict security validation.

### [ ] Phase 6: Front-End UI & Hooks Development
* [ ] Implement custom hooks (`hooks/use-auth.ts`, `hooks/use-receipts.ts`, `hooks/use-camera.ts`).
* [ ] Move sandbox components to production components (`components/ui/`, `components/features/`).
* [ ] Construct production page layouts under the `app/` App Router.

### [ ] Phase 7: Verification & Build
* [ ] Run `npm run typecheck` to ensure type safety.
* [ ] Run `npm run build` to confirm production compiling success.
