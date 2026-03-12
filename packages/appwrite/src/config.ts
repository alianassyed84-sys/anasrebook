export const APPWRITE_DB_ID = "rebookindia-db";

export const COLLECTIONS = {
    USERS: "users",
    VENDORS: "vendors",
    BOOKS: "books",
    ORDERS: "orders",
    REVIEWS: "reviews",
    DISPUTES: "disputes",
    NOTIFICATIONS: "notifications",
    BOOKPASS_SUBSCRIPTIONS: "bookpass_subscriptions",
    DELIVERY_ZONES: "delivery_zones",
    SETTINGS: "settings",
    ADMIN_AUDIT_LOG: "admin_audit_log"
} as const;

export const BUCKETS = {
    BOOK_IMAGES: "book-images",
    VENDOR_KYC_DOCS: "vendor-kyc-docs",
    PROFILE_PHOTOS: "profile-photos"
} as const;
