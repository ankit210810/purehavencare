import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  LogOut, 
  Plus, 
  Trash2, 
  Truck, 
  ShieldCheck, 
  Phone, 
  Mail,
  Edit2,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { localDb } from '../services/supabaseClient';
import { fetchAllOrders } from '../services/orderService';
import InvoiceModal from '../components/common/InvoiceModal';

export default function ProfilePage({ navigate, onQuickView, initialTab = 'orders' }) {
  const { user, logout, isAdmin, addAddress, deleteAddress, updateProfile } = useAuth();
  const { wishlist, moveToCart } = useWishlist();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState(initialTab); // 'orders' | 'addresses' | 'wishlist' | 'settings'
  const [userOrders, setUserOrders] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // New Address form
  const [newAddr, setNewAddr] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '9142166210',
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038'
  });

  // Profile Edit form
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '9142166210');

  useEffect(() => {
    // Load orders from Supabase & local
    async function loadOrders() {
      const all = await fetchAllOrders();
      if (user?.email) {
        // Show orders matching this user's email or ID
        const matching = all.filter(
          (o) => o.customerEmail?.toLowerCase() === user.email.toLowerCase() || o.userId === user.id
        );
        setUserOrders(matching.length > 0 ? matching : all);
      } else {
        setUserOrders(all);
      }
    }
    loadOrders();
  }, [user]);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.pincode) {
      addToast('Please enter complete address details', 'error');
      return;
    }
    addAddress(newAddr);
    addToast('New delivery address saved!', 'success');
    setShowAddressModal(false);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({ fullName: editName, phone: editPhone });
    addToast('Profile updated successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-cream-50/60 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Greeting Header */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-forest-900 border-2 border-butter-400 overflow-hidden flex items-center justify-center text-cream-50 flex-shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-butter-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-forest-950">
                  {user?.fullName || 'PureHaven Connoisseur'}
                </h1>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-forest-100 text-forest-800'
                }`}>
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">{user?.email}</p>
              <p className="text-xs text-charcoal-500">Phone: {user?.phone || '9142166210'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-forest-950 text-xs font-bold transition-colors shadow-sm"
              >
                Go to Admin Dashboard
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('home');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-rose-50 text-charcoal-700 hover:text-rose-700 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex rounded-2xl bg-white border border-cream-200 p-1.5 shadow-xs overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'addresses'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user?.addresses?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-cream-200">
                <p className="font-serif text-lg font-bold text-forest-950 mb-1">No Orders Placed Yet</p>
                <p className="text-xs text-charcoal-500 mb-6">Your order receipts and cold-chain tracking will appear here.</p>
                <button
                  type="button"
                  onClick={() => navigate('shop')}
                  className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                >
                  Start Artisan Tasting
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-lg font-bold text-forest-950">{ord.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-forest-100 text-forest-800">
                        {ord.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500">Placed on {new Date(ord.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-charcoal-700 mt-2 font-medium">
                      {ord.items?.map(i => `${i.name} (${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                    <span className="font-serif text-xl font-bold text-forest-950">₹{ord.total}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(ord)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cream-300 hover:bg-cream-100 text-charcoal-700 text-xs font-semibold transition-colors"
                        title="View & Print Official GST Tax Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-forest-800" />
                        <span>Invoice</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate('track', { orderNumber: ord.orderNumber })}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5 text-butter-400" />
                        <span>Track</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-forest-950">Delivery Destinations</h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.addresses?.map((addr) => (
                <div key={addr.id} className="bg-white p-5 rounded-3xl border border-cream-200 shadow-soft relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-forest-950">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-xs text-charcoal-600 leading-relaxed">{addr.addressLine2}</p>}
                    <p className="text-xs text-charcoal-700 font-medium mt-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs text-charcoal-500 mt-2">Phone: {addr.phone}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-cream-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-cream-200 shadow-2xl space-y-4">
                  <h3 className="font-serif text-lg font-bold text-forest-950">Add Cold-Chain Delivery Address</h3>
                  <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddr.addressLine1}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-forest-900 text-cream-50 font-bold"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
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

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-cream-200">
                <p className="font-serif text-lg font-bold text-forest-950 mb-1">Your Wishlist is Empty</p>
                <p className="text-xs text-charcoal-500 mb-6">Heart any cheese to save it for your next gathering.</p>
                <button
                  type="button"
                  onClick={() => navigate('shop')}
                  className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold"
                >
                  Explore Cheeses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border border-cream-200 shadow-soft space-y-3">
                    <img src={item.images[0]} alt="" className="w-full aspect-[4/3] rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-serif font-bold text-forest-950 text-sm truncate">{item.name}</h4>
                      <p className="font-serif font-bold text-forest-900 text-sm mt-1">₹{item.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => moveToCart(item)}
                      className="w-full py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Account Details */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft max-w-xl">
            <h3 className="font-serif text-lg font-bold text-forest-950 mb-4">Edit Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Primary Phone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-300 opacity-70"
                />
                <p className="text-[11px] text-charcoal-400 mt-1">Contact concierge to change verified email.</p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-forest-900 text-cream-50 font-bold hover:bg-forest-800"
              >
                Save Changes
              </button>
            </form>
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
