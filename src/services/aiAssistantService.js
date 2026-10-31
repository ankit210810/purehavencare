import { products } from '../data/products';
import { cheeseKnowledgeBase } from '../data/knowledgeBase';

const RAW_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
// Only treat as Gemini API key if it has the standard Google AI Studio prefix 'AIzaSy'
const IS_VALID_GEMINI_KEY = RAW_KEY.startsWith('AIzaSy');

/**
 * Intelligent Semantic Fromager NLP Engine
 * Evaluates queries against deep artisan dairy, culinary pairing, and dietary knowledge.
 */
function sommelierFallbackResponse(query) {
  const q = query.toLowerCase().trim();

  // 1. Lactose / Digestion / Intolerance
  if (q.includes('lactose') || q.includes('intoleran') || q.includes('digest') || q.includes('stomach') || q.includes('dairy sensitive')) {
    return {
      text: `### What is Lactose & Why is Aged Cheese Safe?

**Lactose** is the natural milk sugar found in fresh dairy. During traditional artisan cheesemaking and cave aging:
1. **Lactic Acid Fermentation:** Natural culture bacteria consume the lactose sugar and convert it into lactic acid.
2. **Whey Separation:** Most remaining liquid lactose is drained away during pressing.

By the time our **PureHaven Reserve Cheddar** reaches 18 months, it contains **virtually zero lactose (<0.1%)**, making it safe and gentle for lactose-intolerant gourmets!

✨ **Our Pure A2 Difference:**
Our **Cultured A2 Butter** and **Greek Yogurt** are sourced exclusively from indigenous Indian Gir cows containing **A2 Beta-Casein protein**, preventing the bloating and inflammation commonly triggered by commercial A1 milk.`,
      recommendedProducts: products.filter(p => ['prod-cheddar-18m', 'prod-truffle-gouda', 'prod-a2-cultured-butter'].includes(p.id))
    };
  }

  // 2. Wine & Beverage Pairings
  if (q.includes('wine') || q.includes('pair') || q.includes('drink') || q.includes('beer') || q.includes('cocktail') || q.includes('champagne')) {
    return {
      text: `### Sommelier Wine & Beverage Pairing Guide

🧀 **Reserve 18M Farmhouse Cheddar**
• **Best Pairing:** Bold Cabernet Sauvignon, Shiraz, or craft IPA.
• *Why:* The assertive tannins effortlessly cut through the crystalline savory fats of the aged curd.

🧀 **Bloomy Rind Camembert-Style Brie**
• **Best Pairing:** Crisp Prosecco, Champagne, or dry sparkling apple cider.
• *Why:* Effervescent bubbles cleanse the palate between bites of the rich, buttery molten core.

🧀 **Black Summer Truffle Gouda**
• **Best Pairing:** Earthy Pinot Noir, Nebbiolo, or oaked Chardonnay.
• *Why:* Amplifies the woodland notes of genuine Italian summer truffles.`,
      recommendedProducts: products.filter(p => ['prod-cheddar-18m', 'prod-brie-normandie', 'prod-truffle-gouda'].includes(p.id))
    };
  }

  // 3. Cheese Board & Party Guest Calculation
  if (q.includes('party') || q.includes('guest') || q.includes('board') || q.includes('platter') || q.includes('how much') || q.includes('people') || q.includes('person') || /\b\d+\b/.test(q)) {
    // Extract guest count if present
    const match = q.match(/\b(\d+)\b/);
    const guests = match ? parseInt(match[1], 10) : 6;
    const appetizerGrams = guests * 90;
    const dinnerGrams = guests * 175;

    return {
      text: `### Artisan Cheese Board Planner for ${guests} Guests

**Recommended Portions:**
• **Cocktail Hour / Appetizer:** ~**${appetizerGrams}g total** (approx. 80–100g per guest).
• **Main Cheese Course:** ~**${dinnerGrams}g total** (approx. 150–200g per guest).

✨ **The Affineur's Rule of Three:**
1. **Hard & Aged:** PureHaven Reserve 18M Cheddar (for crystalline crunch)
2. **Soft & Bloomy:** Bloomy Rind Camembert-Style Brie (for buttery decadence)
3. **Flavored Reserve:** Black Summer Truffle Gouda (for woodland aroma)
4. **Fresh Accents:** Hand-Tied Burrata with fresh heirloom tomatoes

💡 *Tip:* Save time with our curated **Connoisseur Grand Hamper** which includes crackers and wine pairing cards!`,
      recommendedProducts: products.filter(p => ['prod-hamper-connoisseur', 'prod-cheddar-18m', 'prod-brie-normandie'].includes(p.id))
    };
  }

  // 4. Cheddar & Hard Cheeses
  if (q.includes('cheddar') || q.includes('hard') || q.includes('aged') || q.includes('parmesan') || q.includes('pecorino') || q.includes('sharp')) {
    return {
      text: `### PureHaven Reserve Farmhouse Cheddar (Aged 18 Months)

• **Aging:** 18 continuous months on untreated spruce planks in climate-controlled limestone caves.
• **Tasting Notes:** Sharp, savory umami with visible calcium lactate crunch crystals.
• **Milk:** 100% grass-fed cow milk, single-herd pasture sourcing.
• **Serving Idea:** Pair with honeycomb, toasted walnuts, and a crisp green apple wedge.`,
      recommendedProducts: products.filter(p => ['prod-cheddar-18m', 'prod-truffle-gouda'].includes(p.id))
    };
  }

  // 5. Brie & Soft / Creamy Cheeses
  if (q.includes('brie') || q.includes('camembert') || q.includes('soft') || q.includes('creamy') || q.includes('bloomy')) {
    return {
      text: `### Bloomy Rind Camembert-Style Brie

• **Crafting:** Inoculated with *Penicillium camemberti* to create a delicate, edible white velvety rind.
• **Texture:** Luscious, flowing molten cream interior with hazelnut undertones.
• **Pro Tip:** Remove from refrigeration 45 minutes prior to serving to allow the butterfat to reach room temperature.`,
      recommendedProducts: products.filter(p => ['prod-brie-normandie', 'prod-burrata-pesto'].includes(p.id))
    };
  }

  // 6. Truffle & Gouda
  if (q.includes('truffle') || q.includes('gouda') || q.includes('mushroom')) {
    return {
      text: `### Black Summer Truffle Farmhouse Gouda

• **Origin:** Crafted with genuine Umbrian summer truffles (*Tuber aestivum*) folded into unpasteurized milk curds.
• **Aging:** 7 months of slow cave affinage.
• **Profile:** Deep aroma of forest floor, browned butter, and subtle sweetness. Perfect on warm sourdough or shaved over fresh risotto.`,
      recommendedProducts: products.filter(p => ['prod-truffle-gouda'].includes(p.id))
    };
  }

  // 7. Butter & A2 Dairy
  if (q.includes('butter') || q.includes('a2') || q.includes('yogurt') || q.includes('breakfast') || q.includes('ghee') || q.includes('cow')) {
    return {
      text: `### Golden Cultured A2 Farmhouse Butter

• **Fermentation:** 48 hours of slow lactic cream culturing before traditional wooden barrel churning.
• **Butterfat:** Premium 84% butterfat ratio infused with sea salt crystals.
• **Milk Source:** Sourced exclusively from pasture-grazing indigenous Gir cows with natural A2 beta-casein proteins.`,
      recommendedProducts: products.filter(p => ['prod-a2-cultured-butter', 'prod-greek-yogurt'].includes(p.id))
    };
  }

  // 8. Storage, Freshness & Shelf Life
  if (q.includes('stor') || q.includes('shelf') || q.includes('keep') || q.includes('fridge') || q.includes('freeze') || q.includes('spoil') || q.includes('mold')) {
    return {
      text: `### How to Store Artisan Cheese at Home

1. **Never use plastic cling wrap:** Plastic suffocates living cheese cultures. Wrap cheeses in porous wax paper or baking parchment.
2. **Optimal Temperature:** Keep in the vegetable crisper drawer at **4°C to 8°C**, where humidity is balanced.
3. **Never freeze hard cheese:** Freezing fractures the delicate protein and fat matrix, ruining texture.
4. **Serving:** Bring aged cheeses to room temperature for 30–45 minutes before dining to release volatile flavor aromatics.`,
      recommendedProducts: products.slice(0, 2)
    };
  }

  // 9. Vegetarian / Rennet / Halal / Sourcing
  if (q.includes('vegetarian') || q.includes('rennet') || q.includes('animal') || q.includes('halal') || q.includes('pure') || q.includes('source')) {
    return {
      text: `### 100% Vegetarian & Ethical Guarantee

🌱 **Zero Animal Rennet:** Every PureHaven product is fermented with non-GMO microbial or plant-derived coagulants.
🐄 **Ethical Herd Grazing:** Our partner farms follow open-pasture rotational grazing with zero prophylactic hormones or routine antibiotics.
🌾 **Non-Standardized:** Natural, seasonal variation in color reflects the pasture grasses eaten by the herd.`,
      recommendedProducts: products.slice(0, 3)
    };
  }

  // 10. Discount, Coupon Codes & Pricing
  if (q.includes('coupon') || q.includes('discount') || q.includes('code') || q.includes('offer') || q.includes('promo') || q.includes('price')) {
    return {
      text: `### Active PureHaven Privilege Codes

• **FIRSTFARM:** 15% discount on your first artisan order.
• **PUREHAVEN10:** 10% privilege discount on all handcrafted collections.
• **CHEESELOVER:** Flat ₹250 off on orders above ₹1,999.
• **Complimentary Delivery:** Free cold-chain express shipping on all orders over ₹1,499!`,
      recommendedProducts: products.filter(p => p.isBestseller)
    };
  }

  // 11. Cold Chain & Delivery Times
  if (q.includes('deliver') || q.includes('ship') || q.includes('track') || q.includes('cold') || q.includes('courier') || q.includes('pincode')) {
    return {
      text: `### Sub-Zero Cold-Chain Logistics

• **Packaging:** Insulated, recyclable wool-fiber liners packed with certified sub-zero gel refrigerant maintaining 2°C – 6°C for up to 48 hours.
• **Delivery Speed:** 
  - Metro Hubs: 24 to 36 hours.
  - Other Serviceable Cities: 48 hours maximum.
• **Live Tracking:** Real-time temperature and courier milestones available via your tracking link.`,
      recommendedProducts: []
    };
  }

  // 12. Support & Contact
  if (q.includes('contact') || q.includes('support') || q.includes('phone') || q.includes('email') || q.includes('call') || q.includes('help') || q.includes('number')) {
    return {
      text: `### PureHaven Dedicated Concierge Desk

📞 **Direct Phone:** [+91 91421 66210](tel:+919142166210)
✉️ **Direct Email:** [purehavencare26@gmail.com](mailto:purehavencare26@gmail.com)
⏰ **Hours:** Monday to Saturday, 9:00 AM – 7:00 PM IST

Our cellar master is happy to assist with custom cheese wheel cuts, wedding platters, and corporate hampers.`,
      recommendedProducts: []
    };
  }

  // 13. Friendly Greetings & Chit-chat
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('good morning') || q.includes('good evening') || q.includes('who are you') || q.includes('what can you do')) {
    return {
      text: `Hello! I am your **PureHaven Fromager AI**, trained on French, Italian, and Indian farmhouse affineur traditions.

I can help you with:
• 🧀 Recommending artisan cheeses tailored to your flavor preference
• 🍷 Designing wine & beverage pairings for any bottle
• 🍽️ Calculating cheese board weights for dinners and gatherings
• 🌿 Dietary advice (vegetarian rennet, low-lactose, A2 cow milk)
• ❄️ Cold-chain delivery, storage, and knife-cutting advice

What flavors are you craving today?`,
      recommendedProducts: products.slice(0, 3)
    };
  }

  // 14. Fuzzy Search through product catalog
  const matched = products.filter(p => {
    const text = `${p.name} ${p.shortDescription} ${p.milkType} ${p.tastingNotes}`.toLowerCase();
    const words = q.split(/\s+/).filter(w => w.length > 2);
    return words.some(w => text.includes(w));
  });

  if (matched.length > 0) {
    return {
      text: `I discovered these artisan selections matching your palate for **"${query}"**:`,
      recommendedProducts: matched.slice(0, 3)
    };
  }

  // Fallback
  return {
    text: `I am delighted to assist with your cheese tasting journey. You can ask me about:
• **"What is low lactose?"** or lactose-free cheeses
• **"Wine pairings for Cheddar and Brie"**
• **"How much cheese for 8 guests?"**
• **"How should I store artisan cheese?"**
• **"Active coupon codes"**

Or speak directly to our concierge team at **+91 91421 66210**.`,
    recommendedProducts: products.slice(0, 3)
  };
}

/**
 * Ask the AI Assistant
 */
export async function askAIAssistant(userMessage, chatHistory = []) {
  // If no valid Gemini key (AIzaSy...), instantly use local Fromager engine with 300ms realistic delay
  if (!IS_VALID_GEMINI_KEY) {
    await new Promise(resolve => setTimeout(resolve, 350));
    return sommelierFallbackResponse(userMessage);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const systemPrompt = `You are the Master Fromager and AI Sommelier for PureHaven, a luxury artisan cheese and farmhouse dairy brand.
Tone: Warm, knowledgeable, refined, welcoming.
Contact: +91 91421 66210 | purehavencare26@gmail.com.
Available cheeses: ${products.map(p => p.name).join(', ')}.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${RAW_KEY}`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'user', parts: [{ text: userMessage }] }
        ]
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Find matching products
    const matchedProducts = products.filter(p => 
      replyText.toLowerCase().includes(p.name.toLowerCase()) || 
      userMessage.toLowerCase().includes(p.name.toLowerCase())
    ).slice(0, 3);

    return {
      text: replyText,
      recommendedProducts: matchedProducts.length > 0 ? matchedProducts : products.slice(0, 2)
    };
  } catch (error) {
    // Graceful instantaneous fallback
    return sommelierFallbackResponse(userMessage);
  }
}
