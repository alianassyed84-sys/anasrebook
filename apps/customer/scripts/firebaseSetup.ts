import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, addDoc
} from "firebase/firestore";
import {
  getAuth, createUserWithEmailAndPassword
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCv_19zUuX6D9Z5cmvZfq2T2q37N-VDQyA",
  authDomain: "bookindia-55c4f.firebaseapp.com",
  projectId: "bookindia-55c4f",
  storageBucket: "bookindia-55c4f.firebasestorage.app",
  messagingSenderId: "65507988091",
  appId: "1:65507988091:web:858509c33ecb40ef9108de",
  measurementId: "G-ZDKM41QQQX"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── DEMO USERS ───────────────────────────────────────────────────────
const USERS = [
  {
    email:    "admin@rebookindia.in",
    password: "Admin@123456",
    name:     "RebookIndia Admin",
    role:     "admin",
  },
  {
    email:    "student@rebookindia.in",
    password: "Student@123456",
    name:     "Test Student",
    role:     "customer",
  },
  {
    email:    "vendor@rebookindia.in",
    password: "Vendor@123456",
    name:     "PaperShop Books",
    role:     "vendor",
  },
];

// ── BOOKS ────────────────────────────────────────────────────────────
const BOOKS = [
  { title: "NCERT Mathematics Class 10", author: "NCERT",
    publisher: "NCERT", mrp: 95, sellingPrice: 35,
    category: "School Books", isbn: "9788174506163",
    condition: "Good", quantity: 5, rating: 4.5 },
  { title: "NCERT Science Class 10", author: "NCERT",
    publisher: "NCERT", mrp: 85, sellingPrice: 30,
    category: "School Books", isbn: "9788174506177",
    condition: "Good", quantity: 4, rating: 4.3 },
  { title: "NCERT Physics Class 11", author: "NCERT",
    publisher: "NCERT", mrp: 120, sellingPrice: 45,
    category: "School Books", isbn: "9788174506221",
    condition: "Like New", quantity: 3, rating: 4.7 },
  { title: "NCERT Chemistry Class 12", author: "NCERT",
    publisher: "NCERT", mrp: 115, sellingPrice: 40,
    category: "School Books", isbn: "9788174506238",
    condition: "Good", quantity: 6, rating: 4.4 },
  { title: "NCERT Biology Class 12", author: "NCERT",
    publisher: "NCERT", mrp: 110, sellingPrice: 40,
    category: "School Books", isbn: "9788174506191",
    condition: "Good", quantity: 4, rating: 4.6 },
  { title: "NCERT History Class 12", author: "NCERT",
    publisher: "NCERT", mrp: 100, sellingPrice: 35,
    category: "School Books", isbn: "9788174506009",
    condition: "Good", quantity: 3, rating: 4.2 },
  { title: "NCERT English Flamingo", author: "NCERT",
    publisher: "NCERT", mrp: 90, sellingPrice: 28,
    category: "School Books", isbn: "9788174506047",
    condition: "Fair", quantity: 5, rating: 4.0 },
  { title: "DC Pandey Physics for NEET", author: "D.C. Pandey",
    publisher: "Arihant", mrp: 850, sellingPrice: 299,
    category: "NEET / JEE", isbn: "9789313194117",
    condition: "Good", quantity: 2, rating: 4.8 },
  { title: "Errorless Chemistry NEET", author: "Universal",
    publisher: "Universal", mrp: 1200, sellingPrice: 450,
    category: "NEET / JEE", isbn: "9789386202253",
    condition: "Fair", quantity: 1, rating: 4.5 },
  { title: "RD Sharma JEE Mathematics", author: "R.D. Sharma",
    publisher: "Dhanpat Rai", mrp: 980, sellingPrice: 350,
    category: "NEET / JEE", isbn: "9788193663202",
    condition: "Good", quantity: 3, rating: 4.7 },
  { title: "Indian Polity - Laxmikant", author: "M. Laxmikant",
    publisher: "McGraw Hill", mrp: 750, sellingPrice: 320,
    category: "UPSC / Govt", isbn: "9789356366145",
    condition: "Like New", quantity: 2, rating: 4.9 },
  { title: "Spectrum Modern History", author: "Rajiv Ahir",
    publisher: "Spectrum", mrp: 495, sellingPrice: 199,
    category: "UPSC / Govt", isbn: "9789386882127",
    condition: "Good", quantity: 4, rating: 4.6 },
  { title: "The Alchemist", author: "Paulo Coelho",
    publisher: "HarperCollins", mrp: 299, sellingPrice: 99,
    category: "Novels / Fiction", isbn: "9780062315007",
    condition: "Like New", quantity: 5, rating: 4.8 },
  { title: "Atomic Habits", author: "James Clear",
    publisher: "Penguin", mrp: 499, sellingPrice: 180,
    category: "Novels / Fiction", isbn: "9780735211292",
    condition: "Good", quantity: 3, rating: 4.7 },
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam",
    publisher: "Universities Press", mrp: 295, sellingPrice: 99,
    category: "Novels / Fiction", isbn: "9788173711466",
    condition: "Fair", quantity: 6, rating: 4.9 },
  { title: "Engineering Maths BS Grewal", author: "B.S. Grewal",
    publisher: "Khanna Publishers", mrp: 750, sellingPrice: 300,
    category: "College / Uni", isbn: "9788174091956",
    condition: "Good", quantity: 2, rating: 4.5 },
  { title: "Data Structures - Thareja", author: "Reema Thareja",
    publisher: "Oxford", mrp: 450, sellingPrice: 180,
    category: "College / Uni", isbn: "9780198086307",
    condition: "Like New", quantity: 3, rating: 4.4 },
  { title: "Principles of Management", author: "P.C. Tripathi",
    publisher: "Sultan Chand", mrp: 380, sellingPrice: 150,
    category: "College / Uni", isbn: "9789352605552",
    condition: "Fair", quantity: 4, rating: 4.3 },
  { title: "Arihant General Knowledge", author: "Manohar Pandey",
    publisher: "Arihant", mrp: 320, sellingPrice: 120,
    category: "UPSC / Govt", isbn: "9789327198225",
    condition: "Good", quantity: 5, rating: 4.2 },
  { title: "MTG Biology NEET", author: "MTG Editorial",
    publisher: "MTG Learning Media", mrp: 950, sellingPrice: 380,
    category: "NEET / JEE", isbn: "9789387839298",
    condition: "Good", quantity: 2, rating: 4.6 },
];

// ── DELIVERY ZONES ───────────────────────────────────────────────────
const DELIVERY_ZONES = [
  { zoneName: "Hyper Local", minKm: 0,   maxKm: 5,
    buyerCharge: 25,  logisticsCost: 15, margin: 10 },
  { zoneName: "Local",       minKm: 5,   maxKm: 15,
    buyerCharge: 40,  logisticsCost: 25, margin: 15 },
  { zoneName: "City",        minKm: 15,  maxKm: 50,
    buyerCharge: 60,  logisticsCost: 40, margin: 20 },
  { zoneName: "Near State",  minKm: 50,  maxKm: 200,
    buyerCharge: 90,  logisticsCost: 60, margin: 30 },
  { zoneName: "State",       minKm: 200, maxKm: 500,
    buyerCharge: 120, logisticsCost: 80, margin: 40 },
  { zoneName: "Pan India",   minKm: 500, maxKm: 9999,
    buyerCharge: 160, logisticsCost: 110, margin: 50 },
];

// ── PLATFORM SETTINGS ────────────────────────────────────────────────
const SETTINGS = {
  freeCommission:      15,
  silverCommission:    12,
  goldCommission:      10,
  payoutCycleDays:     7,
  codLimit:            2000,
  bookPassPrice:       149,
  maxFeaturedBooks:    10,
  freeCommissionDays:  90,
};

// ── MAIN SETUP FUNCTION ──────────────────────────────────────────────
async function setup() {
  console.log("🔥 Starting Firebase setup...\n");

  // 1. Create Users in Auth + Firestore
  console.log("👤 Creating users...");
  const uids: Record<string, string> = {};

  for (const u of USERS) {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth, u.email, u.password
      );
      uids[u.role] = cred.user.uid;

      if (u.role === "customer") {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid:         cred.user.uid,
          name:        u.name,
          email:       u.email,
          phone:       "9000000001",
          city:        "Hyderabad",
          pincode:     "500001",
          isBookPass:  false,
          totalOrders: 0,
          createdAt:   new Date(),
        });
        console.log("✅ Customer user created");
      }

      if (u.role === "vendor") {
        await setDoc(doc(db, "vendors", cred.user.uid), {
          uid:             cred.user.uid,
          shopName:        "PaperShop Books",
          ownerName:       "Test Vendor",
          email:           u.email,
          phone:           "9000000000",
          city:            "Hyderabad",
          state:           "Telangana",
          pincode:         "500001",
          address:         "123 Book Street, Hyderabad",
          status:          "approved",
          subscriptionPlan: "gold",
          commissionRate:  10,
          rating:          4.8,
          totalReviews:    24,
          totalSales:      150,
          totalEarnings:   45000,
          pendingPayout:   3200,
          deliveryRadius:  50,
          isFreeCommission: false,
          createdAt:       new Date(),
        });
        console.log("✅ Vendor user + document created");
      }

      if (u.role === "admin") {
        console.log("✅ Admin user created | UID:", cred.user.uid);
      }

    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        console.log("⚠️ User already exists:", u.email);
      } else {
        console.log("❌ Error creating user:", u.email, err?.message);
      }
    }
  }

  // 2. Seed Books
  console.log("\n📚 Adding books...");
  const vendorId = uids["vendor"] || "demo-vendor";

  for (const book of BOOKS) {
    try {
      await addDoc(collection(db, "books"), {
        ...book,
        vendorId,
        discountPercent: Math.round(
          ((book.mrp - book.sellingPrice) / book.mrp) * 100
        ),
        coverUrl:    `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`,
        isAvailable: true,
        isFeatured:  false,
        isSponsored: false,
        totalSold:   Math.floor(Math.random() * 30),
        isDemoData:  true,
        createdAt:   new Date(),
      });
      console.log("✅ Book added:", book.title);
    } catch (err: any) {
      console.log("⚠️ Skip book:", book.title);
    }
  }

  // 3. Seed Delivery Zones
  console.log("\n🚚 Adding delivery zones...");
  for (const zone of DELIVERY_ZONES) {
    try {
      await addDoc(collection(db, "delivery_zones"), {
        ...zone,
        isActive:  true,
        createdAt: new Date(),
      });
      console.log("✅ Zone added:", zone.zoneName);
    } catch (err: any) {
      console.log("⚠️ Skip zone:", zone.zoneName);
    }
  }

  // 4. Save Platform Settings
  console.log("\n⚙️ Saving settings...");
  try {
    await setDoc(doc(db, "settings", "platform"), {
      ...SETTINGS,
      updatedAt: new Date(),
    });
    console.log("✅ Settings saved");
  } catch (err: any) {
    console.log("⚠️ Settings error:", err?.message);
  }

  console.log("\n🎉 Firebase setup complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:    admin@rebookindia.in / Admin@123456");
  console.log("Customer: student@rebookindia.in / Student@123456");
  console.log("Vendor:   vendor@rebookindia.in / Vendor@123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  process.exit(0);
}

setup().catch(console.error);
