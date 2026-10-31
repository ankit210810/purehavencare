# PureHaven — Premium Artisan Cheese & Farmhouse Dairy Store

> “Crafted with Care. Savoured with Joy.”

PureHaven is a full-stack, enterprise-grade e-commerce application specializing in handcrafted cave-aged cheeses, slow-churned A2 farmhouse butter, and curated gourmet dairy hampers.

- **Production Deployment:** Live on Vercel Global Edge Network
- **GitHub Repository:** [https://github.com/ankit210810/purehavencare](https://github.com/ankit210810/purehavencare)

---

## 🧀 Project Highlights

- **Visual Brand & UI:** Warm cream/ivory palettes, forest green branding, butter-gold accents, serif typography (`Playfair Display`), and responsive layouts across mobile, tablet, and desktop.
- **Dairy Catalog & Curing Notes:** Handcrafted clothbound cheddars, black summer truffle gouda, bloomy camembert-brie, fresh burrata with pesto core, and A2 Gir cow cultured butter.
- **Cold-Chain Logistics:** 48-hour thermal wool insulation and sub-zero gel pack guarantees with live temperature telemetry simulation (2°C–6°C).
- **Cart & Server-Calculated Checkout:** Pincode serviceability checker, coupon validation engine (`PUREHAVEN10`, `FIRSTFARM`, `CHEESELOVER`), multi-step checkout, and confetti celebrations.
- **Payment Gateway:** Razorpay test mode integration with Credit/Debit cards, instant UPI QR code, NetBanking, and Cash on Delivery.
- **Live Order Tracking:** Multi-stage lifecycle (`confirmed` → `processing` → `packed` → `shipped` → `out_for_delivery` → `delivered`).
- **Admin Fromagerie Suite:** Protected admin dashboard with revenue analytics, product inventory management, order status changer, promo code creator, and customer support ticket replies.
- **Fromager AI Assistant:** AI-powered cheese sommelier providing wine pairings, cheeseboard platter calculations (grams per guest), dietary advice (100% vegetarian microbial rennet, low-lactose, A2 beta-casein), and direct product recommendations. Powered by Gemini API with an expert built-in knowledge engine fallback.
- **Official Contact Details:**
  - Phone: `+91 91421 66210` (`tel:+919142166210`)
  - Email: `purehavencare26@gmail.com` (`mailto:purehavencare26@gmail.com`)

---

## 🚀 How to Run the Project

### 1. Open Terminal & Navigate to Project Folder
```bash
cd d:\coding\purehaven
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo & Presentation Accounts

For grading, demonstrations, and college evaluations, two pre-configured accounts are provided:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin Master** | `admin@purehaven.in` | `admin123` | Full access to Admin Dashboard (`/admin`), Product CRUD, Order Statuses, Coupons, and Support Tickets. |
| **Customer** | `customer@purehaven.in` | `password123` | Browsing, ordering, tracking, saved addresses, wishlist, and profile. |

*You can also register any new customer account with your own email and phone number!*

---

## 📦 Active Coupon Codes

Try applying these promo codes at checkout:

- `FIRSTFARM` — Flat ₹150 off on orders above ₹799
- `PUREHAVEN10` — 10% off on all collections (Min order ₹999)
- `CHEESELOVER` — 15% off on gourmet hampers above ₹1,999
- `FREESHIP` — Complimentary insulated cold-chain shipping

---

## 🗄️ Database: Supabase Setup

A complete PostgreSQL schema is provided in `supabase_schema.sql`.
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for step-by-step instructions to connect your live Supabase cloud database.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Database:** Supabase PostgreSQL Cloud (with persistent offline fallback engine)
- **Authentication:** Supabase Auth & Secure Session Management
- **Payments:** Razorpay Test Mode Gateway
- **AI Sommelier:** Google Gemini 1.5 Flash API + PureHaven Fromager Rule Engine
