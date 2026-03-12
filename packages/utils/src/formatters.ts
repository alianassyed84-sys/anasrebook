export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('₹', 'Rs. ');
}

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDistance(km: number): string {
  if (km < 1) return '< 1 km';
  return `${Math.round(km)} km`;
}

export function getDiscountPercent(mrp: number, sellingPrice: number): string {
  if (mrp <= sellingPrice || mrp <= 0) return '';
  const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
  return `${discount}% OFF`;
}

export function getOrderStatusLabel(status: string): string {
  const mapped: Record<string, string> = {
    'placed': 'Order Placed 📦',
    'packed': 'Packed & Ready ✅',
    'picked_up': 'Picked Up 🚚',
    'in_transit': 'In Transit 🚚',
    'delivered': 'Delivered 🎉',
    'cancelled': 'Cancelled ❌',
    'returned': 'Returned 🔄',
  };
  return mapped[status] || status;
}

export function getConditionLabel(cond: string): string {
  const mapped: Record<string, string> = {
    'like_new': 'Like New ✨',
    'good': 'Good Condition ✅',
    'fair': 'Fair Condition 📖',
    'acceptable': 'Acceptable 낡',
  };
  return mapped[cond] || cond;
}

export function getConditionColor(cond: string): string {
  const mapped: Record<string, string> = {
    'like_new': 'bg-success text-white',
    'good': 'bg-secondary text-white',
    'fair': 'bg-yellow-500 text-white',
    'acceptable': 'bg-red-500 text-white',
  };
  return mapped[cond] || 'bg-gray-500 text-white';
}
