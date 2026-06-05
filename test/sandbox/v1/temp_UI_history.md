# Temporary UI Sandbox Component Inventory & Modification Log

This document serves as the registry for all visual components within the **Receipt Guardian Sandbox Enclave** (`test/sandbox/v1/`). It details where each file is located, its specific functional role, and what modifications have been performed to achieve a clean, modular, and type-safe architecture.

---

## 📂 Active Component Registry

### 1. Root Sandbox Controller
* **File Location:** [index.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/index.tsx)
* **Functional Role:** State distributor and router. Acts as the layout driver for both desktop (dual-column) and mobile (single-column) screens.
* **Modifications:** 
  * Deconstructed from a 2,848-line monolith down to **under 350 lines**.
  * Removed all inline layouts, charts, menus, and drawer markups.
  * Retained only the core hook bindings (`useReceipts`, `useSandboxSettings`), active view state flags (`activeTab`, `selectedReceipt`), and layout routing structures.
  * Updated return window and warranty filter states to use the new `ALL | RETURNABLE | KEPT | REFUNDED` and `ALL | ACTIVE | EXPIRING | EXPIRED` categories, and updated command palette matches filtering.
  * Renamed the Receipts section display title header to `EXPENSES` to maintain naming alignment.

### 2. Category & Ledger Manager
* **File Location:** [components/LedgerWorkspace.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/LedgerWorkspace.tsx) (689 lines)
* **Functional Role:** Handles general ledger feeds, outlay velocity statistics (Verified vs Pending), and filter tabs.
* **Modifications:**
  * Extracted from `index.tsx` as a layout manager.
  * Added desktop-specific drag-to-scroll horizontal categories with momentum scrolling physics.
  * Refactored to delegate sub-views (`Taxes` and `Insights`) into dedicated sub-components to stay modular.
  * Styled the category filter pills with customized hover states for web.
  * Added `minHeight: 0` constraints to the active tab containers, workspace cards, and child `ScrollView` elements to enforce robust vertical scrolling limits.
  * Updated list filter logic to resolve returnable, kept, and refunded items, and adjusted the tab switcher header options layout.

### 3. Tax Deductibles Panel
* **File Location:** [components/TaxesWorkspace.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/TaxesWorkspace.tsx)
* **Functional Role:** Renders total yearly tax write-off summaries and triggers spreadsheet exports (`.csv` compiler logs).
* **Modifications:**
  * Extracted by the developer from `LedgerWorkspace.tsx` to separate tax features from standard receipt views.
  * Styled with a glassmorphism theme, containing interactive triggers connected to the terminal logs hook.

### 3a. Returns Panel
* **File Location:** [components/ReturnsWorkspace.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/ReturnsWorkspace.tsx) (93 lines)
* **Functional Role:** Handles general ledger returns feeds and displays refund windows.
* **Modifications:**
  * Extracted from `LedgerWorkspace.tsx` to keep screen heights flexible and code dry.
  * Styled with dynamic wrapper support for mobile-scrolling viewport integrations.
  * Added `renderVelocityCard` support to render the shared Total Active Outlay metric widget at the top of the returns tab view.

### 3b. Warranties Panel
* **File Location:** [components/WarrantiesWorkspace.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/WarrantiesWorkspace.tsx) (93 lines)
* **Functional Role:** Renders product warranty duration tags and validates expiry durations.
* **Modifications:**
  * Extracted from `LedgerWorkspace.tsx` to prevent monolith files and enable whole-screen mobile scrolling.
  * Renders the shared `renderVelocityCard` outlay widget at the top of the warranties tab layout.

### 4. Spend Cashflow Insights
* **File Location:** [components/InsightsWorkspace.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/InsightsWorkspace.tsx)
* **Functional Role:** Renders monthly expenditures cash-flow graphs and category outlays.
* **Modifications:**
  * Extracted by the developer from `LedgerWorkspace.tsx` to keep charts and budget limit indicators isolated.
  * Styled with responsive layouts aligning donut and bar charts horizontally on desktop and vertically on mobile.

### 5. Vector Graphs System
* **File Location:** [components/CustomCharts.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/CustomCharts.tsx)
* **Functional Role:** Vector graphics generator for Donut and Spline trend charts.
* **Modifications:**
  * Replaced all lowercase HTML web tags (`<svg>`, `<circle>`, `<path>`) with capitalized native components from `react-native-svg` to prevent app crashes on physical mobile devices.
  * Converted CSS `rotate()` styling transforms to standard SVG `transform="rotate(deg, cx, cy)"` attributes to resolve TypeScript type-check issues.
  * Removed invalid web-only `display: block` style settings.

### 6. Navigation Capsule
* **File Location:** [components/CapsuleDock.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/CapsuleDock.tsx)
* **Functional Role:** Implements the macOS-inspired floating capsule dock bar at the bottom.
* **Modifications:**
  * Extracted from `index.tsx` to isolate active routing selections and bottom layout.
  * Decomposed further to delegate the CMD+K command menu search overlay to `CommandMenuOverlay.tsx`, keeping its size at **378 lines**.

### 7. Global Search & Command Palette
* **File Location:** [components/CommandMenuOverlay.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/CommandMenuOverlay.tsx)
* **Functional Role:** Manages backdrop clicks, query parameters matching, category/status filters, and search list overlays.
* **Modifications:**
  * Extracted from `CapsuleDock.tsx` into a modular overlay to meet Rule 4 size limits.

### 8. Diagnostics & Logger HUD
* **File Location:** [components/InspectionDesk.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/InspectionDesk.tsx)
* **Functional Role:** Serves as the system diagnostics panel. Renders the live scrolling terminal log output and the monochromatic server status card.
* **Modifications:**
  * Extracted from `index.tsx`.
  * Encapsulated terminal log auto-scrolling triggers (`useEffect` listening to log entries).

### 9. System Settings Controller
* **File Location:** [components/SettingsDrawer.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/SettingsDrawer.tsx)
* **Functional Role:** Slide-out drawer configuration panel containing cyberpunk/mint/rose theme switchers, network speed simulation overrides, and database error injectors.
* **Modifications:**
  * Extracted from `index.tsx`. Fixed mobile layouts to position options correctly using responsive offsets.

### 10. Top Welcome Banner
* **File Location:** [components/HeaderBar.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/HeaderBar.tsx)
* **Functional Role:** Desktop brand title, search button trigger, clock and time greeting greetings, and admin avatar.
* **Modifications:**
  * Extracted from `index.tsx`. Implemented responsive layouts for desktop welcome bars vs mobile layout headers.

### 11. Quick Actions Shortcuts
* **File Location:** [components/QuickActions.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/QuickActions.tsx)
* **Functional Role:** Ingestion shortcuts bar for scanning receipts, uploading files, and syncing mail inboxes.
* **Modifications:**
  * Extracted from `index.tsx` into a standalone, styled Pressable row.

### 12. Web Ambient Theme Blobs
* **File Location:** [components/AuroraBackground.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/AuroraBackground.tsx)
* **Functional Role:** Renders ambient CSS background blur canvas graphics on Web while safely returning null on mobile devices.
* **Modifications:**
  * Created to hold custom keyframe animations and fonts import linkages, avoiding standard React Native rendering constraints.

### 13. Ingestion Wizard Overlay
* **File Location:** [components/IngestionOverlay.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/IngestionOverlay.tsx)
* **Functional Role:** Wizard frame orchestrating file uploads, camera scanning, mailbox syncs, and manual entry forms.
* **Modifications:**
  * Decomposed from a 1,311-line monolith into **175 lines** by delegating specific screens to separate visual sub-views.

### 14. Ingestion Camera View
* **File Location:** [components/IngestionCameraView.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/IngestionCameraView.tsx)
* **Functional Role:** Tactical camera viewfinder for scanning receipts, focus brackets, laser sweeps, and OCR mocks.
* **Modifications:**
  * Created during decomposition of `IngestionOverlay.tsx`.

### 15. Ingestion Upload View
* **File Location:** [components/IngestionUploadView.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/IngestionUploadView.tsx)
* **Functional Role:** Interactive drop zone panel for importing and parsing files (PDFs, images).
* **Modifications:**
  * Created during decomposition of `IngestionOverlay.tsx`.

### 16. Ingestion Email View
* **File Location:** [components/IngestionEmailView.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/IngestionEmailView.tsx)
* **Functional Role:** Shows copiable forwarded address and triggers templates email sync simulator.
* **Modifications:**
  * Created during decomposition of `IngestionOverlay.tsx`.

### 17. Ingestion Manual View
* **File Location:** [components/IngestionManualView.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/IngestionManualView.tsx)
* **Functional Role:** Text forms for inputting receipt details, deductible checkboxes, and manual items breakdowns.
* **Modifications:**
  * Created during decomposition of `IngestionOverlay.tsx`.

---

## 🎨 Global UI Utilities

* **[components/GlassCard.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/GlassCard.tsx)** (124 lines): Premium glassmorphism container that handles linear gradients and border styling.
  * *Modifications:* Added `overflow: 'hidden'` to the inner View wrapper when `isFlexed` is true. This constrains the container's height bounds on web and fixes vertical scrolling issues for child components like `ScrollView` in the ledger list and terminal HUD.
* **[components/SVGIcons.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/SVGIcons.tsx)**: Capitalized native vector icon set wrapping `react-native-svg` elements.
* **[components/PremiumReceiptCard.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/PremiumReceiptCard.tsx)**: Ledger list row cards featuring categorizations and return status tags.
* **[components/ReceiptDetailModal.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/ReceiptDetailModal.tsx)** (511 lines): Inline and popup receipt specification detail viewer and action controller.
  * *Modifications:* Redesigned to accept `activeTab` properties and match the mockup bottom sheet layout (Adobe-style headers, circular buttons, purchase amount banners, settlement tables, side-by-side grids, and triple action footers).
* **[components/ReceiptDetailModal.styles.ts](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/ReceiptDetailModal.styles.ts)** (329 lines): Static styles configuration module for the details modal layout.
* **[components/DetailModalWidgets.tsx](file:///d:/coding/crazy%20idea/Receipt%20Guardian/test/sandbox/v1/components/DetailModalWidgets.tsx)** (602 lines): Context-specific sub-components for the details modal (Pending Alert, Payment Simulator, Circular SVG Countdown Monitor, return checklist cards, mock laser Barcode generator, and Warranty claims wizard form).

