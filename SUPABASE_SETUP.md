# PureHaven — Supabase Cloud Database Setup Guide

This guide walks you through connecting **PureHaven** to your live **Supabase** PostgreSQL cloud database.

---

## Step 1: Create a Free Supabase Project

1. Visit [supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **"New Project"**.
3. Fill in the project details:
   - **Name:** `PureHaven`
   - **Database Password:** (Choose a secure password and remember it)
   - **Region:** Choose the region closest to India (e.g. `Singapore` or `Mumbai`)
4. Click **"Create new project"** and wait about 1-2 minutes for the database cluster to initialize.

---

## Step 2: Run the Database Migration Script

1. In your Supabase project dashboard, click on the **SQL Editor** tab on the left sidebar (icon with `>_`).
2. Click **"New query"**.
3. Open the file `supabase_schema.sql` located in the root of this project folder.
4. Copy the entire contents of `supabase_schema.sql` and paste it into the Supabase SQL Editor.
5. Click **"Run"** (green button at bottom right).

✅ **Result:** This single script automatically creates:
- `profiles` table (User accounts, roles: `customer` and `admin`, phones)
- `categories` table (5 artisan categories with descriptions and display orders)
- `products` table (Full artisan cheeses, tasting notes, milk source, aging, stock)
- `addresses` table (Saved delivery addresses)
- `coupons` table (Active discount codes: `PUREHAVEN10`, `FIRSTFARM`, `CHEESELOVER`)
- `orders` & `order_items` tables (Complete order lifecycle and breakdown)
- `reviews` table (Verified customer ratings and reviews)
- `support_tickets` table (Customer service desk inquiries and admin replies)
- `newsletter_subscribers` table
- Row-Level-Security (RLS) policies protecting customer data.

---

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, click on **Project Settings** (gear icon at the bottom left).
2. Go to **API** under Configuration.
3. Find:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon public key** (starts with `eyJh...`)

---

## Step 4: Add Keys to PureHaven `.env`

Open `.env` in the `purehaven` folder and replace the values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Save the file and restart the development server:

```bash
npm run dev
```

---

## Standalone / Evaluation Mode (Without Supabase Keys)

If you are presenting this project in college or testing before creating a Supabase account:
- PureHaven has a **built-in Persistent Local Storage Engine** that mirrors the exact same schema.
- All registrations, logins, addresses, cart orders, tracking codes, coupon redemptions, and support tickets persist across browser reloads!
- Switch between **Customer Mode** and **Admin Mode** anytime via the account menu or one-click demo login buttons.

---

## Official Business Contact Configured

- **Phone:** `+91 91421 66210` (`tel:+919142166210`)
- **Email:** `purehavencare26@gmail.com` (`mailto:purehavencare26@gmail.com`)
- **Tagline:** “Crafted with Care. Savoured with Joy.”
