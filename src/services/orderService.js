import { supabase, isSupabaseConfigured, localDb } from './supabaseClient';

function isValidUUID(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Save new order to Supabase and Local Database
 */
export async function saveOrder(orderData) {
  let savedToSupabase = false;

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        order_number: orderData.orderNumber,
        user_id: isValidUUID(orderData.userId) ? orderData.userId : null,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        status: orderData.status || 'confirmed',
        payment_status: orderData.paymentStatus || 'paid',
        payment_method: orderData.paymentMethod || 'razorpay',
        payment_id: orderData.paymentId,
        subtotal: Number(orderData.subtotal),
        discount: Number(orderData.discount || 0),
        coupon_code: orderData.couponCode || null,
        shipping_fee: Number(orderData.shippingFee || 0),
        cold_chain_fee: Number(orderData.coldChainFee || 0),
        tax_amount: Number(orderData.taxAmount || 0),
        total: Number(orderData.total),
        delivery_address: orderData.deliveryAddress,
        tracking_number: orderData.trackingNumber,
        courier_name: orderData.courierName || 'PureHaven ColdChain Express',
        estimated_delivery: orderData.estimatedDelivery || '24–36 Hours'
      };

      // Try inserting with items column
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([{ ...payload, items: orderData.items || [] }])
          .select()
          .single();

        if (!error && data) {
          savedToSupabase = true;
        } else if (error) {
          throw error;
        }
      } catch (insertWithItemsErr) {
        // Fallback without items column if table schema does not have items JSONB yet
        const { data, error } = await supabase
          .from('orders')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          savedToSupabase = true;

          // Insert line items into order_items table
          if (orderData.items && orderData.items.length > 0) {
            try {
              const itemRows = orderData.items.map((item) => ({
                order_id: data.id,
                product_name: item.name,
                product_image: item.image,
                weight: item.weight,
                unit_price: item.price,
                quantity: item.quantity,
                total_price: item.total || item.price * item.quantity
              }));
              await supabase.from('order_items').insert(itemRows);
            } catch (itemErr) {
              console.warn('order_items insert note:', itemErr);
            }
          }
        } else {
          console.warn('Supabase order insert note:', error);
        }
      }
    } catch (err) {
      console.warn('Supabase saveOrder error:', err);
    }
  }

  // Always save to persistent local storage for instantaneous client performance
  localDb.insert('orders', orderData);

  return { success: true, savedToSupabase };
}

/**
 * Fetch all orders (Queries Supabase first, merges with local)
 */
export async function fetchAllOrders() {
  let combinedOrders = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: supaOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && supaOrders && supaOrders.length > 0) {
        // Map Supabase columns to camelCase format
        combinedOrders = supaOrders.map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          userId: o.user_id,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          status: o.status,
          paymentStatus: o.payment_status,
          paymentMethod: o.payment_method,
          paymentId: o.payment_id,
          subtotal: Number(o.subtotal),
          discount: Number(o.discount || 0),
          couponCode: o.coupon_code,
          shippingFee: Number(o.shipping_fee || 0),
          coldChainFee: Number(o.cold_chain_fee || 0),
          taxAmount: Number(o.tax_amount || 0),
          total: Number(o.total),
          deliveryAddress: o.delivery_address,
          trackingNumber: o.tracking_number,
          courierName: o.courier_name,
          estimatedDelivery: o.estimated_delivery,
          createdAt: o.created_at,
          items: o.items || []
        }));
      }
    } catch (err) {
      console.warn('Error fetching orders from Supabase:', err);
    }
  }

  // Merge with any local orders not yet in Supabase list
  const localList = localDb.get('orders', []);
  localList.forEach((localOrd) => {
    const exists = combinedOrders.some(
      (o) => o.orderNumber === localOrd.orderNumber || o.id === localOrd.id
    );
    if (!exists) {
      combinedOrders.push(localOrd);
    }
  });

  // Sort by date descending
  combinedOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Sync to localDb
  if (combinedOrders.length > 0) {
    localDb.set('orders', combinedOrders);
  }

  return combinedOrders;
}

/**
 * Update order status across Supabase and Local
 */
export async function updateOrderStatus(orderId, orderNumber, newStatus) {
  if (isSupabaseConfigured && supabase) {
    try {
      if (isValidUUID(orderId)) {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      } else if (orderNumber) {
        await supabase.from('orders').update({ status: newStatus }).eq('order_number', orderNumber);
      }
    } catch (err) {
      console.warn('Error updating status in Supabase:', err);
    }
  }

  localDb.update('orders', orderId, { status: newStatus });
  return true;
}
