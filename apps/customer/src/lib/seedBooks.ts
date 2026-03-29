import { db } from "./firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const BOOKS = [
  {
    title: "NCERT Mathematics Class 10",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506163",
    mrp: 95, sellingPrice: 35,
    condition: "Good", quantity: 5, rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506163-M.jpg",
  },
  {
    title: "NCERT Science Class 10",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506177",
    mrp: 85, sellingPrice: 30,
    condition: "Good", quantity: 4, rating: 4.3,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506177-M.jpg",
  },
  {
    title: "NCERT Physics Class 11",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506221",
    mrp: 120, sellingPrice: 45,
    condition: "Like New", quantity: 3, rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506221-M.jpg",
  },
  {
    title: "NCERT Chemistry Class 12",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506238",
    mrp: 115, sellingPrice: 40,
    condition: "Good", quantity: 6, rating: 4.4,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506238-M.jpg",
  },
  {
    title: "NCERT Biology Class 12",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506191",
    mrp: 110, sellingPrice: 40,
    condition: "Good", quantity: 4, rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506191-M.jpg",
  },
  {
    title: "NCERT History Class 12",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506009",
    mrp: 100, sellingPrice: 35,
    condition: "Good", quantity: 3, rating: 4.2,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506009-M.jpg",
  },
  {
    title: "NCERT English Flamingo",
    author: "NCERT", publisher: "NCERT",
    category: "School Books",
    isbn: "9788174506047",
    mrp: 90, sellingPrice: 28,
    condition: "Fair", quantity: 5, rating: 4.0,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174506047-M.jpg",
  },
  {
    title: "DC Pandey Physics NEET",
    author: "D.C. Pandey", publisher: "Arihant",
    category: "NEET / JEE",
    isbn: "9789313194117",
    mrp: 850, sellingPrice: 299,
    condition: "Good", quantity: 2, rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789313194117-M.jpg",
  },
  {
    title: "Errorless Chemistry NEET",
    author: "Universal", publisher: "Universal",
    category: "NEET / JEE",
    isbn: "9789386202253",
    mrp: 1200, sellingPrice: 450,
    condition: "Fair", quantity: 1, rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789386202253-M.jpg",
  },
  {
    title: "RD Sharma JEE Mathematics",
    author: "R.D. Sharma", publisher: "Dhanpat Rai",
    category: "NEET / JEE",
    isbn: "9788193663202",
    mrp: 980, sellingPrice: 350,
    condition: "Good", quantity: 3, rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788193663202-M.jpg",
  },
  {
    title: "MTG Biology NEET",
    author: "MTG Editorial",
    publisher: "MTG Learning Media",
    category: "NEET / JEE",
    isbn: "9789387839298",
    mrp: 950, sellingPrice: 380,
    condition: "Good", quantity: 2, rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789387839298-M.jpg",
  },
  {
    title: "Indian Polity Laxmikant",
    author: "M. Laxmikant", publisher: "McGraw Hill",
    category: "UPSC / Govt",
    isbn: "9789356366145",
    mrp: 750, sellingPrice: 320,
    condition: "Like New", quantity: 2, rating: 4.9,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789356366145-M.jpg",
  },
  {
    title: "Spectrum Modern History",
    author: "Rajiv Ahir", publisher: "Spectrum",
    category: "UPSC / Govt",
    isbn: "9789386882127",
    mrp: 495, sellingPrice: 199,
    condition: "Good", quantity: 4, rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789386882127-M.jpg",
  },
  {
    title: "Arihant General Knowledge",
    author: "Manohar Pandey", publisher: "Arihant",
    category: "UPSC / Govt",
    isbn: "9789327198225",
    mrp: 320, sellingPrice: 120,
    condition: "Good", quantity: 5, rating: 4.2,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789327198225-M.jpg",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    publisher: "HarperCollins",
    category: "Novels / Fiction",
    isbn: "9780062315007",
    mrp: 299, sellingPrice: 99,
    condition: "Like New", quantity: 5, rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear", publisher: "Penguin",
    category: "Novels / Fiction",
    isbn: "9780735211292",
    mrp: 499, sellingPrice: 180,
    condition: "Good", quantity: 3, rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg",
  },
  {
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    publisher: "Universities Press",
    category: "Novels / Fiction",
    isbn: "9788173711466",
    mrp: 295, sellingPrice: 99,
    condition: "Fair", quantity: 6, rating: 4.9,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788173711466-M.jpg",
  },
  {
    title: "BS Grewal Engineering Maths",
    author: "B.S. Grewal",
    publisher: "Khanna Publishers",
    category: "College / Uni",
    isbn: "9788174091956",
    mrp: 750, sellingPrice: 300,
    condition: "Good", quantity: 2, rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9788174091956-M.jpg",
  },
  {
    title: "Data Structures Thareja",
    author: "Reema Thareja", publisher: "Oxford",
    category: "College / Uni",
    isbn: "9780198086307",
    mrp: 450, sellingPrice: 180,
    condition: "Like New", quantity: 3, rating: 4.4,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780198086307-M.jpg",
  },
  {
    title: "Principles of Management",
    author: "P.C. Tripathi",
    publisher: "Sultan Chand",
    category: "College / Uni",
    isbn: "9789352605552",
    mrp: 380, sellingPrice: 150,
    condition: "Fair", quantity: 4, rating: 4.3,
    coverUrl: "https://covers.openlibrary.org/b/isbn/9789352605552-M.jpg",
  },
];

export async function seedBooks() {
  try {
    const done = localStorage.getItem("seeded_v3");
    if (done) return;
    const snap = await getDocs(collection(db, "books"));
    if (snap.size > 30) {
      localStorage.setItem("seeded_v3", "1");
      return;
    }
    for (const book of BOOKS) {
      await addDoc(collection(db, "books"), {
        ...book,
        vendorId: "demo-vendor",
        vendorName: "PaperShop Books",
        discountPercent: Math.round(
          ((book.mrp - book.sellingPrice) / book.mrp) * 100
        ),
        isAvailable: true,
        isFeatured: false,
        totalSold: Math.floor(Math.random() * 100),
        isDemoData: true,
        createdAt: serverTimestamp(),
      });
    }
    localStorage.setItem("seeded_v3", "1");
    console.log("✅ 20 books added v3!");
  } catch (e) {
    console.error(e);
  }
}
