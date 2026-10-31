import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Truck, 
  Tag, 
  MessageSquare, 
  Star, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  Filter,
  ArrowRight,
  TrendingUp,
  Snowflake,
  Search,
  RefreshCw,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { products as initialProducts } from '../data/products';
import { initialCoupons } from '../data/coupons';
import { localDb } from '../services/supabaseClient';
import { fetchAllOrders, updateOrderStatus as updateOrderStatusService } from '../services/orderService';
import InvoiceModal from '../components/common/InvoiceModal';

export default function AdminDashboardPage({ navigate, onQuickView }) {
  const { user, isAdmin, switchRole } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'products' | 'coupons' | 'support' | 'reviews'

  // Data states
  const [orders, setOrders] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [ticketsList, setTicketsList] = useState([]);

  // Modals & Forms
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [replyTicketModal, setReplyTicketModal] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  
  // Product Add/Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categorySlug: 'hard-aged',
    price: 650,
    originalPrice: 750,
    weight: '250g',
    milkType: 'Grass-Fed Cow Milk',
    aging: 'Aged 12 Months',
    stock: 20,
    shortDescription: '',
    description: '',
    ingredients: "Single-herd pasture cow's milk, microbial rennet, sea salt.",
    allergens: 'Contains Milk (Dairy).',
    tastingNotes: 'Nutty, savory, buttery finish.',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=800'
  });

  // Coupon Creation Form
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    expiryDate: '2028-12-31'
  });

  // Search in orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync orders from Supabase PostgreSQL and local storage
  const syncLiveOrders = async () => {
    setIsSyncing(true);
    try {
      const fetched = await fetchAllOrders();
      if (fetched && fetched.length > 0) {
        setOrders(fetched);
      }
    } catch (err) {
      console.warn('Error syncing live orders:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    syncLiveOrders();

    // 2. Products
    const storedProducts = localDb.get('products', []);
    if (storedProducts.length === 0) {
      localDb.set('products', initialProducts);
      setProductsList(initialProducts);
    } else {
      setProductsList(storedProducts);
    }

    // 3. Coupons
    const storedCoupons = localDb.get('coupons', []);
    if (storedCoupons.length === 0) {
      localDb.set('coupons', initialCoupons);
      setCouponsList(initialCoupons);
    } else {
      setCouponsList(storedCoupons);
    }

    // 4. Support Tickets
    const storedTickets = localDb.get('support_tickets', []);
    if (storedTickets.length === 0) {
      const seedTickets = [
        {
          id: 'tkt_seed_1',
          ticketNumber: 'TKT-91421',
          customerName: 'Ananya Roy',
          customerEmail: 'ananya@gmail.com',
          customerPhone: '9142166210',
          orderNumber: 'PH-84291',
          category: 'Delivery',
          subject: 'Estimated Delivery Time in Indiranagar',
          message: 'Could you confirm if the delivery rider will call before arriving? I want to ensure it is placed in the fridge immediately.',
          status: 'open',
          adminReply: null,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      localDb.set('support_tickets', seedTickets);
      setTicketsList(seedTickets);
    } else {
      setTicketsList(storedTickets);
    }
  }, []);

  // Overview metrics
  const metrics = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? Number(o.total) : 0), 0);
    const pendingOrders = orders.filter((o) => ['confirmed', 'processing', 'packed'].includes(o.status)).length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const lowStockCount = productsList.filter((p) => p.stock <= 15).length;
    const openTicketsCount = ticketsList.filter((t) => t.status === 'open').length;

    return {
      totalSales,
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      lowStockCount,
      openTicketsCount,
      aov: orders.length > 0 ? Math.round(totalSales / orders.length) : 0
    };
  }, [orders, productsList, ticketsList]);

  // Order status updater (Synchronizes across Supabase & Local)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    await updateOrderStatusService(orderId, targetOrder?.orderNumber, newStatus);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    addToast(`Order fulfillment status updated to "${newStatus.replace('_', ' ')}"`, 'success');
  };

  // Support Ticket Reply
  const handleSendTicketReply = (ticketId) => {
    if (!adminReplyText.trim()) return;
    const updated = localDb.update('support_tickets', ticketId, {
      adminReply: adminReplyText,
      status: 'resolved'
    });
    if (updated) {
      setTicketsList(ticketsList.map((t) => (t.id === ticketId ? { ...t, adminReply: adminReplyText, status: 'resolved' } : t)));
      addToast('Reply sent and ticket resolved!', 'success');
      setReplyTicketModal(null);
      setAdminReplyText('');
    }
  };

  // Product Add / Edit Handler
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      // Edit existing
      const updatedList = productsList.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            ...productForm,
            images: [productForm.image, ...(p.images ? p.images.slice(1) : [])]
          };
        }
        return p;
      });
      setProductsList(updatedList);
      localDb.set('products', updatedList);
      addToast(`Product "${productForm.name}" updated!`, 'success');
    } else {
      // Create new
      const newProd = {
        id: `prod_${Date.now()}`,
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        rating: 5.0,
        reviewCount: 1,
        isBestseller: false,
        isFeatured: false,
        dietary: ['Vegetarian Friendly', 'Artisanal Batch'],
        pairings: ['Warm Sourdough', 'Artisan Honey'],
        storage: 'Keep refrigerated between 2°C – 4°C.',
        images: [productForm.image],
        variants: [{ weight: productForm.weight, price: Number(productForm.price) }],
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock)
      };
      const updatedList = [newProd, ...productsList];
      setProductsList(updatedList);
      localDb.set('products', updatedList);
      addToast(`Product "${productForm.name}" created!`, 'success');
    }

    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to archive this product?')) {
      const filtered = productsList.filter((p) => p.id !== productId);
      setProductsList(filtered);
      localDb.set('products', filtered);
      addToast('Product archived from store', 'info');
    }
  };

  // Coupon Creation Handler
  const handleSaveCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) return;

    const newCoupon = {
      id: `coup_${Date.now()}`,
      code: couponForm.code.trim().toUpperCase(),
      description: couponForm.description,
      discountType: couponForm.discountType,
      discountValue: Number(couponForm.discountValue),
      minOrderValue: Number(couponForm.minOrderValue),
      maxDiscount: Number(couponForm.maxDiscount),
      expiryDate: couponForm.expiryDate,
      isActive: true,
      timesUsed: 0
    };

    const updated = [newCoupon, ...couponsList];
    setCouponsList(updated);
    localDb.set('coupons', updated);
    addToast(`Coupon "${newCoupon.code}" activated!`, 'success');
    setShowCouponModal(false);
    setCouponForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 500,
      expiryDate: '2028-12-31'
    });
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchesNum = o.orderNumber?.toLowerCase().includes(q);
        const matchesName = o.customerName?.toLowerCase().includes(q);
        const matchesCity = o.deliveryAddress?.city?.toLowerCase().includes(q);
        if (!matchesNum && !matchesName && !matchesCity) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  return (
    <div className="min-h-screen bg-cream-100/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-forest-950 text-cream-50 p-6 sm:p-8 rounded-3xl border border-forest-900 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-forest-900 border border-butter-400 text-butter-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold">PureHaven Fromagerie Suite</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-charcoal-950 uppercase tracking-wider">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-cream-300 mt-1">
                Real-time inventory management, cold-chain fulfillment tracking, and customer care desk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={syncLiveOrders}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-butter-300 border border-butter-400/40 text-xs font-bold transition-all shadow-xs"
              title="Fetch fresh orders from Supabase PostgreSQL database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Orders'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 text-xs font-semibold border border-forest-800 transition-colors"
            >
              View Storefront
            </button>
            <button
              type="button"
              onClick={() => switchRole('customer')}
              className="px-4 py-2 rounded-xl bg-butter-500 hover:bg-butter-400 text-forest-950 text-xs font-bold transition-colors shadow-sm"
              title="Switch to customer mode for testing customer flows"
            >
              Switch to Customer Mode
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex rounded-2xl bg-white border border-cream-200 p-1.5 shadow-soft overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: TrendingUp },
            { id: 'orders', label: `Fulfillment & Orders (${orders.length})`, icon: Truck },
            { id: 'products', label: `Inventory & Products (${productsList.length})`, icon: Package },
            { id: 'coupons', label: `Coupons & Offers (${couponsList.length})`, icon: Tag },
            { id: 'support', label: `Support Tickets (${ticketsList.length})`, icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-forest-900 text-cream-50 shadow-sm'
                    : 'text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Total Verified Sales</span>
                  <div className="p-2 rounded-xl bg-forest-100 text-forest-800">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-forest-950">₹{metrics.totalSales.toLocaleString()}</p>
                <p className="text-[11px] text-forest-700 mt-1 font-medium">From {orders.length} confirmed orders</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Orders in Transit</span>
                  <div className="p-2 rounded-xl bg-butter-100 text-amber-700">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-forest-950">{metrics.pendingOrders}</p>
                <p className="text-[11px] text-charcoal-500 mt-1">Cold-chain gel packs active</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Average Order Value</span>
                  <div className="p-2 rounded-xl bg-forest-100 text-forest-800">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-forest-950">₹{metrics.aov}</p>
                <p className="text-[11px] text-charcoal-500 mt-1">High-ticket gourmet hampers</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Open Support Inquiries</span>
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-forest-950">{metrics.openTicketsCount}</p>
                <p className="text-[11px] text-rose-700 mt-1 font-medium">Requires sommelier response</p>
              </div>

            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-cream-100">
                <h3 className="font-serif text-lg font-bold text-forest-950">Recent Cold-Chain Dispatches</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-cream-100 text-xs">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-forest-950 text-sm">{ord.orderNumber}</span>
                        <span className="font-semibold text-charcoal-700">• {ord.customerName}</span>
                        <span className="text-charcoal-400 text-[11px]">({ord.deliveryAddress?.city})</span>
                      </div>
                      <p className="text-charcoal-500 text-[11px] mt-0.5">
                        {ord.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif font-bold text-forest-950 text-sm">₹{ord.total}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'delivered' ? 'bg-forest-100 text-forest-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ord.status?.replace('_', ' ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setSelectedOrder(ord); setActiveTab('orders'); }}
                        className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-700"
                        title="Manage Order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order #, Customer, or City..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
                <span className="text-charcoal-500">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold focus:outline-none focus:border-forest-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">In Chilling/Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">In Transit (Shipped)</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/70 border-b border-cream-200 text-charcoal-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4">Courier / Tracking</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                        <td className="p-4 font-serif font-bold text-forest-950">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-charcoal-900">{ord.customerName}</p>
                          <p className="text-[11px] text-charcoal-500">{ord.deliveryAddress?.city}, {ord.customerPhone}</p>
                        </td>
                        <td className="p-4 font-serif font-bold text-forest-950">
                          ₹{ord.total}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'paid' ? 'bg-forest-100 text-forest-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-cream-50 border border-cream-300 text-xs font-semibold focus:outline-none focus:border-forest-700"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">In Chilling (4°C)</option>
                            <option value="packed">Packed in Wool</option>
                            <option value="shipped">Cold-Chain Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-[11px] text-charcoal-600">
                          <p className="font-semibold">{ord.courierName}</p>
                          <p className="text-charcoal-400">{ord.trackingNumber}</p>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInvoiceOrder(ord)}
                              className="p-1.5 rounded-lg border border-cream-300 hover:bg-cream-100 text-charcoal-700 transition-colors"
                              title="Print Official GST Invoice"
                            >
                              <Printer className="w-3.5 h-3.5 text-forest-800" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1.5 rounded-lg bg-forest-900 text-cream-50 font-bold hover:bg-forest-800 text-xs"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Details Drawer / Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-cream-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-cream-100">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-forest-950">{selectedOrder.orderNumber}</h3>
                      <p className="text-xs text-charcoal-500">Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 rounded-xl hover:bg-cream-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Address */}
                  <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 text-xs space-y-1">
                    <p className="font-bold text-forest-950 uppercase text-[10px]">Destination Address:</p>
                    <p className="text-charcoal-700">{selectedOrder.deliveryAddress?.line1}, {selectedOrder.deliveryAddress?.line2}</p>
                    <p className="text-charcoal-700">{selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="font-bold text-xs text-forest-950 uppercase">Purchased Items:</p>
                    <div className="divide-y divide-cream-100 text-xs">
                      {selectedOrder.items?.map((it, idx) => (
                        <div key={idx} className="py-2 flex justify-between">
                          <span>{it.name} ({it.weight}) × {it.quantity}</span>
                          <span className="font-serif font-bold">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cream-100 flex justify-between text-sm font-bold text-forest-950">
                    <span>Total Amount Paid:</span>
                    <span className="font-serif text-lg">₹{selectedOrder.total}</span>
                  </div>

                  <div className="pt-3 border-t border-cream-100 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setInvoiceOrder(selectedOrder)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-charcoal-700 text-xs font-bold transition-colors"
                    >
                      <Printer className="w-4 h-4 text-forest-800" />
                      <span>Print Tax Invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('track', { orderNumber: selectedOrder.orderNumber })}
                      className="flex-1 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold"
                    >
                      Open Live Tracker
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2.5 rounded-xl bg-cream-100 text-charcoal-800 text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">Artisan Catalog & Inventory</h3>
                <p className="text-xs text-charcoal-500">Manage wheel batches, aging times, pricing, and stock.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    categorySlug: 'hard-aged',
                    price: 650,
                    originalPrice: 750,
                    weight: '250g Wedge',
                    milkType: 'Grass-Fed Cow Milk',
                    aging: 'Aged 12 Months',
                    stock: 20,
                    shortDescription: '',
                    description: '',
                    ingredients: "Single-herd pasture cow's milk, microbial rennet, sea salt.",
                    allergens: 'Contains Milk (Dairy).',
                    tastingNotes: 'Nutty, savory, buttery finish.',
                    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=800'
                  });
                  setShowProductModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Cheese / Dairy</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/70 border-b border-cream-200 text-charcoal-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Milk Source</th>
                      <th className="p-4">Aging</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {productsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-cream-50/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-cream-200" />
                          <div>
                            <p className="font-serif font-bold text-forest-950 text-sm">{prod.name}</p>
                            <p className="text-[11px] text-charcoal-500">{prod.weight}</p>
                          </div>
                        </td>
                        <td className="p-4 capitalize">{prod.categorySlug?.replace('-', ' ')}</td>
                        <td className="p-4 font-serif font-bold text-forest-950">₹{prod.price}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stock <= 10 ? 'bg-rose-100 text-rose-800' : 'bg-forest-100 text-forest-800'
                          }`}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="p-4">{prod.milkType}</td>
                        <td className="p-4">{prod.aging}</td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(prod);
                              setProductForm({
                                name: prod.name,
                                categorySlug: prod.categorySlug,
                                price: prod.price,
                                originalPrice: prod.originalPrice || prod.price,
                                weight: prod.weight,
                                milkType: prod.milkType,
                                aging: prod.aging,
                                stock: prod.stock,
                                shortDescription: prod.shortDescription,
                                description: prod.description,
                                ingredients: prod.ingredients,
                                allergens: prod.allergens,
                                tastingNotes: prod.tastingNotes,
                                image: prod.images[0]
                              });
                              setShowProductModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-700"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                            title="Archive Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Modal */}
            {showProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-cream-200 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                  <h3 className="font-serif text-xl font-bold text-forest-950">
                    {editingProduct ? 'Edit Artisan Cheese' : 'Add New Artisan Product'}
                  </h3>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Category</label>
                        <select
                          value={productForm.categorySlug}
                          onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        >
                          <option value="hard-aged">Hard & Aged Cheeses</option>
                          <option value="soft-bloomy">Soft & Bloomy Rinds</option>
                          <option value="fresh-curd">Fresh Burrata & Curds</option>
                          <option value="butter-cultured">Farmhouse Butter & Cultured Dairy</option>
                          <option value="gift-hampers">Gourmet Gift Hampers</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Stock Units *</label>
                        <input
                          type="number"
                          required
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Weight / Cut</label>
                        <input
                          type="text"
                          value={productForm.weight}
                          onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Milk Source</label>
                        <input
                          type="text"
                          value={productForm.milkType}
                          onChange={(e) => setProductForm({ ...productForm, milkType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Aging Period</label>
                        <input
                          type="text"
                          value={productForm.aging}
                          onChange={(e) => setProductForm({ ...productForm, aging: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Image URL</label>
                      <input
                        type="url"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Short Description</label>
                      <input
                        type="text"
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Full Tasting & Affinage Description</label>
                      <textarea
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-forest-900 text-cream-50 font-bold"
                      >
                        {editingProduct ? 'Update Product' : 'Publish Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowProductModal(false)}
                        className="px-5 py-3 rounded-xl bg-cream-100 text-charcoal-700 font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: COUPON MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest-950">Active Promo Codes & Discounts</h3>
                <p className="text-xs text-charcoal-500">Configure percentage or flat deductions, minimum spends, and limits.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowCouponModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couponsList.map((coup) => (
                <div key={coup.id} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-base font-bold text-forest-950 bg-butter-100 px-3 py-1 rounded-xl border border-butter-300">
                        {coup.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest-800">
                        Active
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-700 font-medium mb-3">{coup.description}</p>

                    <div className="space-y-1 text-xs text-charcoal-500 border-t border-cream-100 pt-3">
                      <p>Discount: <strong>{coup.discountType === 'percentage' ? `${coup.discountValue}%` : `₹${coup.discountValue}`}</strong></p>
                      <p>Min Spend: <strong>₹{coup.minOrderValue}</strong></p>
                      <p>Times Redeemed: <strong>{coup.timesUsed} orders</strong></p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-cream-100 flex items-center justify-between text-xs text-charcoal-400">
                    <span>Valid until: {coup.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Modal */}
            {showCouponModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cream-200 shadow-2xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-forest-950">Create Coupon Code</h3>
                  <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                        placeholder="e.g. MONSOON20"
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Description *</label>
                      <input
                        type="text"
                        required
                        value={couponForm.description}
                        onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                        placeholder="e.g. 20% off on all aged goudas"
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Type</label>
                        <select
                          value={couponForm.discountType}
                          onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Value *</label>
                        <input
                          type="number"
                          required
                          value={couponForm.discountValue}
                          onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Min Order Value (₹)</label>
                        <input
                          type="number"
                          value={couponForm.minOrderValue}
                          onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Max Discount Cap (₹)</label>
                        <input
                          type="number"
                          value={couponForm.maxDiscount}
                          onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-forest-900 text-cream-50 font-bold"
                      >
                        Activate Coupon
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCouponModal(false)}
                        className="px-4 py-2.5 rounded-xl bg-cream-100 text-charcoal-700 font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SUPPORT TICKETS DESK */}
        {activeTab === 'support' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-950">Customer Concierge Desk</h3>
              <p className="text-xs text-charcoal-500">Respond to questions regarding order routes, cold storage, and private tastings.</p>
            </div>

            <div className="space-y-4">
              {ticketsList.map((tkt) => (
                <div key={tkt.id} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded-lg border border-forest-100">
                        #{tkt.ticketNumber}
                      </span>
                      <span className="font-serif font-bold text-forest-950 text-base ml-2.5">{tkt.subject}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      tkt.status === 'resolved' ? 'bg-forest-100 text-forest-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {tkt.status}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-700 bg-cream-50 p-4 rounded-2xl border border-cream-200 leading-relaxed">
                    "{tkt.message}"
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-charcoal-500 pt-1">
                    <p>From: <strong>{tkt.customerName}</strong> ({tkt.customerEmail} • {tkt.customerPhone})</p>
                    <p>Category: <strong>{tkt.category}</strong></p>
                  </div>

                  {tkt.adminReply ? (
                    <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-100 text-xs text-forest-950">
                      <p className="font-bold text-forest-800 uppercase text-[10px]">PureHaven Concierge Reply:</p>
                      <p className="mt-0.5">{tkt.adminReply}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTicketModal(tkt);
                          setAdminReplyText('');
                        }}
                        className="px-4 py-2 rounded-xl bg-forest-900 text-cream-50 font-bold text-xs hover:bg-forest-800"
                      >
                        Reply to Customer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reply Modal */}
            {replyTicketModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-cream-200 shadow-2xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-forest-950">
                    Reply to #{replyTicketModal.ticketNumber} ({replyTicketModal.customerName})
                  </h3>
                  <textarea
                    rows={4}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Type your official fromagerie reply here..."
                    className="w-full p-3.5 rounded-2xl bg-cream-50 border border-cream-300 text-xs focus:outline-none focus:border-forest-700"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendTicketReply(replyTicketModal.id)}
                      className="flex-1 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                    >
                      Send Official Response
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyTicketModal(null)}
                      className="px-4 py-2.5 rounded-xl bg-cream-100 text-charcoal-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Official Tax Invoice & Dispatch Slip Modal */}
        <InvoiceModal
          order={invoiceOrder}
          isOpen={Boolean(invoiceOrder)}
          onClose={() => setInvoiceOrder(null)}
        />

      </div>
    </div>
  );
}
