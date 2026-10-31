export const initialCoupons = [
  {
    id: "coup-1",
    code: "PUREHAVEN10",
    description: "10% off on all artisan dairy collections (Min order ₹999)",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    expiryDate: "2028-12-31",
    isActive: true,
    timesUsed: 42
  },
  {
    id: "coup-2",
    code: "FIRSTFARM",
    description: "Flat ₹150 off on your first farmhouse order (Min order ₹799)",
    discountType: "flat",
    discountValue: 150,
    minOrderValue: 799,
    maxDiscount: 150,
    expiryDate: "2028-12-31",
    isActive: true,
    timesUsed: 89
  },
  {
    id: "coup-3",
    code: "CHEESELOVER",
    description: "15% off on gourmet orders above ₹1,999",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 1999,
    maxDiscount: 800,
    expiryDate: "2028-12-31",
    isActive: true,
    timesUsed: 65
  },
  {
    id: "coup-4",
    code: "FREESHIP",
    description: "Complimentary insulated cold-chain delivery on orders above ₹1,499",
    discountType: "shipping",
    discountValue: 150,
    minOrderValue: 1499,
    maxDiscount: 150,
    expiryDate: "2028-12-31",
    isActive: true,
    timesUsed: 112
  }
];
