# Receipt Guardian Design System Specification

This document defines the core styling guidelines, visual tokens, and micro-interaction behaviors for the **Receipt Guardian** user interface. All components must implement these guidelines to preserve a premium, minimal, and cohesive aesthetic.

---

## 1. Typography

The application uses three primary font families to build structural contrast:
- **Headers & Accents (`Syne`)**: Used for branding, section titles, and uppercase action buttons. Emphasizes character and structure.
- **Body & Controls (`Sora`)**: Used for standard labels, description text, item descriptions, and buttons. Focuses on legibility and clean geometric form.
- **Data & Telemetry (`Share Tech Mono`)**: Used for amounts, cryptographic registry hashes, time-stamps, status logs, and physical slip prices. Reinforces the technical, secure nature of the product.

---

## 2. Corner Radii (Spacing Hierarchy)

To create a layered, organic layout, the following rounding guidelines are enforced:
- **`24px`**: Standard visual primitive cards (`GlassCard`) and desktop detail sheets.
- **`28px`**: Mobile bottom sheets (iOS style drawers).
- **`14px`**: Interactive tab elements (Category selector pills).
- **`10px`**: Trigger buttons, action buttons, dropdown items.

---

## 3. Micro-Animations & CSS Keyframes

All interactive elements must utilize hardware-accelerated CSS transitions:
- **Detail Drawer Slide-in**: 
  - Desktop: Spring translation `transform: translateX(100%)` to `translateX(0)` (duration `0.38s` cubic-bezier).
  - Mobile: Slide-up translation `transform: translateY(100%)` to `translateY(0)` (duration `0.42s` cubic-bezier).
- **List Hover Focus**: Row shift offset `transform: translateX(2px)` with subtle background tint shifting (`0.22s` cubic-bezier).
- **Dock Tab Switching**: Scale transitions `transform: scale(1.02) translateY(-2px)` on active buttons.

---

## 4. Theme System Tokens

The application supports five premium theme presets (the background and main accents are kept constant for branding consistency):

| Theme Preset | Name | Bg Start/End | Accent Color | Primary Text |
| :--- | :--- | :--- | :--- | :--- |
| **Cyberpunk** | Matte Carbon | `#09090b` | `#ffffff` | `#f4f4f5` |
| **Mint** | Indigo Matte | `#0b0f19` | `#6366f1` | `#e2e8f0` |
| **Rose** | Champagne Luxe | `#fbfbfa` | `#18181b` | `#18181b` |
| **Frost-Dark** | Deep Velvet | `#0d0d0f` | `#a1a1aa` | `#e4e4e7` |
| **Frost-Light** | Platinum Light | `#ffffff` | `#2563eb` | `#0f172a` |
