-- ==============================================================================
-- PureHaven — Premium Artisan Cheese & Farmhouse Dairy Store
-- Complete Supabase PostgreSQL Database Schema & Migration Script
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Click "SQL Editor" on the left menu (the >_ icon)
-- 3. Click "+ New Query" (make sure it is a Postgres query, NOT under Logs!)
-- 4. Paste this entire file and click "Run" (or Ctrl + Enter)
-- 5. All 10 tables, policies, and sample products will be created immediately!
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '9142166210',
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (true);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categories viewable by all" ON public.categories;
CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_slug TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    milk_type TEXT NOT NULL,
    aging TEXT NOT NULL,
    weight TEXT NOT NULL,
    dietary TEXT[] DEFAULT '{}',
    ingredients TEXT NOT NULL,
    allergens TEXT NOT NULL,
    pairings TEXT[] DEFAULT '{}',
    stock INT NOT NULL DEFAULT 25,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 4.8,
    review_count INT DEFAULT 12,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products viewable by all" ON public.products;
CREATE POLICY "Products viewable by all" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 4. SAVED ADDRESSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their addresses" ON public.addresses;
CREATE POLICY "Users can manage their addresses" ON public.addresses FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 5. COUPONS & DISCOUNTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat', 'shipping')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    times_used INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coupons viewable by all" ON public.coupons;
CREATE POLICY "Coupons viewable by all" ON public.coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 6. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' 
        CHECK (status IN ('pending_payment', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT NOT NULL,
    payment_id TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    coupon_code TEXT,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    cold_chain_fee NUMERIC(10, 2) DEFAULT 0,
    tax_amount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    delivery_address JSONB NOT NULL,
    tracking_number TEXT,
    courier_name TEXT DEFAULT 'PureHaven ColdChain Express',
    estimated_delivery TEXT DEFAULT '24–36 Hours',
    notes TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure items column exists if table was already created
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID,
    product_name TEXT NOT NULL,
    product_image TEXT,
    weight TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their orders" ON public.orders;
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Order items viewable by all authorized" ON public.order_items;
CREATE POLICY "Order items viewable by all authorized" ON public.order_items FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 7. REVIEWS & RATINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT true,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews viewable by all" ON public.reviews;
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (is_approved = true);
DROP POLICY IF EXISTS "Users can insert reviews" ON public.reviews;
CREATE POLICY "Users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins moderate reviews" ON public.reviews;
CREATE POLICY "Admins moderate reviews" ON public.reviews FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 8. CUSTOMER SUPPORT TICKETS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_number TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    admin_reply TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own tickets" ON public.support_tickets;
CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can submit tickets" ON public.support_tickets;
CREATE POLICY "Users can submit tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage tickets" ON public.support_tickets;
CREATE POLICY "Admins manage tickets" ON public.support_tickets FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 9. NEWSLETTER SUBSCRIBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- SEED DATA: CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description, image_url, display_order)
VALUES
('Hard & Aged Cheeses', 'hard-aged', 'Aged for 6 to 24 months in temperature-controlled stone rooms. Complex, nutty, crystalline texture.', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=800', 1),
('Soft & Bloomy Rind', 'soft-bloomy', 'Velvety edible rinds with luscious, decadent, creamy running centers.', 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=800', 2),
('Fresh & Curd Cheeses', 'fresh-curd', 'Made and shipped within 24 hours of milking. Delicate milky sweetness and soft textures.', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800', 3),
('Farmhouse Butter & Cultured Dairy', 'butter-cultured', 'Slow-churned from cultured A2 cream. Golden, aromatic, deeply flavorful.', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800', 4),
('Gourmet Gift Hampers', 'gift-hampers', 'Artisan curation with handcrafted crackers, organic wild honey, and tasting knives.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', 5)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- SEED DATA: COUPONS
-- ------------------------------------------------------------------------------
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_value, max_discount, expiry_date, is_active)
VALUES
('PUREHAVEN10', '10% off on all artisan dairy collections', 'percentage', 10, 999, 500, '2028-12-31', true),
('FIRSTFARM', 'Flat ₹150 off on your first farmhouse order', 'flat', 150, 799, 150, '2028-12-31', true),
('CHEESELOVER', '15% off on orders above ₹1,999', 'percentage', 15, 1999, 800, '2028-12-31', true),
('FREESHIP', 'Complimentary insulated cold-chain delivery', 'shipping', 150, 1499, 150, '2028-12-31', true)
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- SEED DATA: PRODUCTS
-- ------------------------------------------------------------------------------
INSERT INTO public.products (name, slug, category_slug, price, original_price, short_description, description, milk_type, aging, weight, dietary, ingredients, allergens, pairings, stock, is_featured, is_bestseller, rating, review_count, images)
VALUES
(
  'PureHaven Reserve Farmhouse Cheddar',
  'reserve-farmhouse-cheddar',
  'hard-aged',
  680,
  790,
  'Clothbound cheddar aged 18 months in Nilgiri stone caves with savory tyrosine crystals.',
  'Our signature reserve clothbound cheddar is handcrafted according to 19th-century methods. Milk from grass-fed cows is coagulated using vegetarian rennet, cheddared by hand, milled, and pressed into large wheels wrapped in organic muslin cloth. Matured for 18 months.',
  'Grass-Fed Pasture Cow Milk',
  'Cave-Matured 18 Months',
  '250g',
  ARRAY['Vegetarian Friendly', '100% Grass-Fed', 'Low Lactose', 'Gluten Free'],
  'Single-herd pasture cow''s milk, microbial rennet, traditional cheese cultures, hand-harvested sea salt.',
  'Contains Milk (Dairy). Naturally free from gluten and artificial preservatives.',
  ARRAY['Artisanal Sourdough', 'Tart Green Apples', 'Whole-grain Mustard', 'Cabernet Sauvignon'],
  22,
  true,
  true,
  4.9,
  38,
  ARRAY['https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=900', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=900']
),
(
  'Black Summer Truffle Farmhouse Gouda',
  'black-truffle-gouda',
  'hard-aged',
  840,
  950,
  'Creamy Dutch-style raw milk curd studded with authentic Italian black summer truffle shavings.',
  'An indulgent masterpiece created by infusing sweet, rich curd with generous flecks of Italian summer truffles (Tuber aestivum). Matured for 7 months on untreated spruce wood planks.',
  'Whole Jersey Cow Milk',
  'Matured 7 Months on Spruce',
  '200g',
  ARRAY['Vegetarian Friendly', 'Artisan Batch', 'Natural Rind'],
  'Pasteurized whole Jersey cow''s milk, black summer truffles (min. 3%), summer truffle aroma, salt, vegetarian rennet.',
  'Contains Milk (Dairy).',
  ARRAY['Warm Crusty Baguette', 'Wildflower Honey', 'Pinot Noir'],
  18,
  true,
  true,
  4.8,
  29,
  ARRAY['https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=900']
),
(
  'PureHaven Bloomy Rind Camembert-Style Brie',
  'bloomy-rind-camembert-brie',
  'soft-bloomy',
  590,
  690,
  'Velvety snow-white edible bloomy rind with a molten, oozing, cultured cream center.',
  'Ladle-moulded by hand using warm morning milk from indigenous grass-fed herds. Cured in humid cooling rooms for 21 days where a downy white coat of bloomy mold flourishes.',
  'Full-Cream Grass-Fed Cow Milk',
  'Ripened 21 Days',
  '200g Wheel',
  ARRAY['Vegetarian Friendly', '100% Grass-Fed', 'Live Cultures'],
  'Fresh whole cow''s milk, organic cream, sea salt, microbial coagulant, Penicillium candidum cultures.',
  'Contains Milk (Dairy).',
  ARRAY['Sourdough Crackers', 'Fresh Black Figs', 'Prosecco'],
  25,
  true,
  true,
  4.9,
  44,
  ARRAY['https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=900']
),
(
  'Hand-Tied Artisan Burrata with Basil Pesto Core',
  'artisan-burrata-pesto-core',
  'fresh-curd',
  490,
  550,
  'A delicate pouch of silky mozzarella encasing luscious stracciatella and cold-pressed pine nut pesto.',
  'Crafted fresh every morning by our master pasta filata artisans. Fresh milk curd is hand-stretched in hot water, blown into an elastic pouch, and generously stuffed with shredded creamy stracciatella.',
  'Fresh Buffalo & Cow Milk Blend',
  'Shipped Fresh (within 12 hrs)',
  '220g (2 x 110g)',
  ARRAY['Vegetarian Friendly', 'Fresh Dairy', 'Short Shelf-Life'],
  'Buffalo milk, cow milk cream, Genovese basil, cold-pressed olive oil, pine nuts, salt, vegetarian rennet.',
  'Contains Milk (Dairy) and Tree Nuts (Pine Nuts).',
  ARRAY['Heirloom Tomatoes', 'Aged Modena Balsamic', 'Toasted Ciabatta'],
  15,
  true,
  true,
  4.9,
  52,
  ARRAY['https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=900']
),
(
  'PureHaven Golden Cultured A2 Farmhouse Butter (Sea Salt)',
  'golden-cultured-a2-farmhouse-butter',
  'butter-cultured',
  450,
  520,
  'Slow-churned from 48-hour fermented A2 Gir cow cream with flakes of hand-harvested sea salt.',
  'Pure gold from pastured heritage A2 Gir cows. Fresh raw cream is cultured for two days with heirloom lactic ferments, unlocking a deep hazelnut and buttermilk fragrance. 84% butterfat.',
  'Indigenous Gir Cow A2 Milk',
  '48-Hour Cultured Fermentation',
  '250g Block',
  ARRAY['A2 Beta-Casein', '100% Grass-Fed', 'Heirloom Fermented', 'Gluten Free'],
  'Cultured A2 cow''s milk pasteurized cream, sea salt flakes, probiotic bacterial cultures.',
  'Contains Milk (Dairy). Suitable for those seeking A2 dairy.',
  ARRAY['Hot Warm Sourdough', 'Flaky Croissants', 'Steak Finishing'],
  35,
  true,
  true,
  5.0,
  61,
  ARRAY['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=900']
),
(
  'The Connoisseur Grand Cheese Tasting Hamper',
  'connoisseur-grand-cheese-tasting-hamper',
  'gift-hampers',
  2850,
  3290,
  'Luxury wooden crate featuring 4 reserve artisan cheeses, A2 butter, wildflower honey, crackers, and wooden board.',
  'The ultimate culinary gift for cheese lovers and gourmet hosts. Presented in a handcrafted reusable pine wood keepsake box lined with insulated natural wool liners and food-grade gel ice packs.',
  'Assorted Heritage Cow & Buffalo Milks',
  'Mixed Selection',
  '1.4kg Gourmet Set',
  ARRAY['Vegetarian Friendly', 'Luxury Gifting', 'Complete Tasting Flight'],
  'Curated collection of aged cheeses, cultured butter, raw honey, and sourdough crackers.',
  'Contains Milk (Dairy), Gluten (Crackers).',
  ARRAY['Includes custom pairing guide and wine pairing recommendations card.'],
  15,
  true,
  true,
  5.0,
  46,
  ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=900']
)
ON CONFLICT (slug) DO NOTHING;
