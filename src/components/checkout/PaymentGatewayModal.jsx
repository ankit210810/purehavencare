import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Smartphone,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

export default function PaymentGatewayModal({ 
  isOpen, 
  orderNumber, 
  amount, 
  customerName, 
  customerEmail, 
  customerPhone, 
  defaultMethod = 'razorpay',
  onSuccess, 
  onClose 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(defaultMethod === 'upi' ? 'upi' : 'card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'success'
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 8923 1102 7845');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardName, setCardName] = useState(customerName || 'Ankit Kumar');

  // UPI state
  const [upiId, setUpiId] = useState(`${customerEmail?.split('@')[0] || 'customer'}@okhdfcbank`);
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [otpCode, setOtpCode] = useState('782941');

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const fillTestCard = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardName('Ankit Kumar (Test)');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('purehaven.dairy@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Submit payment
  const handleInitiatePayment = () => {
    if (activeTab === 'card') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep('otp');
      }, 1000);
    } else {
      // Direct UPI / Netbanking simulated auth
      simulateFinalSuccess();
    }
  };

  const simulateFinalSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      setTimeout(() => {
        const paymentId = `pay_rzp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        onSuccess({
          paymentId,
          orderId: `order_${orderNumber}`,
          paymentMethod: activeTab,
          amount,
          status: 'paid'
        });
      }, 900);
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    simulateFinalSuccess();
  };

  const banks = [
    { id: 'HDFC', name: 'HDFC Bank', code: 'hdfc' },
    { id: 'ICICI', name: 'ICICI Bank', code: 'icici' },
    { id: 'SBI', name: 'State Bank of India', code: 'sbi' },
    { id: 'AXIS', name: 'Axis Bank', code: 'axis' },
    { id: 'KOTAK', name: 'Kotak Mahindra', code: 'kotak' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-950/75 backdrop-blur-xs transition-opacity" 
      />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0052cc] border border-blue-400/30 flex items-center justify-center font-bold text-white text-lg shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">PureHaven Artisan Store</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/20">
                  TEST MODE
                </span>
              </div>
              <p className="text-xs text-blue-200/80">Order Ref: {orderNumber} • {customerEmail}</p>
            </div>
          </div>

          <div className="text-right flex items-center gap-4">
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-semibold">Total Payable</p>
              <p className="font-serif text-2xl font-bold text-white">₹{amount}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 transition-colors"
              aria-label="Close Payment Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Razorpay Sandbox Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span><strong>Razorpay Test Sandbox:</strong> No actual charges will be deducted from your bank.</span>
          </div>
          <button
            type="button"
            onClick={fillTestCard}
            className="text-[11px] font-bold text-blue-700 hover:underline"
          >
            Auto-fill Test Card
          </button>
        </div>

        {/* STEP 1: PAYMENT METHOD SELECTION & DETAILS */}
        {step === 'input' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar with Payment Tabs */}
            <div className="w-full md:w-56 bg-cream-50/70 border-b md:border-b-0 md:border-r border-cream-200 p-3 space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'card'
                    ? 'bg-white text-forest-950 shadow-sm border border-cream-200 font-bold'
                    : 'text-charcoal-600 hover:bg-cream-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-forest-800" />
                <span>Card (Debit/Credit)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'upi'
                    ? 'bg-white text-forest-950 shadow-sm border border-cream-200 font-bold'
                    : 'text-charcoal-600 hover:bg-cream-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-forest-800" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'netbanking'
                    ? 'bg-white text-forest-950 shadow-sm border border-cream-200 font-bold'
                    : 'text-charcoal-600 hover:bg-cream-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-forest-800" />
                <span>NetBanking</span>
              </button>

              <div className="pt-4 px-3 text-[11px] text-charcoal-500 space-y-1">
                <p className="flex items-center gap-1.5 font-semibold text-forest-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                  <span>256-Bit SSL Encrypted</span>
                </p>
                <p className="text-[10px] text-charcoal-400">PCI-DSS Certified Gateway</p>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 p-6 sm:p-7 overflow-y-auto space-y-5">
              
              {/* TAB: CARD */}
              {activeTab === 'card' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-forest-950 mb-1">
                      Pay with Credit or Debit Card
                    </h4>
                    <p className="text-xs text-charcoal-500">
                      Visa, Mastercard, RuPay, and American Express accepted
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 0000 0000 0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50/60 border border-cream-300 font-mono text-sm tracking-wider focus:outline-none focus:border-forest-800"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-bold text-charcoal-400">
                          <span>VISA</span>
                          <span>•</span>
                          <span>RUPAY</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50/60 border border-cream-300 font-mono text-xs focus:outline-none focus:border-forest-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50/60 border border-cream-300 font-mono text-xs tracking-widest focus:outline-none focus:border-forest-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name as on card"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50/60 border border-cream-300 text-xs focus:outline-none focus:border-forest-800"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleInitiatePayment}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting to Bank Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ₹{amount} Securely</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* TAB: UPI */}
              {activeTab === 'upi' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-serif text-base font-bold text-forest-950 mb-1">
                      Scan QR or Enter UPI VPA ID
                    </h4>
                    <p className="text-xs text-charcoal-500">
                      Supports Google Pay, PhonePe, Paytm, BHIM & all banking apps
                    </p>
                  </div>

                  {/* Dynamic QR Code representation */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-cream-50 border border-cream-200">
                    <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-cream-300 shadow-sm flex flex-col items-center justify-center flex-shrink-0">
                      {/* SVG Stylized QR */}
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-charcoal-900">
                        <rect x="0" y="0" width="30" height="30" fill="#1C3527" />
                        <rect x="5" y="5" width="20" height="20" fill="white" />
                        <rect x="10" y="10" width="10" height="10" fill="#1C3527" />
                        
                        <rect x="70" y="0" width="30" height="30" fill="#1C3527" />
                        <rect x="75" y="5" width="20" height="20" fill="white" />
                        <rect x="80" y="10" width="10" height="10" fill="#1C3527" />

                        <rect x="0" y="70" width="30" height="30" fill="#1C3527" />
                        <rect x="5" y="75" width="20" height="20" fill="white" />
                        <rect x="10" y="80" width="10" height="10" fill="#1C3527" />

                        <circle cx="50" cy="50" r="12" fill="#F5C227" />
                        <rect x="42" y="15" width="16" height="6" fill="#1C3527" />
                        <rect x="42" y="79" width="16" height="6" fill="#1C3527" />
                        <rect x="15" y="42" width="6" height="16" fill="#1C3527" />
                        <rect x="79" y="42" width="6" height="16" fill="#1C3527" />
                      </svg>
                      <p className="text-[9px] font-bold text-forest-900 uppercase mt-1">Scan & Pay ₹{amount}</p>
                    </div>

                    <div className="text-xs space-y-2 text-center sm:text-left flex-1">
                      <p className="font-bold text-forest-950">PureHaven UPI ID:</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="font-mono px-2.5 py-1 rounded-lg bg-white border border-cream-300 font-bold text-forest-900">
                          purehaven.dairy@icici
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="p-1.5 rounded-lg border border-cream-300 hover:bg-cream-100 text-charcoal-700"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-forest-700" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-charcoal-500">
                        Scan the QR code with any UPI app on your phone, or click below to simulate immediate phone approval.
                      </p>
                    </div>
                  </div>

                  {/* UPI VPA Form */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600">
                      Or Pay via UPI ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 font-mono text-xs focus:outline-none focus:border-forest-800"
                      />
                      <button
                        type="button"
                        onClick={simulateFinalSuccess}
                        className="px-4 py-2.5 rounded-xl bg-forest-900 text-cream-50 font-bold text-xs hover:bg-forest-800"
                      >
                        Verify & Pay
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={simulateFinalSuccess}
                    className="w-full py-3.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Awaiting UPI App Confirmation...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Simulate Instant UPI Approval (₹{amount})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* TAB: NETBANKING */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-forest-950 mb-1">
                      Internet Banking
                    </h4>
                    <p className="text-xs text-charcoal-500">
                      Direct integration with leading Indian retail banks
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {banks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedBank === b.id
                            ? 'border-forest-900 bg-forest-50/60 font-bold text-forest-950 shadow-xs'
                            : 'border-cream-200 hover:border-cream-300 text-charcoal-700'
                        }`}
                      >
                        <p className="text-xs font-bold">{b.name}</p>
                        <p className="text-[10px] text-charcoal-500 mt-0.5">Retail Banking</p>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={simulateFinalSuccess}
                    className="w-full mt-4 py-3.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authorizing with {selectedBank}...</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Proceed with {selectedBank} (₹{amount})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* STEP 2: BANK OTP VERIFICATION MODAL */}
        {step === 'otp' && (
          <div className="p-8 max-w-md mx-auto w-full text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-forest-950">
              Bank 3D-Secure Authentication
            </h3>
            <p className="text-xs text-charcoal-600">
              An authentication OTP has been dispatched to mobile ending with <strong>••••••{customerPhone?.slice(-4) || '6210'}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
              <div className="max-w-[200px] mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cream-50 border-2 border-forest-800 text-center font-mono text-xl tracking-widest font-bold focus:outline-none"
                />
                <p className="text-[10px] text-charcoal-400 mt-1">Test Sandbox OTP: 782941</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP & Clearing Funds...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-butter-400" />
                    <span>Authorize Payment of ₹{amount}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="p-10 text-center space-y-3 my-auto">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-forest-700" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-950">
              Payment Authorized Successfully!
            </h3>
            <p className="text-xs text-charcoal-600">
              Razorpay transaction captured. Preparing your cold-chain order packaging...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
