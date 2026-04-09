# Vipps MobilePay Integration Wizard

A white-label, multi-step wizard for configuring Vipps MobilePay payment integration with accounting systems (PowerOffice Go / 24SevenOffice).

## Dependencies

- `react` >= 18
- `next` >= 14 (uses `next/image`, `'use client'` directives)
- `lucide-react` (icons)
- `tailwindcss` >= 3 (utility classes)

## Quick start

1. Copy the entire `vipps-wizard/` folder into your project (e.g., `src/components/vipps-wizard/`).

2. Import and render with your brand config:

```tsx
import { VippsSetupWizard } from '@/components/vipps-wizard';

export default function VippsPage() {
  return (
    <VippsSetupWizard
      brandConfig={{
        companyName: 'Restaurant Matglede',
        supportEmail: 'drift@matglede.no',
        defaultModules: ['pos', 'reconciliation'],
      }}
    />
  );
}
```

## WizardBrandConfig

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `companyName` | `string` | Yes | - | Company name shown in UI and emails |
| `supportEmail` | `string` | Yes | - | Support email for help sections and mailto links |
| `emailTeamName` | `string` | No | `companyName` | Greeting name used in email body |
| `accentColor` | `string` | No | `#E86C1F` | Primary accent color (hex) |
| `accentColorSecondary` | `string` | No | `accentColor` | Secondary color for gradients |
| `defaultModules` | `string[]` | No | `[]` | Pre-selected module IDs |

## Available modules

| ID | Name | Use case |
|----|------|----------|
| `ecommerce` | E-Commerce Checkout | WooCommerce, Shopify |
| `recurring` | Recurring Payments | Memberships, subscriptions |
| `donations` | Donations & Events | QR codes, payment links |
| `pos` | POS/Kiosk Payments | In-person sales (restaurants, retail) |
| `reconciliation` | Settlement Reconciliation | Daily transaction sync (always required) |

## Restaurant setup

For restaurants, pre-select `pos` and `reconciliation`:

```tsx
<VippsSetupWizard
  brandConfig={{
    companyName: 'Nordlys Restauranter',
    supportEmail: 'hjelp@nordlys.no',
    defaultModules: ['pos', 'reconciliation'],
    accentColor: '#2563eb',
  }}
/>
```

## Tailwind setup

The wizard uses standard Tailwind utility classes. Make sure your `tailwind.config` includes the wizard folder in its content paths:

```js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    // Add this if the wizard is outside src/
    './src/components/vipps-wizard/**/*.{ts,tsx}',
  ],
};
```

## File structure

```
vipps-wizard/
  index.ts                   - Barrel exports
  config.ts                  - WizardBrandConfig, context, provider
  types.ts                   - TypeScript interfaces
  constants.ts               - Module/partner definitions
  VippsSetupWizard.tsx       - Main wizard component
  ExampleOfJson.html         - JSON viewer (standalone)
  steps/                     - 9 wizard step components
  guides/                    - Step-by-step visual guides
  images/                    - Screenshot assets (PNG/AVIF)
```
