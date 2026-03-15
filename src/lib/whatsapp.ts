/**
 * WhatsApp checkout URL utilities.
 * Formats order details and generates a wa.me deep link.
 */

export interface CustomerDetails {
  name: string;
  deliveryAddress: string;
  phoneNumber: string;
}

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  brand: string | null;
}

export interface OrderSummary {
  items: CartItem[];
  customer: CustomerDetails;
  totalPrice: number;
}

/**
 * Formats the order into a human-readable WhatsApp message.
 */
export function formatOrderMessage(order: OrderSummary): string {
  const lines: string[] = [
    "🛒 *طلب جديد | New Order*",
    "─────────────────",
    "",
    "📦 *المنتجات | Products:*",
  ];

  for (const item of order.items) {
    lines.push(
      `• ${item.name}${item.brand ? ` (${item.brand})` : ""} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`
    );
  }

  lines.push(
    "",
    `💰 *الإجمالي | Total:* ${formatCurrency(order.totalPrice)}`,
    "",
    "─────────────────",
    "👤 *بيانات العميل | Customer Details:*",
    `• الاسم | Name: ${order.customer.name}`,
    `• الهاتف | Phone: ${order.customer.phoneNumber}`,
    `• العنوان | Address: ${order.customer.deliveryAddress}`,
    "",
    "─────────────────",
    "_تم إرسال الطلب من موقع ItalياOils_"
  );

  return lines.join("\n");
}

/**
 * Generates a wa.me deep link with the formatted order message.
 */
export function buildWhatsAppUrl(
  items: Array<{ id: string; name: string; price: number; quantity: number; imageUrl?: string | null }>,
  form: { name: string; phone: string; address: string }
): string {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000";
  const order: OrderSummary = {
    items: items.map((item) => ({
      sku: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      brand: null,
    })),
    customer: {
      name: form.name,
      phoneNumber: form.phone,
      deliveryAddress: form.address || "لم يُحدد",
    },
    totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
  };
  const message = formatOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Formats a price as EGP currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Alias for formatCurrency — returns clean number string */
export function formatPrice(amount: number): string {
  return amount.toLocaleString("ar-EG", { maximumFractionDigits: 2 });
}

/**
 * Validates customer checkout details.
 * Returns an object with field-level errors (empty = valid).
 */
/** Validates the simplified checkout form (name, phone, address) */
export function validateCheckoutDetails(
  form: { name: string; phone: string; address: string }
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!form.name || form.name.trim().length < 2) {
    errors.name = "الاسم مطلوب ويجب أن يكون حرفين على الأقل.";
  }

  const phoneRegex = /^[\d\s+\-()]{7,16}$/;
  if (!form.phone || !phoneRegex.test(form.phone.trim())) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
