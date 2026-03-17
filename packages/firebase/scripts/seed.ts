import admin from "firebase-admin";
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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function seed() {
  console.log("🌱 Starting RebookIndia Firebase Seed Script...\n");

  // --- USERS ---
  console.log("👤 Creating Users...");
  for (const user of DEMO_USERS) {
    try {
      // Create in Auth
      try {
        await auth.createUser({
          uid: user.userId,
          email: user.email,
          password: user.password,
          displayName: user.name,
          phoneNumber: user.phone.startsWith("+") ? user.phone : undefined // rudimentary check
        });
        console.log(`  ✅ Created auth user: ${user.name}`);
      } catch (e: any) {
        if (e.code === 'auth/uid-already-exists') console.log(`  ℹ️ Auth user ${user.email} already exists.`);
        else console.error(`  ❌ Failed auth user ${user.email}:`, e.message);
      }

      // Create in Firestore
      const { password, ...userData } = user;
      await db.collection("users").doc(user.userId).set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✅ Synced Firestore user: ${user.name}`);
    } catch (error: any) {
      console.error(`  ❌ Failed user ${user.email}:`, error.message);
    }
  }

  // --- COLLECTIONS ---
  const insertDocs = async (collName: string, dataArray: any[], idField: string) => {
    console.log(`\n📦 Seeding ${collName}...`);
    for (const item of dataArray) {
      try {
        const { [idField]: id, ...data } = item;
        await db.collection(collName).doc(id).set({
          ...data,
          createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: data.updatedAt || admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`  ✅ Inserted ${collName}: ${id}`);
      } catch (e: any) {
        console.error(`  ❌ Failed ${collName}:`, e.message);
      }
    }
  };

  await insertDocs("delivery_zones", DELIVERY_ZONES, "zoneId");
  await insertDocs("vendors", VENDORS, "vendorId");
  await insertDocs("books", BOOKS, "bookId");
  await insertDocs("orders", ORDERS, "orderId");
  await insertDocs("reviews", REVIEWS, "reviewId");
  await insertDocs("notifications", NOTIFICATIONS, "notificationId");
  await insertDocs("bookpass_subscriptions", BOOKPASS_SUBSCRIPTIONS, "subscriptionId");

  console.log("\n🎉 Firebase Seeding complete!");
}

seed().catch(console.error);
