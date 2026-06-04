# Developer Rules & Code Quality Standards (React Native & Expo)

This document establishes the strict boundaries, file architectures, and developer constraints for the **Receipt Guardian** React Native app. All developers (human or AI) must strictly follow these rules to ensure the codebase remains clean, scalable, and easy to modify.

---

## 🚫 1. Root Directory Allowed Files Policy
To prevent root folder clutter, only the following configuration files are permitted directly in the project root:
* **Package Management:** `package.json`, `package-lock.json`, `yarn.lock` (if applicable)
* **Expo & Bundler Configs:** `app.json` (Expo config), `metro.config.js`, `babel.config.js`, `tailwind.config.js` (for NativeWind)
* **Compilers & Linters:** `tsconfig.json`, `eslint.config.js`
* **Environments & Git:** `.env`, `.env.example`, `.gitignore`
* **Documentation:** `README.md`, `implementation.md`

*Rule: Under no circumstances should any developer create other files (such as raw screen mockups, scratchpad scripts, temporary JSON dumps, or debug logs) directly in the root directory. They must go into their specific folders.*

---

## 📂 2. Subdirectory Boundaries

Every directory has a single, strict responsibility. Mixing layouts, business logic, and API calls is forbidden.

| Directory | Allowed Contents | Rules |
| :--- | :--- | :--- |
| **`app/`** | Expo Router Screen files, Tab layouts, and Root routing sheets. | **Screen components only.** Screens must act as layouts that read data from custom hooks (e.g. `useReceipts`) and pass them as props to components. Keep inline states minimal. |
| **`components/ui/`** | Visual primitive components (custom buttons, text fields, loaders using `<View>`, `<Text>`, `<Pressable>`). | **No business logic, no hooks, no API calls, no database imports.** These components are 100% reusable and styled via Tailwind props. |
| **`components/layout/`** | Visual structure wrappers (custom headers, nav panels, custom modal overlays). | Controls overall layout views and presentation wrappers. |
| **`components/features/`** | Domain-specific visual components (receipt lists, warranty status tags, category wheels). | Receives data and triggers event callbacks (e.g., `onPressReceipt`). |
| **`hooks/`** | Custom React Native state hooks (`useAuth`, `useReceipts`, `useCamera`). | **The state glue.** Screens and active components must access Supabase, local MMKV cache, or device hardware (camera/torch) through custom hooks. |
| **`lib/`** | Client SDK initializations and stateless libraries (`lib/ai/`, `lib/email/`, `lib/supabase/`). | **No React/UI components.** Pure TypeScript services, parser engines, and API fetch wrappers. |
| **`types/`** | Shared type definitions (`types/receipt.ts`, `types/supabase.ts`). | Core TypeScript templates. |
| **`test/`** | Isolated UI Sandbox (`test/sandbox/`), experimental scripts, and error logs (`test/logs/`). | **Completely ignored in production builds.** Safe to edit, play with, or delete entirely before building native binaries. |

### 📂 2a. Test Directory Compartment Rules
To prevent the `test/` folder itself from becoming cluttered, files must be placed in their exact designated subdirectories:
* **`test/sandbox/`**: Strictly for active visual UI mockup screens.
  * *Subfolder Classification:* Group mockup files by feature (e.g., `test/sandbox/dashboard/`, `test/sandbox/auth/`, `test/sandbox/receipts/`).
  * *Pruning Rule:* Once a layout is finalized and implemented in production, immediately delete it from the sandbox or move it to `test/archive/`.
* **`test/mock-data/`**: Strictly for mock factories (e.g. `mock-receipts-generator.ts`) or static JSON data used to feed the sandbox UI.
* **`test/scripts/`**: Strictly for raw, CLI playground scripts (e.g. running a local test to verify parsing algorithms).
* **`test/logs/`**: Strictly for runtime debug printouts and raw email samples (Git-ignored).
* **`test/archive/`**: For temporary preservation of retired visual layouts or reference draft files.

---

## 🔄 3. UI Sandbox Workflow & Seamless Transition Rules

To ensure that moving a UI prototype from the sandbox to the production directory is seamless and never breaks:

### Prototyping Phase
1. **Never edit production files directly.**
2. **Mirror Production Contracts:** When designing a mockup component, define its TypeScript props (`interface`) exactly as it will exist in the final app (e.g., `interface ReceiptCardProps { receipt: Receipt; onDelete: (id: string) => void; }`).
3. **Interactive Mock Stubs:** Wire event handlers (`onPress`, `onDelete`) using local React state modification of mock data so the screen behaves interactively in the sandbox.
4. **Use Shared Types:** Import standard types from `types/` directly into sandbox files, rather than redefining them locally.
5. **Absolute Path Aliases Only:** **Never use relative paths** (e.g., `../../components/...`) inside component imports. Always use absolute path aliases starting with `@/` (configured in `tsconfig.json`, e.g., `import { Button } from "@/components/ui/button"`). This guarantees that files can be moved anywhere inside the workspace without breaking any import statements.

### Transition Phase
Once you approve the UI design:
1. **Plug-and-Play File Shift:** Drag-and-drop the visual component files directly from `test/sandbox/feature/` to `components/features/` or `components/ui/`.
2. **No Component Code Changes:** The code inside the component files should remain **completely unchanged** because their props interfaces and absolute `@/` imports match production targets.
3. **Wire in Production Pages:** In your production screen files under `app/`, import the newly moved components and feed them data via your custom production hooks (e.g., `const { receipts, deleteReceipt } = useReceipts()`) instead of the sandbox mock states.
4. **Pruning:** Delete or archive the sandbox files as specified in Section 2a.

### 🔄 3a. Handling Multiple UI Variants
When designing multiple variations of the same screen layout (e.g., Variant A vs Variant B vs Variant C):
1. **Single Entry Point:** Do not create separate screen files or routes for each variant. Create a single sandbox page (e.g., `test/sandbox/dashboard/index.tsx`).
2. **Local Variant Switcher:** Render a temporary, development-only control switcher bar at the top of the preview to toggle active variants using local state.
3. **Decoupled Variants Folder:** Build the different screen components inside a `variants/` subfolder (e.g., `test/sandbox/dashboard/variants/DashboardCleanList.tsx`).

### 💾 3b. Archiving & Git Safety Net (Recovering Old Designs)
* **The Archive Rule:** Before finalizing a UI and deleting its sandbox directory, move any designs you want to keep for visual reference into the `test/archive/` folder.
* **The Commit Rule:** Ensure you commit your active sandbox screen code to Git (e.g., `git commit -m "sandbox: completed dashboard variant A layout"`) before changing or deleting it.

### 🎨 3c. The Living Design System Rule
* **Dynamic Spec Evolution:** Do not establish static design tokens or styling guidelines beforehand.
* **Update on Approval:** Whenever a UI layout, card structure, theme color, or custom animation is approved inside the sandbox, the developer/AI must immediately write or update the corresponding styles in `docs/design.md`.
* **Visual Blueprint:** Once a style token is documented in `docs/design.md`, it becomes the mandatory visual guideline for all future mobile components to maintain design consistency.

---

## 🚫 4. Mobile Environment & Package Hygiene
* **Strict Expo Installations:** Never use `npm install`, `yarn add`, or `bun add` for packages containing native libraries or platform modules. Always run `npx expo install` to guarantee strict version alignment with your active Expo SDK.
* **Native Primitives Only:** Absolutely zero web HTML elements (e.g., `<div>`, `<span>`, `<p>`, `<a>`) inside component rendering functions. Always use React Native core primitives (`<View>`, `<Text>`, `<Pressable>`) and Expo Router navigators (`<Link>`).
* **Mobile Native Event Handlers:** Web event attributes (e.g., `onClick`, `onChange`) are strictly forbidden. Use native callbacks (e.g., `onPress`, `onChangeText`) exclusively.
* **No Direct DB or Client Calls in Screens:** Never run `supabase.from('receipts')` inside an Expo Router screen component. Always wrap queries in a custom hook inside `hooks/` or a service wrapper in `lib/`.
* **No Console Log Pollution:** During development, route complex logs, email text samples, or parsing outputs to file writes inside `test/logs/` instead of dumping raw texts into the terminal stdout.
* **Component File Size Limit:** Keep visual components small (preferably under 200 lines). If a file exceeds 300 lines, refactor sub-components into `components/features/` or extract state logic into custom hooks.

---

## 🎨 5. NativeWind & Layout Guardrails
* **Flexbox Layout Strictness:** Do not write web-exclusive Tailwind utility classes that fail or behave unpredictably inside NativeWind (e.g., `grid`, `fixed`, `inline`, `cursor-pointer`). Stick strictly to mobile-supported Flexbox configurations.
* **Router Architecture Compliance:** When modifying routes or layouts inside `app/`, use Expo Router's file-based paradigms (e.g., `_layout.tsx`, `router.push()`, or `router.replace()`). Never inject legacy React Navigation initialization configurations.
* **Asset Resolution Architecture:** Local media files, icons, or visual assets must be imported natively via `require()` blocks or native image wrappers like `expo-image`, never as generic web string paths.
* **Layout Drift Prevention (Zero Frame Duplication):** Do not write custom headers or nav panels inside your sandbox pages. Always import the active layout components directly from `@/components/layout/`.
* **Mock Data Sync (Preventing Data Mismatch):** For complex schemas that change frequently, do not rely on static JSON mock files. Instead, write simple mock factory helpers in `test/mock-data/` (e.g. `mock-receipt-generator.ts`) that return data typed against our active TypeScript types.
* **Compile-Time Checks:** Always ensure that sandbox files import global types from `types/`. If a database type changes, TypeScript will immediately point out any sandbox mocks that need updating, avoiding silent runtime breaks.

---

## 🚫 6. Instruction Guardrails for AI Assistants (CRITICAL)
All AI coding assistants editing this workspace must adhere to these two safety rules to prevent code breakage and deletion:

### Rule 1: No Relative Import Paths
You are **strictly forbidden** from writing relative paths for folder depths greater than the current directory (e.g., `../../../../components/ui/button`). **You must use absolute path aliases prefixed with `@/`** (e.g., `@/components/ui/button`) for all imports outside the current folder.

### Rule 2: No Placeholder Code Truncation
When modifying files, you are **strictly forbidden** from replacing existing code logic with placeholder comments (e.g., `// ... rest of the code here` or `// ... existing imports ...`). You must always write out the full, complete block of code being changed, ensuring that all unmodified code remains exactly intact.
