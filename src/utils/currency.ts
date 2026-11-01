import { Order } from '../types';

export const DEFAULT_OWNER_WHATSAPP = '9360723382';

/**
 * Normalizes an Indian or international phone number for the WhatsApp wa.me API.
 * If 10 digits provided (e.g. 9360723382), automatically prepends Indian country code '91' -> 919360723382.
 */
export function normalizeWhatsAppNumber(phone: string = DEFAULT_OWNER_WHATSAPP): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (!digits) return '919360723382';
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

/**
 * Format 10 or 12 digit phone into clean Indian display format: +91 93607 23382
 */
export function formatIndianPhoneNumber(phone: string = DEFAULT_OWNER_WHATSAPP): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  const tenDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (tenDigits.length === 10) {
    return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
  }
  return phone;
}

/**
 * Format numbers into Indian Rupee format (e.g. ₹24,999)
 */
export function formatRupees(amount: number | undefined | null, showDecimals = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return `₹${Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}

/**
 * Generate WhatsApp message URL for sending complete order summary to store owner
 */
export function getWhatsAppOrderUrl(order: Order, ownerPhone: string = DEFAULT_OWNER_WHATSAPP): string {
  const cleanPhone = normalizeWhatsAppNumber(ownerPhone);
  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) — ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  const message = `🛍️ *NEW ORDER RECEIVED — AURA E-COMMERCE* 🛍️
━━━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.orderNumber}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

👤 *Customer Details:*
• *Name:* ${order.customerName}
• *Phone:* ${order.shippingAddress.phone || 'N/A'}
• *Email:* ${order.customerEmail}

📍 *Shipping Address:*
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}
${order.shippingAddress.country}

🛒 *Ordered Items:*
${itemsList}

💰 *Payment & Billing Summary:*
• Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
${order.discount > 0 ? `• Coupon Discount: -₹${order.discount.toLocaleString('en-IN')} (${order.appliedCoupon || ''})\n` : ''}• Shipping: ${order.shipping === 0 ? 'FREE' : '₹' + order.shipping.toLocaleString('en-IN')}
• GST / Tax: ₹${order.tax.toLocaleString('en-IN')}
• *Grand Total: ₹${order.total.toLocaleString('en-IN')}*

💳 *Payment Mode:* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})
🚚 *Carrier:* ${order.carrier}
⏱️ *Est. Delivery:* ${order.estimatedDelivery}
━━━━━━━━━━━━━━━━━━━━━━
_Automated Order Notification for Store Owner (AURA System)_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp inquiry URL for a specific product
 */
export function getWhatsAppProductInquiryUrl(
  productName: string,
  productPrice: number,
  ownerPhone: string = DEFAULT_OWNER_WHATSAPP
): string {
  const cleanPhone = normalizeWhatsAppNumber(ownerPhone);
  const message = `Hello! 👋\nI am interested in buying *${productName}* (Price: ₹${productPrice.toLocaleString('en-IN')}) from AURA Store.\nIs this product currently in stock and available for delivery?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp test ping URL to verify owner connectivity
 */
export function getWhatsAppTestUrl(ownerPhone: string = DEFAULT_OWNER_WHATSAPP): string {
  const cleanPhone = normalizeWhatsAppNumber(ownerPhone);
  const message = `🔔 *AURA E-Commerce — WhatsApp Integration Test*\n━━━━━━━━━━━━━━━━━━━━━━\nStore Owner WhatsApp alerts are properly configured for phone number: *${ownerPhone}*.\nYou will receive immediate real-time notifications here whenever a customer places an order!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

