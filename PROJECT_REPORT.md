# PureHaven — Project Report & College Viva Defense Guide
**Program:** Bachelor of Technology in Computer Science & Engineering (AI & ML)  
**Project Title:** PureHaven — Premium Artisan Cheese & Farmhouse Dairy E-Commerce Platform  
**Brand Tagline:** “Crafted with Care. Savoured with Joy.”  
**Official Business Contact:** Phone: `+91 91421 66210` | Email: `purehavencare26@gmail.com`  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Domain Problem
Traditional e-commerce platforms are poorly suited for perishable, temperature-sensitive culinary dairy products. Artisan cheeses, unpasteurized bloomy rinds, and slow-churned cultured butters require continuous thermal vigilance (2°C – 6°C) throughout transit, sophisticated curdling/rennet transparency, and specialized sommelier culinary advice.

### 1.2 The PureHaven Solution
PureHaven is a full-stack, enterprise-grade e-commerce application designed to simulate a real-world artisanal fromagerie business:
- **Cloud Database & Auth:** Supabase PostgreSQL with real-time email verification and Row-Level Security (RLS).
- **Cold-Chain Logistics:** 48-hour thermal wool insulation and sub-zero gel pack simulation with live parcel telemetry (3.2°C).
- **AI Shopping Assistant:** PureHaven Fromager AI utilizing Google Gemini 1.5 Flash and a rule-based culinary sommelier engine.
- **Fulfillment Lifecycle:** Complete 6-stage lifecycle tracking from curing cellar to customer doorstep.
- **Admin Suite:** Comprehensive back-office dashboard with sales metrics, inventory management, and customer support desk.

---

## 2. Technology Stack & Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER (CLIENT)                  │
│       React 18  •  Vite 6  •  Tailwind CSS  •  Lucide Icons    │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
                 ▼                               ▼
┌────────────────────────────────┐ ┌──────────────────────────────┐
│       AI SOMMELIER ENGINE      │ │       PAYMENT GATEWAY        │
│   Google Gemini 1.5 Flash API  │ │   Razorpay Test Mode / UPI   │
│   + Rule-Based Fromager Model  │ │   Signature & Idempotency    │
└────────────────────────────────┘ └──────────────────────────────┘
                 │                               │
                 ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND & DATABASE LAYER (SUPABASE)              │
│   • Supabase Auth (Email Verification & JWT Sessions)           │
│   • PostgreSQL Cloud DB (10 Relational Tables)                  │
│   • Row-Level Security (RLS) Isolation Policies                 │
└─────────────────────────────────────────────────────────────────┘
```

| Layer | Technologies Used | Justification |
|---|---|---|
| **Frontend UI** | React 18, Vite 6, Tailwind CSS | High performance, modular component architecture, and lightweight client-side state management. |
| **Icons & Effects** | Lucide React, Canvas Confetti | Clean, lightweight SVG iconography and interactive checkout celebration feedback. |
| **Cloud Database** | PostgreSQL via Supabase | Industrial-grade ACID compliant relational database with relational constraints and JSONB support. |
| **Security & Auth** | Supabase Auth + Row-Level Security | Encrypted password storage (bcrypt), cryptographic email verification tokens, and per-table RLS policies. |
| **Payment Simulation** | Razorpay Gateway (Test Mode) | PCI-DSS compliant payment processing simulation with support for UPI QR, Cards, and NetBanking. |
| **AI/ML Sommelier** | Google Gemini API + Rule Heuristics | Natural language query understanding for sensory pairings, dietary restrictions, and board planning. |

---

## 3. Database Entity-Relationship (ER) Schema

The database consists of **10 relational tables** managed through PostgreSQL:

1. **`profiles`**: Extended user attributes (`id` UUID, `email`, `full_name`, `phone`, `role`, `created_at`).
2. **`categories`**: Artisan collections (`hard-aged`, `soft-bloomy`, `fresh-curd`, `butter-cultured`, `gift-hampers`).
3. **`products`**: Dairy catalog with pricing, stock units, aging period, milk source, dietary tags, ingredients, and allergens.
4. **`addresses`**: Customer delivery destinations with postal pincodes, cities, and landmarks.
5. **`orders`**: Master order fulfillment records with order numbers (`PH-XXXXX`), status, payment verification, and totals.
6. **`order_items`**: Child table storing individual line items, variant weights, unit prices, and quantities.
7. **`coupons`**: Discount promotion codes (`PUREHAVEN10`, `FIRSTFARM`, `CHEESELOVER`) with validation thresholds.
8. **`reviews`**: Customer ratings (1 to 5 stars), written feedback, and verified purchase flags.
9. **`support_tickets`**: Customer service tickets (`TKT-XXXXX`), categories, inquiries, and admin replies.
10. **`newsletter_subscribers`**: Email collection for reserve cellar releases.

---

## 4. Artificial Intelligence & Machine Learning Integration

As part of the **BTech CSE AI & ML** curriculum, PureHaven integrates an **Intelligent Shopping Assistant (“Fromager AI”)**:

### 4.1 Natural Language Query Processing
The assistant interprets conversational customer inquiries using natural language:
- **Flavour Profile Matching:** Maps subjective tastes (*“earthy and pungent”*, *“smooth and creamy”*) to specific chemical attributes (tyrosine crystallization, penicillin candidum mold, A2 butterfat).
- **Culinary Pairing Engine:** Suggests food and beverage harmonies (Cabernet Sauvignon with aged Cheddar, Pinot Noir with Truffle Gouda, Acacia Honey with Brie).
- **Party Platter Algorithmic Calculation:**
  $$\text{Appetizer Cheese Allowance} = \text{Guests} \times 90\text{g}$$
  $$\text{Main Course Cheese Allowance} = \text{Guests} \times 175\text{g}$$
  Follows the culinary **"Rule of Three"** (1 Hard Aged + 1 Soft Bloomy + 1 Fresh/Flavored).
- **Dietary Constraint Filtering:** Instantly filters catalog for 100% vegetarian microbial coagulants, near-zero lactose aged wheels, and indigenous Gir cow A2 beta-casein dairy.

---

## 5. College Viva Voce (Q&A Defense Guide)

Here are anticipated questions external examiners and professors may ask, along with model answers:

### Q1: Why did you choose Supabase instead of a local SQLite database?
> **Answer:** SQLite on an ephemeral serverless environment does not persist data across server restarts or multi-user sessions. Supabase provides a hosted PostgreSQL cluster with ACID transactions, real-time subscriptions, and built-in cryptographic authentication with email verification.

### Q2: How does your application ensure user data privacy and security?
> **Answer:** We implemented PostgreSQL **Row-Level Security (RLS)** policies. This ensures that users can only view and mutate their own orders, addresses, and tickets. Administrative operations (such as inventory updates or ticket replies) are locked to authenticated identities holding the `admin` role. Furthermore, we never store sensitive card details or CVVs, following PCI-DSS guidelines.

### Q3: What happens if the external AI API fails or is rate-limited?
> **Answer:** PureHaven implements an intelligent **Graceful Fallback Engine**. If the Gemini API is unreachable or no API key is provided, the application automatically routes queries to a built-in deterministic culinary knowledge engine that parses query tokens and answers pairings, platter calculations, and allergen safety with zero downtime.

### Q4: How is cold-chain integrity handled in an e-commerce context?
> **Answer:** Dairy products spoil if temperatures exceed 8°C. PureHaven incorporates a 48-hour thermal packaging model using biodegradable sheep wool insulation and phase-change gel ice packs. The tracking system simulates real-time temperature telemetry monitoring (e.g. 3.2°C) to assure customers of product integrity before opening the vacuum seal.

---

## 6. Official Submission Checklist

- [x] Full source code written line-by-line with complete documentation
- [x] PostgreSQL migration script (`supabase_schema.sql`)
- [x] Live email verification authentication
- [x] Working cart with Indian pincode cold-chain validator
- [x] Multi-step checkout with coupon calculations (`FIRSTFARM`, `PUREHAVEN10`)
- [x] Razorpay Test Mode & instant UPI QR payment flow
- [x] Visual 6-stage order tracking lifecycle
- [x] Protected Admin Dashboard (`/admin`)
- [x] AI Fromager shopping assistant
- [x] Direct business contact integration (+91 91421 66210 & purehavencare26@gmail.com)
- [x] Standalone downloadable ZIP archive (`PureHaven-Store.zip`)
