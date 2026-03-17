export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "rebookmj-d52b4";
export const DB_ID = FIREBASE_PROJECT_ID;

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
    PROMOTIONS: "promotions"
} as const;

export const BUCKETS = {
    BOOK_IMAGES: "book-images",
    VENDOR_KYC_DOCS: "vendor-kyc-docs",
    PROFILE_PHOTOS: "profile-photos"
} as const;
