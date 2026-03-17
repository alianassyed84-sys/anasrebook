// ==========================================
// RebookIndia Shared TypeScript Models
// Synced exactly with Firebase Firestore Schema
// ==========================================

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role?: "customer" | "vendor" | "admin" | "superAdmin";
  city?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isBookPass?: boolean;
  bookPassExpiry?: string; // ISO DateTime
  totalOrders?: number;
  createdAt: string; // ISO DateTime
}

export type VendorStatus = "pending" | "approved" | "suspended";
export type SubscriptionPlan = "free" | "silver" | "gold";

export interface Vendor {
  vendorId: string;
  userId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  shopPhotoId: string;
  aadhaarDocId: string;
  bankAccountNo: string;
  bankIFSC: string;
  bankName: string;
  status?: VendorStatus;
  subscriptionPlan?: SubscriptionPlan;
  commissionRate?: number;
  totalEarnings?: number;
  pendingPayout?: number;
  rating?: number;
  totalReviews?: number;
  totalSales?: number;
  isFreeCommission?: boolean;
  freeCommissionExpiry?: string; // ISO DateTime
  deliveryRadius?: number;
  createdAt: string; // ISO DateTime
}

export type BookCategory = "school" | "college" | "neet" | "upsc" | "novel" | "other";
export type BookCondition = "like_new" | "good" | "fair" | "acceptable";

export type BookStatus = "active" | "pending" | "sold_out" | "discontinued";

export interface Book {
  bookId: string;
  vendorId: string;
  title: string;
  author: string;
  publisher?: string;
  edition?: string;
  category: BookCategory;
  subject?: string;
  classGrade?: string;
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  condition: BookCondition;
  conditionNotes?: string;
  imageIds: string[];
  status?: BookStatus;
  isbn?: string;
  coverUrl?: string;
  quantity?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isSponsored?: boolean;
  totalSold?: number;
  createdAt: string; // ISO DateTime
  updatedAt: string; // ISO DateTime
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "placed" | "packed" | "picked_up" | "in_transit" | "delivered" | "cancelled" | "returned";

export interface Order {
  orderId: string;
  userId: string;
  vendorId: string;
  bookId: string;
  bookTitle: string;
  bookImageId: string;
  quantity: number;
  bookPrice: number;
  vendorPincode: string;
  buyerPincode: string;
  distanceKm: number;
  deliveryZone: string;
  deliveryCharge: number;
  logisticsCost: number;
  deliveryMargin: number;
  handlingFee?: number;
  isBookPassOrder?: boolean;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  vendorPayout: number;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus?: OrderStatus;
  shiprocketOrderId?: string;
  trackingId?: string;
  trackingUrl?: string;
  isPayoutReleased?: boolean;
  payoutReleasedAt?: string; // ISO DateTime
  deliveredAt?: string; // ISO DateTime
  createdAt: string; // ISO DateTime
  updatedAt: string; // ISO DateTime
}

export interface Review {
  reviewId: string;
  orderId: string;
  userId: string;
  vendorId: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: string; // ISO DateTime
}

export type DisputeReason = "wrong_book" | "condition_mismatch" | "not_delivered" | "damaged";
export type DisputeStatus = "open" | "under_review" | "resolved_refund" | "resolved_no_refund";

export interface Dispute {
  disputeId: string;
  orderId: string;
  userId: string;
  vendorId: string;
  reason: DisputeReason;
  description: string;
  evidenceImageIds?: string[];
  status?: DisputeStatus;
  adminNotes?: string;
  resolvedAt?: string; // ISO DateTime
  createdAt: string; // ISO DateTime
}

export type NotificationRecipientType = "buyer" | "vendor" | "admin";
export type NotificationType = "new_order" | "order_packed" | "order_delivered" | "payout_sent" | "dispute_opened" | "vendor_approved";

export interface Notification {
  notificationId: string;
  recipientId: string;
  recipientType: NotificationRecipientType;
  type: NotificationType;
  title: string;
  message: string;
  isRead?: boolean;
  createdAt: string; // ISO DateTime
}

export interface BookpassSubscription {
  subscriptionId: string;
  userId: string;
  startDate: string; // ISO DateTime
  endDate: string; // ISO DateTime
  amountPaid: number; // usually 149.00
  razorpayPaymentId: string;
  isActive?: boolean;
  ordersThisMonth?: number;
  deliverySavedAmount?: number;
  handlingFeesCollected?: number;
}

export interface DeliveryZone {
  zoneId: string;
  zoneName: string;
  minKm: number;
  maxKm: number;
  buyerCharge: number;
  logisticsCost: number;
  yourMargin: number;
  isActive?: boolean;
}
