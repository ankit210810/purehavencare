import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Send, 
  ShieldCheck,
  FileQuestion,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { localDb } from '../services/supabaseClient';

export default function SupportPage({ navigate }) {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '9142166210',
    orderNumber: '',
    category: 'Delivery', // 'Delivery' | 'Quality' | 'Billing' | 'General'
    subject: '',
    message: ''
  });
  const [submittedTicket, setSubmittedTicket] = useState(null);

  useEffect(() => {
    // Load tickets from persistent storage
    const all = localDb.get('support_tickets', []);
    setTickets(all);
  }, []);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.name || !ticketForm.email || !ticketForm.message) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    const ticketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber,
      customerName: ticketForm.name,
      customerEmail: ticketForm.email,
      customerPhone: ticketForm.phone,
      orderNumber: ticketForm.orderNumber || 'N/A',
      category: ticketForm.category,
      subject: ticketForm.subject || 'Artisan Dairy Inquiry',
      message: ticketForm.message,
      status: 'open',
      adminReply: null,
      createdAt: new Date().toISOString()
    };

    localDb.insert('support_tickets', newTicket);
    setTickets([newTicket, ...tickets]);
    setSubmittedTicket(newTicket);
    addToast(`Support request ${ticketNumber} registered!`, 'success');

    setTicketForm({
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '9142166210',
      orderNumber: '',
      category: 'Delivery',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-cream-50/60 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Dedicated Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Customer Care & Fromagerie Support
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            We are here to assist with cold-chain parcel tracking, artisanal cheese consultations, and corporate tastings.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Direct Phone Contact Card */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Direct Phone Support</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Speak directly with our concierge desk regarding delivery delays or immediate order adjustments.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-cream-100">
              <a
                href="tel:+919142166210"
                className="inline-flex items-center gap-2 text-sm font-bold text-forest-900 hover:text-forest-700"
              >
                <span>+91 91421 66210</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-charcoal-400 mt-1">Mon–Sat: 9:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          {/* Direct Email Contact Card */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Email Inquiries</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Send us inquiries regarding corporate hampers, wedding cheeseboards, or wholesale partnerships.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-cream-100">
              <a
                href="mailto:purehavencare26@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-bold text-forest-900 hover:text-forest-700 break-all"
              >
                <span>purehavencare26@gmail.com</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-charcoal-400 mt-1">Response guaranteed within 4 hours</p>
            </div>
          </div>

          {/* Cold Chain Guarantee */}
          <div className="bg-forest-950 text-cream-100 p-6 rounded-3xl border border-forest-900 shadow-soft flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-butter-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-50">Perishable Dairy Guarantee</h3>
              <p className="text-xs text-cream-200 leading-relaxed">
                If your parcel is delayed past cold-chain thresholds or arrives damaged, we guarantee an immediate replacement or full refund.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-forest-900">
              <button
                type="button"
                onClick={() => navigate('policies', { section: 'refunds' })}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-butter-400 hover:text-white"
              >
                <span>Review Replacement Policy</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Support Ticket Submission Form */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft">
          <div className="max-w-2xl mb-8">
            <h2 className="font-serif text-2xl font-bold text-forest-950">
              Submit a Concierge Request
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
              Every request is assigned a tracking ticket number monitored by our head fromager and logistics team.
            </p>
          </div>

          {submittedTicket && (
            <div className="mb-6 p-4 rounded-2xl bg-forest-50 border border-forest-200 flex items-start gap-3 text-xs text-forest-950">
              <CheckCircle2 className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ticket Registered: #{submittedTicket.ticketNumber}</p>
                <p className="text-forest-700 mt-0.5">
                  We have received your message regarding "{submittedTicket.subject}". A confirmation email has been logged to {submittedTicket.customerEmail}.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  placeholder="e.g. Ananya Sen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={ticketForm.phone}
                  onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                  placeholder="9142166210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Inquiry Category *</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700 font-medium"
                >
                  <option value="Delivery">Cold-Chain Delivery & Tracking</option>
                  <option value="Quality">Cheese Storage, Taste & Quality</option>
                  <option value="Billing">Payment, Invoicing & Refunds</option>
                  <option value="General">Bespoke Gifting & Corporate Orders</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Order Number (If Applicable)</label>
                <input
                  type="text"
                  value={ticketForm.orderNumber}
                  onChange={(e) => setTicketForm({ ...ticketForm, orderNumber: e.target.value })}
                  placeholder="e.g. PH-84291"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Brief summary of your query"
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Detailed Message *</label>
              <textarea
                rows={4}
                required
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                placeholder="Please describe how we can assist you..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 text-butter-400" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>

        {/* Tickets History (Visible to User) */}
        {tickets.length > 0 && (
          <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-950">Your Submitted Support Tickets</h3>
            <div className="divide-y divide-cream-100">
              {tickets.map((t) => (
                <div key={t.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-forest-950">#{t.ticketNumber} • {t.subject}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'resolved' ? 'bg-forest-100 text-forest-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600">{t.message}</p>
                  {t.adminReply && (
                    <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-forest-950 mt-2">
                      <p className="font-bold text-[11px] text-forest-800 uppercase">PureHaven Concierge Reply:</p>
                      <p className="mt-0.5">{t.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
