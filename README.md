# 🍃 Cameron Natural — Online Ordering System

A full-stack online ordering system for **Cameron Natural** (ชาคาเมรอน) bubble tea shop in Pattaya, Thailand.

Built with **Next.js 15**, **Tailwind CSS**, **Firebase Firestore**, and **Stripe Payments**.

---

## Features

### 🛒 Customer Ordering
- Beautiful bilingual menu (Thai/English) with category navigation
- Item customization: temperature (Hot/Iced/Frappé), toppings, notes
- Shopping cart with quantity management
- Checkout with **Cash** or **Stripe** (credit/debit card) payment options
- Order confirmation with tracking ID

### 👨‍💼 Admin Panel (`/admin`)
- **Dashboard**: Real-time stats — today's revenue, orders, pending count
- **Orders**: Full order management with status workflow (Pending → Confirmed → Preparing → Ready → Completed)
- **Menu**: Toggle item availability on/off in real-time
- **Analytics**: Revenue charts, payment method breakdown, top-selling items
- **Notifications**: Audible alert + optional desktop notifications for new orders
- **Pending Badge**: Live count of active orders in the admin nav

### 🔧 Technical
- Firebase Firestore for real-time data persistence
- Stripe Checkout Sessions for secure card payments
- Stripe Webhooks for automatic payment confirmation
- Zustand for client-side state management
- Fully responsive (mobile-first design)
- TypeScript throughout

---

## Menu Categories

| Category | Items | Price Range |
|----------|-------|-------------|
| 🍵 Milk & Tea | 13 items | ฿30–45 |
| ☕ Coffee | 5 items | ฿30–50 |
| 🥤 Italian Soda | 12 items | ฿30–45 |
| 🧋 Other Drinks | 5 items | ฿35–50 |
| 🍃 Matcha | 8 items | ฿45–50 |

**Toppings**: Pearls (+฿5), Jokés (+฿10), Spin (+฿10), Cream Cheese (+฿15), Whipping (+฿15)

---

## Setup Guide

### Prerequisites
- Node.js 18+
- A Firebase project (free tier works)
- A Stripe account (test mode for development)

### 1. Clone & Install

```bash
cd cameron-natural
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project
2. Enable **Firestore Database** (start in test mode)
3. Go to Project Settings → General → copy your web app config
4. Go to Project Settings → Service Accounts → Generate new private key (download JSON)
5. Create **Firestore indexes** (Composite):
   - Collection: `orders` — Fields: `createdAt` (Descending)
   - Collection: `orders` — Fields: `createdAt` (Ascending), `createdAt` (Descending)
   - Collection: `menuItems` — Fields: `categoryId` (Ascending), `order` (Ascending)
6. Deploy Firestore rules (public read, admin write):
   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your **Publishable key** and **Secret key** from Developers → API Keys
3. For webhooks:
   - In development: Install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhook
     ```
   - In production: Create a webhook endpoint at `https://yourdomain.com/api/webhook`
   - Select event: `checkout.session.completed`

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (from service account JSON)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SHOP_NAME=Cameron Natural
NEXT_PUBLIC_SHOP_PHONE=063-296-9062
```

### 5. Seed the Database

```bash
npm run seed
```

This populates Firestore with all menu categories, items, and addons.

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer menu.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Admin Usage Guide

### 1) Create an Admin Account
The admin area is protected by Firebase Auth custom claims (`admin: true`).

Use the included script to create a test admin user:

```bash
node scripts/create-auth-users.js
```

Default admin credentials from the script:
- Email: `testadmin@test.th`
- Password: `password`

You can edit `scripts/create-auth-users.js` to add your own admin email/password or set claims for existing users.

### 2) Sign In
Go to `http://localhost:3000/account` and sign in with the admin user.

### 3) Admin Dashboard (`/admin`)
- See recent orders and key stats.
- Orders marked **Completed** are visually crossed off (served).

### 4) Orders Page (`/admin/orders`)
- View all incoming orders.
- Change status as drinks are prepared:
  Pending → Confirmed → Preparing → Ready → Completed
- Completed orders are crossed off.

### 5) New Order Notifications
- When a new order arrives, the admin will hear a short beep and see a toast.
- Click **Enable** on the notification prompt to allow desktop notifications.

### 6) Pending Badge
- The Orders nav shows a live badge of active orders (Pending/Confirmed/Preparing/Ready).

---

## Project Structure

```
cameron-natural/
├── app/
│   ├── page.tsx              # Customer menu (home)
│   ├── cart/page.tsx         # Shopping cart
│   ├── checkout/
│   │   ├── page.tsx          # Checkout (payment selection)
│   │   └── success/page.tsx  # Post-payment confirmation
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── orders/page.tsx   # Order management
│   │   ├── menu/page.tsx     # Menu item management
│   │   └── analytics/page.tsx # Sales analytics
│   ├── api/
│   │   ├── orders/
│   │   │   ├── route.ts      # POST create, GET list orders
│   │   │   └── [id]/route.ts # PATCH update, GET single order
│   │   └── webhook/route.ts  # Stripe webhook handler
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/Header.tsx
│   └── menu/
│       ├── Hero.tsx
│       ├── CategoryTabs.tsx
│       ├── MenuItemCard.tsx
│       └── ItemModal.tsx
├── lib/
│   ├── firebase.ts           # Client SDK init
│   ├── firebase-admin.ts     # Admin SDK init
│   ├── stripe.ts             # Stripe init
│   ├── firestore.ts          # Firestore operations
│   ├── store.ts              # Zustand cart store
│   └── utils.ts              # Helpers
├── data/menu-data.ts         # Seed data (all menu items)
├── types/index.ts            # TypeScript types
├── scripts/seed-firestore.ts # Database seeder
└── .env.example
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Set up Stripe webhook for your production URL
5. Done!

### Firebase Hosting

```bash
npm run build
firebase deploy
```

---

## Next Steps / Improvements

- [ ] Add Firebase Auth for admin login protection
- [ ] Add real-time order notifications (Firestore listeners)
- [ ] Add drink images (upload to Firebase Storage)
- [ ] Add PromptPay / Thai QR payment integration
- [ ] Add order history for returning customers
- [ ] Add SMS/LINE notifications for order status updates
- [ ] Add inventory management
- [ ] Export sales reports to CSV/Excel

---

## License

Private — Cameron Natural © 2026
