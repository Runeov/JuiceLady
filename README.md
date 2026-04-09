# Universal Order System

A full-stack, white-label online ordering system. Configure your shop name, currency, colors, and menu — deploy anywhere.

Built with **Next.js 15**, **Tailwind CSS**, **Firebase**, and **Stripe**.

---

## Features

### Customer Ordering
- Responsive menu with category navigation
- Item customization: variants (Hot/Iced/Frappe), add-ons, notes
- Shopping cart with quantity management
- Multiple payment methods: **Cash**, **Stripe** (card), **PromptPay/QR** (optional)
- Order confirmation with tracking ID
- Order history for returning customers (Firebase Auth)

### Admin Panel (`/admin`)
- **Dashboard**: Real-time stats — revenue, orders, pending count
- **Orders**: Full order management with status workflow (Pending > Confirmed > Preparing > Ready > Completed)
- **Walk-in Orders**: Create orders for in-store customers
- **Menu Management**: Add/edit/delete items, toggle availability, upload images to Firebase Storage
- **Inventory**: Track stock levels, low-stock alerts, bulk stock updates
- **Customers**: View customer history, order aggregates
- **Analytics**: Revenue charts, payment breakdown, top items, CSV export
- **Notifications**: Audible alert + desktop notifications for new orders

### Integrations
- **Firebase Auth**: Email/password + phone auth, admin custom claims
- **Firebase Firestore**: Real-time data persistence
- **Firebase Storage**: Menu item image uploads
- **Stripe**: Secure card payments via Checkout Sessions + webhooks
- **PromptPay/QR**: Thai QR payment support (configurable)
- **LINE**: Admin order notifications via LINE Messaging API
- **SMS**: Customer order status updates via Twilio

### Technical
- TypeScript throughout
- Zustand for client-side state management
- Configurable via environment variables (shop name, currency, locale)
- Customizable color theme via Tailwind config
- Mobile-first responsive design

---

## Quick Start

### Prerequisites
- Node.js 18+
- A Firebase project (free tier works)
- A Stripe account (optional, for card payments)

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials and shop settings. See `.env.example` for all options.

### 3. Seed the Database

```bash
npm run seed
```

### 4. Create Admin User

```bash
node scripts/create-auth-users.js
```

Default credentials:
- Admin: `testadmin@test.com` / `password`
- User: `testuser@test.com` / `password`

### 5. Run

```bash
npm run dev
```

- Customer menu: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Customization

### Branding
Edit `tailwind.config.js` to change the color theme:
```js
brand: { 50: '#f0f4ff', ..., 900: '#312e81' },
accent: { light: '#86efac', DEFAULT: '#22c55e', dark: '#15803d' },
```

### Shop Settings
All shop-specific settings are in `.env.local`:
```env
NEXT_PUBLIC_SHOP_NAME=My Shop
NEXT_PUBLIC_CURRENCY=USD
NEXT_PUBLIC_CURRENCY_SYMBOL=$
NEXT_PUBLIC_LOCALE=en-US
```

### Menu
Edit `data/menu-data.ts` for local fallback data, or manage everything through the admin panel once seeded.

---

## Project Structure

```
app/
  page.tsx              # Customer menu
  cart/page.tsx         # Shopping cart
  checkout/page.tsx     # Checkout + payment
  account/page.tsx      # Auth + order history
  admin/
    page.tsx            # Dashboard
    orders/page.tsx     # Order management
    menu/page.tsx       # Menu CRUD
    inventory/page.tsx  # Stock management
    analytics/page.tsx  # Sales reports + CSV export
    customers/page.tsx  # Customer history
  api/
    orders/             # Order CRUD
    webhook/            # Stripe webhooks
    admin/              # Admin-only endpoints
components/
  layout/Header.tsx
  menu/                 # Hero, CategoryTabs, MenuItemCard, ItemModal
  admin/                # AdminGuard, notifications, badges
  providers/            # AuthProvider
lib/
  config.ts             # Central shop configuration
  firebase.ts           # Client SDK
  firebase-admin.ts     # Admin SDK
  firestore.ts          # Database operations
  notifications.ts      # LINE/SMS notification service
  store.ts              # Zustand cart store
  stripe.ts             # Stripe init
  utils.ts              # Helpers + CSV export
data/menu-data.ts       # Sample menu data
types/index.ts          # TypeScript types
scripts/
  seed-firestore.ts     # Database seeder
  create-auth-users.js  # Admin user setup
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables
4. Set up Stripe webhook for your production URL
5. Done!

---

## License

MIT
