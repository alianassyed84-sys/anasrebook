import { Client, Users, Databases, Storage, ID } from "node-appwrite";
import * as dotenv from "dotenv";
import {
  DEMO_USERS,
  VENDORS,
  BOOKS,
  ORDERS,
  REVIEWS,
  NOTIFICATIONS,
  DELIVERY_ZONES,
  BOOKPASS_SUBSCRIPTIONS
} from "./data";

dotenv.config();

const {
  APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
} = process.env;

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error("Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY. Please set them in .env.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const users = new Users(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = "rebookindia-db";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for Collection Setup
const setupCollection = async (
  collectionId: string,
  name: string,
  attributes: { 
    key: string; 
    type: "string" | "email" | "integer" | "float" | "boolean" | "datetime" | "enum" | "string[]"; 
    required: boolean;
    size?: number;
    default?: any;
    elements?: string[];
  }[]
) => {
  try {
    await databases.createCollection(DB_ID, collectionId, name);
    console.log(`  ✅ Created collection: ${name}`);
    
    for (const attr of attributes) {
      try {
        switch(attr.type) {
          case "string":
            // Appwrite createStringAttribute(databaseId, collectionId, key, size, required, default, array, encrypt)
            await databases.createStringAttribute(DB_ID, collectionId, attr.key, attr.size || 255, attr.required, attr.default, false);
            break;
          case "string[]":
            await databases.createStringAttribute(DB_ID, collectionId, attr.key, attr.size || 255, attr.required, attr.default, true);
            break;
          case "email":
            await databases.createEmailAttribute(DB_ID, collectionId, attr.key, attr.required, attr.default, false);
            break;
          case "integer":
            // Note: max and min undefined
            await databases.createIntegerAttribute(DB_ID, collectionId, attr.key, attr.required, undefined, undefined, attr.default, false);
            break;
          case "float":
            await databases.createFloatAttribute(DB_ID, collectionId, attr.key, attr.required, undefined, undefined, attr.default, false);
            break;
          case "boolean":
            await databases.createBooleanAttribute(DB_ID, collectionId, attr.key, attr.required, attr.default, false);
            break;
          case "datetime":
            await databases.createDatetimeAttribute(DB_ID, collectionId, attr.key, attr.required, attr.default, false);
            break;
          case "enum":
            if (!attr.elements) throw new Error(`Enum elements required for ${attr.key}`);
            await databases.createEnumAttribute(DB_ID, collectionId, attr.key, attr.elements, attr.required, attr.default, false);
            break;
        }
      } catch (e: any) {
        if (e.code !== 409) { // Ignore 409 conflict if attribute already exists
          console.error(`  ❌ Failed to create attribute ${attr.key} in ${name}:`, e.message);
        }
      }
    }
    console.log(`  ✅ Synced attributes for ${name}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️ Collection ${name} exists.`);
    } else {
      console.error(`  ❌ Error setting up ${name}:`, error.message);
    }
  }
};

const setupBucket = async (bucketId: string, name: string, maxSizeMB: number, extensions: string[]) => {
  try {
     const maxSizeBytes = maxSizeMB * 1024 * 1024;
     // Note: leaving permissions blank defaults to project policies, ensuring Appwrite UI is source of truth for Roles
     await storage.createBucket(
       bucketId, 
       name, 
       undefined, // permissions
       false, // fileSecurity
       true, // enabled
       maxSizeBytes, 
       extensions, 
       undefined, // compression
       false, // encryption
       false // antivirus
     );
     console.log(`  ✅ Created storage bucket: ${name} (${maxSizeMB}MB max)`);
  } catch (error: any) {
     if (error.code === 409) {
        console.log(`  ℹ️ Storage bucket ${name} exists.`);
     } else {
        console.error(`  ❌ Failed creating bucket ${name}:`, error.message);
     }
  }
};


async function seed() {
  console.log("🌱 Starting RebookIndia NextGen Seed Script...\n");

  // --- USERS IN AUTH ---
  console.log("👤 Creating Demo Users in Auth...");
  for (const user of DEMO_USERS) {
    try {
      await users.create(user.userId, user.email, user.phone, user.password, user.name);
      console.log(`  ✅ Created auth user: ${user.name}`);
    } catch (error: any) {
      if (error.code === 409) console.log(`  ℹ️ Auth user ${user.email} already exists.`);
      else console.error(`  ❌ Failed to create user ${user.email}:`, error.message);
    }
  }

  // --- DATABASE INITIALIZATION ---
  console.log("\n📦 Setting up Database...");
  try {
    await databases.create(DB_ID, "RebookIndia Database");
    console.log(`  ✅ Created database: ${DB_ID}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️ Database ${DB_ID} already exists.`);
    } else {
      console.warn(`  ⚠️ Potential limit or error on database creation: ${error.message}. Continuing...`);
    }
  }

  // --- COLLECTIONS & ATTRIBUTES ---
  console.log("\n🏗️ Defining Schema Collections...");

  await setupCollection("users", "Users", [
    { key: "name", type: "string", required: true },
    { key: "email", type: "email", required: true },
    { key: "phone", type: "string", required: true },
    { key: "city", type: "string", required: false },
    { key: "pincode", type: "string", required: false },
    { key: "latitude", type: "float", required: false },
    { key: "longitude", type: "float", required: false },
    { key: "isBookPass", type: "boolean", required: false, default: false },
    { key: "bookPassExpiry", type: "datetime", required: false },
    { key: "totalOrders", type: "integer", required: false, default: 0 },
    { key: "createdAt", type: "datetime", required: true },
  ]);

  await setupCollection("vendors", "Vendors", [
    { key: "userId", type: "string", required: true },
    { key: "shopName", type: "string", required: true },
    { key: "ownerName", type: "string", required: true },
    { key: "phone", type: "string", required: true },
    { key: "email", type: "email", required: true },
    { key: "address", type: "string", size: 500, required: true },
    { key: "city", type: "string", required: true },
    { key: "state", type: "string", required: true },
    { key: "pincode", type: "string", required: true },
    { key: "latitude", type: "float", required: true },
    { key: "longitude", type: "float", required: true },
    { key: "shopPhotoId", type: "string", required: true },
    { key: "aadhaarDocId", type: "string", required: true },
    { key: "bankAccountNo", type: "string", required: true },
    { key: "bankIFSC", type: "string", required: true },
    { key: "bankName", type: "string", required: true },
    { key: "status", type: "enum", elements: ["pending", "approved", "suspended"], required: false, default: "pending" },
    { key: "subscriptionPlan", type: "enum", elements: ["free", "silver", "gold"], required: false, default: "free" },
    { key: "commissionRate", type: "float", required: false, default: 15.0 },
    { key: "totalEarnings", type: "float", required: false, default: 0.0 },
    { key: "pendingPayout", type: "float", required: false, default: 0.0 },
    { key: "rating", type: "float", required: false, default: 0.0 },
    { key: "totalReviews", type: "integer", required: false, default: 0 },
    { key: "totalSales", type: "integer", required: false, default: 0 },
    { key: "isFreeCommission", type: "boolean", required: false, default: true },
    { key: "freeCommissionExpiry", type: "datetime", required: false },
    { key: "deliveryRadius", type: "integer", required: false, default: 500 },
    { key: "createdAt", type: "datetime", required: true },
  ]);

  await setupCollection("books", "Books", [
    { key: "vendorId", type: "string", required: true },
    { key: "title", type: "string", required: true },
    { key: "author", type: "string", required: true },
    { key: "isbn", type: "string", size: 20, required: false },
    { key: "coverUrl", type: "string", size: 500, required: false },
    { key: "publisher", type: "string", required: false },
    { key: "edition", type: "string", required: false },
    { key: "category", type: "enum", elements: ["school", "college", "neet", "upsc", "novel", "other"], required: true },
    { key: "subject", type: "string", required: false },
    { key: "classGrade", type: "string", required: false },
    { key: "mrp", type: "float", required: true },
    { key: "sellingPrice", type: "float", required: true },
    { key: "discountPercent", type: "float", required: true },
    { key: "condition", type: "enum", elements: ["like_new", "good", "fair", "acceptable"], required: true },
    { key: "conditionNotes", type: "string", size: 1000, required: false },
    { key: "imageIds", type: "string[]", size: 1000, required: true },
    { key: "quantity", type: "integer", required: false, default: 1 },
    { key: "isAvailable", type: "boolean", required: false, default: true },
    { key: "isFeatured", type: "boolean", required: false, default: false },
    { key: "isSponsored", type: "boolean", required: false, default: false },
    { key: "totalSold", type: "integer", required: false, default: 0 },
    { key: "createdAt", type: "datetime", required: true },
    { key: "updatedAt", type: "datetime", required: true },
  ]);

  await setupCollection("orders", "Orders", [
    { key: "userId", type: "string", required: true },
    { key: "vendorId", type: "string", required: true },
    { key: "bookId", type: "string", required: true },
    { key: "bookTitle", type: "string", required: true },
    { key: "bookImageId", type: "string", required: true },
    { key: "quantity", type: "integer", required: true },
    { key: "bookPrice", type: "float", required: true },
    { key: "vendorPincode", type: "string", required: true },
    { key: "buyerPincode", type: "string", required: true },
    { key: "distanceKm", type: "float", required: true },
    { key: "deliveryZone", type: "string", required: true },
    { key: "deliveryCharge", type: "float", required: true },
    { key: "logisticsCost", type: "float", required: true },
    { key: "deliveryMargin", type: "float", required: true },
    { key: "handlingFee", type: "float", required: false, default: 0.0 },
    { key: "isBookPassOrder", type: "boolean", required: false, default: false },
    { key: "totalAmount", type: "float", required: true },
    { key: "commissionRate", type: "float", required: true },
    { key: "commissionAmount", type: "float", required: true },
    { key: "vendorPayout", type: "float", required: true },
    { key: "buyerName", type: "string", required: true },
    { key: "buyerPhone", type: "string", required: true },
    { key: "deliveryAddress", type: "string", size: 500, required: true },
    { key: "deliveryCity", type: "string", required: true },
    { key: "deliveryPincode", type: "string", required: true },
    { key: "paymentMethod", type: "enum", elements: ["upi", "card", "netbanking", "cod"], required: false },
    { key: "paymentStatus", type: "enum", elements: ["pending", "paid", "failed", "refunded"], required: false },
    { key: "razorpayOrderId", type: "string", required: false },
    { key: "razorpayPaymentId", type: "string", required: false },
    { key: "orderStatus", type: "enum", elements: ["placed", "packed", "picked_up", "in_transit", "delivered", "cancelled", "returned"], required: false },
    { key: "shiprocketOrderId", type: "string", required: false },
    { key: "trackingId", type: "string", required: false },
    { key: "trackingUrl", type: "string", size: 1000, required: false },
    { key: "isPayoutReleased", type: "boolean", required: false, default: false },
    { key: "payoutReleasedAt", type: "datetime", required: false },
    { key: "deliveredAt", type: "datetime", required: false },
    { key: "createdAt", type: "datetime", required: true },
    { key: "updatedAt", type: "datetime", required: true },
  ]);

  await setupCollection("reviews", "Reviews", [
    { key: "orderId", type: "string", required: true },
    { key: "userId", type: "string", required: true },
    { key: "vendorId", type: "string", required: true },
    { key: "rating", type: "integer", required: true },
    { key: "comment", type: "string", size: 1000, required: false },
    { key: "createdAt", type: "datetime", required: true },
  ]);

  await setupCollection("disputes", "Disputes", [
    { key: "orderId", type: "string", required: true },
    { key: "userId", type: "string", required: true },
    { key: "vendorId", type: "string", required: true },
    { key: "reason", type: "enum", elements: ["wrong_book", "condition_mismatch", "not_delivered", "damaged"], required: true },
    { key: "description", type: "string", size: 2000, required: true },
    { key: "evidenceImageIds", type: "string[]", size: 1000, required: false },
    { key: "status", type: "enum", elements: ["open", "under_review", "resolved_refund", "resolved_no_refund"], required: false },
    { key: "adminNotes", type: "string", size: 2000, required: false },
    { key: "resolvedAt", type: "datetime", required: false },
    { key: "createdAt", type: "datetime", required: true },
  ]);

  await setupCollection("notifications", "Notifications", [
    { key: "recipientId", type: "string", required: true },
    { key: "recipientType", type: "enum", elements: ["buyer", "vendor", "admin"], required: true },
    { key: "type", type: "enum", elements: ["new_order", "order_packed", "order_delivered", "payout_sent", "dispute_opened", "vendor_approved"], required: true },
    { key: "title", type: "string", required: true },
    { key: "message", type: "string", size: 1000, required: true },
    { key: "isRead", type: "boolean", required: false, default: false },
    { key: "createdAt", type: "datetime", required: true },
  ]);

  await setupCollection("bookpass_subscriptions", "BookpassSubscriptions", [
    { key: "userId", type: "string", required: true },
    { key: "startDate", type: "datetime", required: true },
    { key: "endDate", type: "datetime", required: true },
    { key: "amountPaid", type: "float", required: true },
    { key: "razorpayPaymentId", type: "string", required: true },
    { key: "isActive", type: "boolean", required: false, default: true },
    { key: "ordersThisMonth", type: "integer", required: false, default: 0 },
    { key: "deliverySavedAmount", type: "float", required: false, default: 0.0 },
    { key: "handlingFeesCollected", type: "float", required: false, default: 0.0 },
  ]);

  await setupCollection("delivery_zones", "DeliveryZones", [
    { key: "zoneName", type: "string", required: true },
    { key: "minKm", type: "float", required: true },
    { key: "maxKm", type: "float", required: true },
    { key: "buyerCharge", type: "float", required: true },
    { key: "logisticsCost", type: "float", required: true },
    { key: "yourMargin", type: "float", required: true },
    { key: "isActive", type: "boolean", required: false, default: true },
  ]);

  // --- STORAGE BUCKETS ---
  console.log("\n🪣 Setting up Storage Buckets...");
  await setupBucket("book-images", "Book Images", 5, ["jpg", "jpeg", "png", "webp"]);
  await setupBucket("vendor-kyc-docs", "Vendor KYC Documents", 10, ["jpg", "jpeg", "png", "pdf"]);
  await setupBucket("profile-photos", "Profile Photos", 2, ["jpg", "jpeg", "png", "webp"]);

  console.log("\n⏳ Waiting 5 seconds for Appwrite to provision attributes...");
  await delay(5000);

  // --- INSERT PRE-FILL MOCK DATA ---
  const insertDocument = async (colId: string, docId: string, data: any) => {
    try {
      await databases.createDocument(DB_ID, colId, docId, data);
      console.log(`  ✅ Inserted ${colId}: ${docId}`);
    } catch (e: any) {
      if(e.code === 409) {
        console.log(`  ℹ️ Document ${docId} exists.`);
      } else {
        console.error(`  ❌ Error inserting ${docId} in ${colId}:`);
        console.error(JSON.stringify(e, null, 2));
      }
    }
  }

  console.log("\n📄 Inserting Initial Schema Data...");
  
  for (const d of DELIVERY_ZONES) {
    const { zoneId, ...data } = d;
    await insertDocument("delivery_zones", zoneId, data);
  }
  for (const u of DEMO_USERS) {
    const { userId, password, ...data } = u; // drop password for insert
    await insertDocument("users", userId, data);
  }
  for (const v of VENDORS) {
    const { vendorId, ...data } = v;
    await insertDocument("vendors", vendorId, data);
  }
  for (const b of BOOKS) {
    const { bookId, ...data } = b;
    await insertDocument("books", bookId, data);
  }
  for (const o of ORDERS) {
    const { orderId, ...data } = o;
    await insertDocument("orders", orderId, data);
  }
  for (const r of REVIEWS) {
    const { reviewId, ...data } = r;
    await insertDocument("reviews", reviewId, data);
  }
  for (const n of NOTIFICATIONS) {
    const { notificationId, ...data } = n;
    await insertDocument("notifications", notificationId, data);
  }
  for (const sub of BOOKPASS_SUBSCRIPTIONS) {
    const { subscriptionId, ...data } = sub as any;
    await insertDocument("bookpass_subscriptions", subscriptionId, data);
  }

  console.log("\n🎉 NextGen Schema Seeding complete!");
}

seed().catch(console.error);
