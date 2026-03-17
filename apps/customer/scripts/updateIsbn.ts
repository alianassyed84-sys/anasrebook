/**
 * Run this script ONCE to add ISBN numbers to all books in Firestore.
 * Usage: npx ts-node apps/customer/scripts/updateIsbn.ts
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, limit, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ISBN_MAP: Record<string, string> = {
  "NCERT Biology Class 12":         "9788174506191",
  "NCERT Chemistry Class 12":       "9788174506238",
  "NCERT English Flamingo Cl.12":   "9788174506047",
  "NCERT History Class 12":         "9788174506009",
  "NCERT Mathematics Class 10":     "9788174506163",
  "NCERT Physics Class 11":         "9788174506221",
  "NCERT Science Class 10":         "9788174506177",
  "DC Pandey Physics for NEET":     "9789313194117",
  "DC Pandey Physics NEET":         "9789313194117",
  "Errorless Chemistry NEET":       "9789386202253",
  "JEE Mathematics RD Sharma":      "9788193663202",
  "Laxmikant Indian Polity":        "9789356366145",
  "The Alchemist":                  "9780062315007",
  "Atomic Habits":                  "9780735211292",
  "Wings of Fire":                  "9788173711466",
  "Engineering Maths BS Grewal":    "9788174091956",
  "Data Structures - Thareja":      "9780198086307",
  "Principles of Management":       "9789352605552",
};

async function updateISBNs() {
  console.log("Fetching books from Firestore...");
  const booksRef = collection(db, "books");
  const q = query(booksRef, limit(100));
  const querySnapshot = await getDocs(q);
  
  console.log(`Found ${querySnapshot.size} books.`);

  for (const bookDoc of querySnapshot.docs) {
    const book = bookDoc.data();
    const isbn = ISBN_MAP[book.title];
    if (isbn && !book.isbn) {
      try {
        await updateDoc(doc(db, "books", bookDoc.id), { isbn });
        console.log(`✅ Updated: "${book.title}" → ${isbn}`);
      } catch (err) {
        console.error(`❌ Failed: "${book.title}"`, err);
      }
    } else if (book.isbn) {
      console.log(`⏭  Skipped (already has ISBN): "${book.title}" → ${book.isbn}`);
    } else {
      console.log(`⚠️  No ISBN mapping for: "${book.title}"`);
    }
  }
  console.log("\nDone!");
}

updateISBNs().catch(console.error);
