import { databases, ID, DB_ID, COLLECTIONS } from "../lib/firebase";

const PROJECT_ID = "69b559b90006c9977136";
const DB_ID_VAL  = "69b55a8d00048adc7739";

// ── SEED BOOKS ──────────────────────────────────────────────────────
const BOOKS = [
  { title: "NCERT Mathematics Class 10", author: "NCERT",
    publisher: "NCERT", mrp: 95, sellingPrice: 35,
    category: "School Books", isbn: "9788174506163",
    condition: "Good", quantity: 5 },
  { title: "NCERT Science Class 10", author: "NCERT",
    publisher: "NCERT", mrp: 85, sellingPrice: 30,
    category: "School Books", isbn: "9788174506177",
    condition: "Good", quantity: 4 },
  { title: "NCERT Physics Class 11", author: "NCERT",
    publisher: "NCERT", mrp: 120, sellingPrice: 45,
    category: "School Books", isbn: "9788174506221",
    condition: "Like New", quantity: 3 },
  { title: "NCERT Chemistry Class 12", author: "NCERT",
    publisher: "NCERT", mrp: 115, sellingPrice: 40,
    category: "School Books", isbn: "9788174506238",
    condition: "Good", quantity: 6 },
  { title: "NCERT Biology Class 12", author: "NCERT",
    publisher: "NCERT", mrp: 110, sellingPrice: 40,
    category: "School Books", isbn: "9788174506191",
    condition: "Good", quantity: 4 },
  { title: "DC Pandey Physics for NEET", author: "D.C. Pandey",
    publisher: "Arihant", mrp: 850, sellingPrice: 299,
    category: "NEET / JEE", isbn: "9789313194117",
    condition: "Good", quantity: 2 },
  { title: "Errorless Chemistry NEET", author: "Universal",
    publisher: "Universal", mrp: 1200, sellingPrice: 450,
    category: "NEET / JEE", isbn: "9789386202253",
    condition: "Fair", quantity: 1 },
  { title: "RD Sharma JEE Mathematics", author: "R.D. Sharma",
    publisher: "Dhanpat Rai", mrp: 980, sellingPrice: 350,
    category: "NEET / JEE", isbn: "9788193663202",
    condition: "Good", quantity: 3 },
  { title: "Indian Polity - Laxmikant", author: "M. Laxmikant",
    publisher: "McGraw Hill", mrp: 750, sellingPrice: 320,
    category: "UPSC / Govt", isbn: "9789356366145",
    condition: "Like New", quantity: 2 },
  { title: "Spectrum Modern History", author: "Rajiv Ahir",
    publisher: "Spectrum", mrp: 495, sellingPrice: 199,
    category: "UPSC / Govt", isbn: "9789386882127",
    condition: "Good", quantity: 4 },
  { title: "The Alchemist", author: "Paulo Coelho",
    publisher: "HarperCollins", mrp: 299, sellingPrice: 99,
    category: "Novels / Fiction", isbn: "9780062315007",
    condition: "Like New", quantity: 5 },
  { title: "Atomic Habits", author: "James Clear",
    publisher: "Penguin", mrp: 499, sellingPrice: 180,
    category: "Novels / Fiction", isbn: "9780735211292",
    condition: "Good", quantity: 3 },
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam",
    publisher: "Universities Press", mrp: 295, sellingPrice: 99,
    category: "Novels / Fiction", isbn: "9788173711466",
    condition: "Fair", quantity: 6 },
  { title: "Engineering Maths BS Grewal", author: "B.S. Grewal",
    publisher: "Khanna Publishers", mrp: 750, sellingPrice: 300,
    category: "College / Uni", isbn: "9788174091956",
    condition: "Good", quantity: 2 },
  { title: "Data Structures - Thareja", author: "Reema Thareja",
    publisher: "Oxford", mrp: 450, sellingPrice: 180,
    category: "College / Uni", isbn: "9780198086307",
    condition: "Like New", quantity: 3 },
  { title: "Principles of Management", author: "P.C. Tripathi",
    publisher: "Sultan Chand", mrp: 380, sellingPrice: 150,
    category: "College / Uni", isbn: "9789352605552",
    condition: "Fair", quantity: 4 },
];

// ── DELIVERY ZONES ──────────────────────────────────────────────────
const DELIVERY_ZONES = [
  { zoneName: "Hyper Local", minKm: 0,   maxKm: 5,
    buyerCharge: 25,  logisticsCost: 15, yourMargin: 10 },
  { zoneName: "Local",       minKm: 5,   maxKm: 15,
    buyerCharge: 40,  logisticsCost: 25, yourMargin: 15 },
  { zoneName: "City",        minKm: 15,  maxKm: 50,
    buyerCharge: 60,  logisticsCost: 40, yourMargin: 20 },
  { zoneName: "Near State",  minKm: 50,  maxKm: 200,
    buyerCharge: 90,  logisticsCost: 60, yourMargin: 30 },
  { zoneName: "State",       minKm: 200, maxKm: 500,
    buyerCharge: 120, logisticsCost: 80, yourMargin: 40 },
  { zoneName: "Pan India",   minKm: 500, maxKm: 9999,
    buyerCharge: 160, logisticsCost: 110, yourMargin: 50 },
];

async function seedData() {
  console.log("Starting seed...");

  // Seed books
  for (const book of BOOKS) {
    try {
      await databases.createDocument(
        DB_ID_VAL, "books", ID.unique(), {
          ...book,
          vendorId:       "demo-vendor",
          discountPercent: Math.round(
            ((book.mrp - book.sellingPrice) / book.mrp) * 100
          ),
          isAvailable:    true,
          isFeatured:     false,
          isSponsored:    false,
          totalSold:      0,
          isDemoData:     true,
        }
      );
      console.log("✅ Book added:", book.title);
    } catch (e) {
      console.log("⚠️ Skip:", book.title);
    }
  }

  // Seed delivery zones
  for (const zone of DELIVERY_ZONES) {
    try {
      await databases.createDocument(
        DB_ID_VAL, "delivery_zones", ID.unique(), {
          ...zone,
          isActive: true,
        }
      );
      console.log("✅ Zone added:", zone.zoneName);
    } catch (e) {
      console.log("⚠️ Skip zone:", zone.zoneName);
    }
  }

  console.log("✅ Seed complete!");
}

seedData();
