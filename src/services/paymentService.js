/**
 * PureHaven Payment Gateway Service
 * Supports Razorpay Test Mode & Secure Mock Payment Processing
 */

export const paymentMethods = [
  {
    id: 'razorpay',
    name: 'Razorpay / Cards / NetBanking / UPI',
    description: 'Pay securely using Credit/Debit Card, UPI (Google Pay, PhonePe, Paytm), or NetBanking',
    icon: 'credit-card',
    isOnline: true
  },
  {
    id: 'upi',
    name: 'Direct Instant UPI QR',
    description: 'Scan & Pay instantly using any UPI App (GPay, PhonePe, Paytm, BHIM)',
    icon: 'qr-code',
    isOnline: true
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (Cold-Chain Verified)',
    description: 'Pay cash or UPI upon delivery. Available for serviceable metro pincodes.',
    icon: 'banknote',
    isOnline: false
  }
];

export async function processPayment({
  orderNumber,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  paymentMethod = 'razorpay'
}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate clean payment transaction ID
      const paymentId = `pay_ph_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const signature = `sig_${Math.random().toString(36).substring(2, 15)}`;

      resolve({
        success: true,
        orderId: `order_rzp_${orderNumber}`,
        paymentId,
        signature,
        status: paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentMethod,
        timestamp: new Date().toISOString()
      });
    }, 1200);
  });
}
