/**
 * Run this script ONCE to add ISBN numbers to all books in Appwrite.
 * Usage: npx ts-node apps/customer/scripts/updateIsbn.ts
 * 
 * NOTE: Set your env vars before running:
 *   NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID,
 *   NEXT_PUBLIC_APPWRITE_DATABASE_ID
 */

import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "rebookindia-db";

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
  console.log("Fetching books from Appwrite...");
  const res = await databases.listDocuments(DB_ID, "books", [Query.limit(100)]);
  console.log(`Found ${res.documents.length} books.`);

  for (const book of res.documents) {
    const isbn = ISBN_MAP[book.title];
    if (isbn && !book.isbn) {
      try {
        await databases.updateDocument(DB_ID, "books", book.$id, { isbn });
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
