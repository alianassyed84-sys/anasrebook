import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged, User, createUserWithEmailAndPassword, updateProfile
} from "firebase/auth";
import { 
  getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, 
  deleteDoc, collection, query, where, serverTimestamp, 
  addDoc, orderBy, limit as firestoreLimit, QueryConstraint
} from "firebase/firestore";
import { 
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCv_19zUuX6D9Z5cmvZfq2T2q37N-VDQyA",
  authDomain: "bookindia-55c4f.firebaseapp.com",
  projectId: "bookindia-55c4f",
  storageBucket: "bookindia-55c4f.firebasestorage.app",
  messagingSenderId: "65507988091",
  appId: "1:65507988091:web:858509c33ecb40ef9108de",
};

// Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics (only in client-side)
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

import { COLLECTIONS } from "../config";
export { COLLECTIONS };

// ========================
// FIRESTORE HELPER FUNCTIONS
// ========================

const normalizeData = (docSnap: any) => {
  const data = docSnap.data();
  if (!data) return null;
  
  // Normalize Firestore timestamps to ISO strings for Appwrite compatibility
  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key].toDate === 'function') {
      data[key] = data[key].toDate().toISOString();
    }
  });

  return {
    id: docSnap.id,
    $id: docSnap.id,
    createdAt: data.createdAt || null,
    $createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    $updatedAt: data.updatedAt || null,
    ...data
  };
};

export const getDocument = async (collName: string, docId: string) => {
  const dRef = doc(db, collName, docId);
  const snap = await getDoc(dRef);
  if (!snap.exists()) return null;
  return normalizeData(snap);
};

export const getDocumentsByField = async (collName: string, field: string, operator: any, value: any) => {
  const q = query(collection(db, collName), where(field, operator, value));
  const snap = await getDocs(q);
  return snap.docs.map(d => normalizeData(d));
};

export const createDocument = async (collName: string, data: any) => {
  const finalData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const cRef = collection(db, collName);
  const docRef = await addDoc(cRef, finalData);
  // Re-fetch to get normalized timestamps from server
  const snap = await getDoc(docRef);
  return normalizeData(snap);
};

export const setDocument = async (collName: string, docId: string, data: any) => {
  const finalData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const dRef = doc(db, collName, docId);
  await setDoc(dRef, finalData);
  const snap = await getDoc(dRef);
  return normalizeData(snap);
};

export const updateDocument = async (collName: string, docId: string, data: any) => {
  const finalData = {
    ...data,
    updatedAt: serverTimestamp()
  };
  const dRef = doc(db, collName, docId);
  await updateDoc(dRef, finalData);
  const snap = await getDoc(dRef);
  return normalizeData(snap);
};

export const deleteDocument = async (collName: string, docId: string) => {
  const dRef = doc(db, collName, docId);
  await deleteDoc(dRef);
};

export const getAllDocuments = async (collName: string) => {
  const cRef = collection(db, collName);
  const snap = await getDocs(cRef);
  return snap.docs.map(d => normalizeData(d));
};

// ========================
// AUTH HELPERS
// ========================

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error: any) {
    let msg = "Login failed";
    switch(error.code) {
      case "auth/wrong-password": msg = "Wrong password."; break;
      case "auth/user-not-found": msg = "User not found."; break;
      case "auth/invalid-email": msg = "Invalid email format."; break;
      case "auth/too-many-requests": msg = "Too many requests. Try again later."; break;
      case "auth/invalid-credential": msg = "Invalid credentials."; break;
    }
    throw new Error(msg);
  }
};

export const loginWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    }, () => resolve(null));
  });
};

// ========================
// COMPATIBILITY LAYER
// ========================

export const account = {
  create: async (id: string, email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    return { ...cred.user, $id: cred.user.uid };
  },
  get: async () => {
    // --- DEV MODE FREE ACCESS MOCK ---
    return { 
      $id: "dev_user_123", 
      uid: "dev_user_123", 
      email: "admin@rebookindia.in", 
      name: "Dev Mode User" 
    };
    // ---------------------------------
  },
  createEmailPasswordSession: async (email: string, pass: string) => {
    return await loginWithEmail(email, pass);
  },
  deleteSession: async (id: string) => {
    if (id === "current") return await logout();
  },
  updateName: async (name: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");
    
    // 1. Update Auth Profile
    await updateProfile(user, { displayName: name });
    
    // 2. Sync with Firestore Users collection if it exists
    try {
      const uRef = doc(db, COLLECTIONS.USERS, user.uid);
      await updateDoc(uRef, { name, updatedAt: serverTimestamp() });
    } catch (e) {
      console.warn("Failed to sync name to Firestore users collection", e);
    }
    
    return { ...user, displayName: name, $id: user.uid };
  },
  updatePrefs: async (prefs: any) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");
    
    // Support Appwrite-like prefs by storing them in the user document in Firestore
    const uRef = doc(db, COLLECTIONS.USERS, user.uid);
    await updateDoc(uRef, { 
      prefs, 
      updatedAt: serverTimestamp() 
    });
    
    // Also update Auth photoURL if photoUrl is in prefs
    if (prefs.photoUrl) {
      await updateProfile(user, { photoURL: prefs.photoUrl });
    }
    
    return prefs;
  }
};

// ========================
// SHARED DEMO BOOK STORE
// ========================
export const DEMO_BOOKS = [
  { title: "NCERT Mathematics Class 10", author: "NCERT", publisher: "NCERT", category: "school", mrp: 95, sellingPrice: 35, condition: "good", isbn: "9788174506163", description: "Complete NCERT Math textbook for Class 10, covers all topics as per the latest CBSE syllabus." },
  { title: "NCERT Science Class 10", author: "NCERT", publisher: "NCERT", category: "school", mrp: 85, sellingPrice: 30, condition: "good", isbn: "9788174506177", description: "NCERT Science textbook for Class 10 with chapters on Physics, Chemistry and Biology." },
  { title: "NCERT Physics Class 11", author: "NCERT", publisher: "NCERT", category: "school", mrp: 120, sellingPrice: 45, condition: "like_new", isbn: "9788174506221", description: "Physics Part 1 & 2 for Class 11 — kinematics, laws of motion, work, energy and power." },
  { title: "NCERT Chemistry Class 12", author: "NCERT", publisher: "NCERT", category: "school", mrp: 115, sellingPrice: 40, condition: "good", isbn: "9788174506238", description: "NCERT Chemistry for Class 12. Essential for board exams and JEE/NEET preparation." },
  { title: "NCERT Biology Class 12", author: "NCERT", publisher: "NCERT", category: "school", mrp: 110, sellingPrice: 40, condition: "good", isbn: "9788174506191", description: "Complete biology text for Class 12 — genetics, evolution, ecology and human health." },
  { title: "NCERT History Class 12", author: "NCERT", publisher: "NCERT", category: "school", mrp: 100, sellingPrice: 35, condition: "good", isbn: "9788174506009", description: "Themes in Indian History – Part I, II & III for Class 12." },
  { title: "DC Pandey Physics NEET", author: "D.C. Pandey", publisher: "Arihant", category: "neet", mrp: 850, sellingPrice: 299, condition: "good", isbn: "9789313194117", description: "Comprehensive physics guide for NEET and JEE, with thousands of solved problems." },
  { title: "Errorless Chemistry NEET", author: "Universal", publisher: "Universal", category: "neet", mrp: 1200, sellingPrice: 450, condition: "fair", isbn: "9789386202253", description: "The gold standard chemistry reference for NEET aspirants." },
  { title: "RD Sharma JEE Mathematics", author: "R.D. Sharma", publisher: "Dhanpat Rai", category: "neet", mrp: 980, sellingPrice: 350, condition: "good", isbn: "9788193663202", description: "Objective Mathematics for JEE Main and Advanced preparation." },
  { title: "MTG Biology NEET", author: "MTG Editorial", publisher: "MTG", category: "neet", mrp: 950, sellingPrice: 380, condition: "good", isbn: "9789387839298", description: "40 years chapter-wise solutions and NCERT at your fingertips for NEET Biology." },
  { title: "Indian Polity Laxmikant", author: "M. Laxmikant", publisher: "McGraw Hill", category: "upsc", mrp: 750, sellingPrice: 320, condition: "like_new", isbn: "9789356366145", description: "The definitive guide to Indian Polity for UPSC Civil Services examination." },
  { title: "Spectrum Modern History", author: "Rajiv Ahir", publisher: "Spectrum", category: "upsc", mrp: 495, sellingPrice: 199, condition: "good", isbn: "9789386882127", description: "A Brief History of Modern India — the most recommended book for UPSC History." },
  { title: "Arihant General Knowledge", author: "Manohar Pandey", publisher: "Arihant", category: "upsc", mrp: 320, sellingPrice: 120, condition: "good", isbn: "9789327198225", description: "Latest General Knowledge 2024 covering current affairs, science, sports and more." },
  { title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperCollins", category: "novel", mrp: 299, sellingPrice: 99, condition: "like_new", isbn: "9780062315007", description: "A magical story about following your dreams. One of the best-selling novels of all time." },
  { title: "Atomic Habits", author: "James Clear", publisher: "Penguin", category: "novel", mrp: 499, sellingPrice: 180, condition: "good", isbn: "9780735211292", description: "Proven framework for building good habits and breaking bad ones." },
  { title: "Wings of Fire", author: "A.P.J. Abdul Kalam", publisher: "Universities Press", category: "novel", mrp: 295, sellingPrice: 99, condition: "fair", isbn: "9788173711466", description: "Autobiography of India's Missile Man and former President Dr. A.P.J. Abdul Kalam." },
  { title: "BS Grewal Engineering Maths", author: "B.S. Grewal", publisher: "Khanna Publishers", category: "college", mrp: 750, sellingPrice: 300, condition: "good", isbn: "9788174091956", description: "Higher Engineering Mathematics — the standard reference for B.Tech students." },
  { title: "Data Structures Thareja", author: "Reema Thareja", publisher: "Oxford", category: "college", mrp: 450, sellingPrice: 180, condition: "like_new", isbn: "9780198086307", description: "Data Structures using C — essential for CS/IT undergraduate students." },
  { title: "Principles of Management", author: "P.C. Tripathi", publisher: "Sultan Chand", category: "college", mrp: 380, sellingPrice: 150, condition: "fair", isbn: "9789352605552", description: "Comprehensive management principles for BBA and MBA students." },
  { title: "Operating System Concepts", author: "Silberschatz", publisher: "Wiley", category: "college", mrp: 699, sellingPrice: 250, condition: "good", isbn: "9788126520435", description: "The dinosaur book — industry-standard OS concepts for computer science students." },
].map((b, i) => ({
  ...b,
  $id: `mock_book_${i}`,
  id: `mock_book_${i}`,
  isAvailable: true,
  vendorId: "dev_vendor_999",
  vendorName: "PaperShop Books",
  vendorCity: "Hyderabad",
  vendorState: "Telangana",
  vendorPhone: "6301038443",
  quantity: Math.floor(Math.random() * 5) + 1,
  rating: (4.2 + Math.random() * 0.7).toFixed(1),
  createdAt: new Date(Date.now() - i * 86400000).toISOString()
}));

// Read vendor-added books from localStorage (browser only)
const getLocalBooks = (): any[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ri_vendor_books") || "[]");
  } catch { return []; }
};

// Save a vendor-added book to localStorage
export const saveLocalBook = (book: any) => {
  if (typeof window === "undefined") return;
  const books = getLocalBooks();
  books.unshift(book);  // new books first
  localStorage.setItem("ri_vendor_books", JSON.stringify(books));
};

// Get all books (demo defaults + vendor-added)
const getAllBooks = () => {
  const localBooks = getLocalBooks();
  return [...localBooks, ...DEMO_BOOKS];
};

export const databases = {
  listDocuments: async (dbId: string, collId: string, queries: any[] = []) => {
    // --- DEV MODE FREE ACCESS MOCKS ---
    if (collId === COLLECTIONS.VENDORS) {
      return {
        documents: [{
          $id: "dev_vendor_999",
          userId: "dev_user_123",
          shopName: "PaperShop Books",
          ownerName: "Anas Syed",
          city: "Hyderabad",
          state: "Telangana",
          phone: "6301038443",
          rating: 4.8,
          totalEarnings: 42500,
          status: "approved"
        }],
        total: 1
      };
    }
    // Support admin panel user verification
    if (collId === COLLECTIONS.USERS && queries.some((q: any) => q.value === "admin@rebookindia.in")) {
      return {
        documents: [{
          $id: "dev_user_123",
          role: "admin",
          name: "Dev Mode User",
          email: "admin@rebookindia.in"
        }],
        total: 1
      };
    }

    if (collId === COLLECTIONS.BOOKS) {
      let all = getAllBooks();

      // Apply filters
      const catQuery = queries.find(q => q.field === "category" && q.operator === "==");
      if (catQuery) {
        all = all.filter(b => b.category === catQuery.value);
      }
      const vendorQuery = queries.find(q => q.field === "vendorId" && q.operator === "==");
      if (vendorQuery) {
        all = all.filter(b => b.vendorId === vendorQuery.value);
      }
      const availQuery = queries.find(q => q.field === "isAvailable" && q.operator === "==");
      if (availQuery) {
        all = all.filter(b => b.isAvailable === availQuery.value);
      }
      // Apply limit
      const limitQuery = queries.find(q => q.type === "limit");
      if (limitQuery && limitQuery.value > 0) {
        all = all.slice(0, limitQuery.value);
      }
      return { documents: all, total: all.length };
    }

    // For ORDERS collection — return empty but functional
    if (collId === COLLECTIONS.ORDERS) {
      return { documents: [], total: 0 };
    }
    // For DISPUTES collection
    if (collId === COLLECTIONS.DISPUTES) {
      return { documents: [], total: 0 };
    }
    // ----------------------------------

    try {
      const constraints: QueryConstraint[] = [];
      for (const q of queries) {
        if (q.type === "where") {
          constraints.push(where(q.field, q.operator, q.value));
        } else if (q.type === "orderBy") {
          constraints.push(orderBy(q.field, q.direction));
        } else if (q.type === "limit") {
          constraints.push(firestoreLimit(q.value));
        }
      }
      const q = query(collection(db, collId), ...constraints);
      const snap = await getDocs(q);
      const documents = snap.docs.map(d => normalizeData(d));
      return { documents, total: documents.length };
    } catch {
      return { documents: [], total: 0 };
    }
  },
  getDocument: async (dbId: string, collId: string, docId: string) => {
    // Resolve mock book IDs from shared demo store
    if (collId === COLLECTIONS.BOOKS) {
      const all = getAllBooks();
      const found = all.find(b => b.$id === docId || b.id === docId);
      if (found) return found;
    }
    // Resolve mock vendor
    if (collId === COLLECTIONS.VENDORS && docId === "dev_vendor_999") {
      return {
        $id: "dev_vendor_999",
        id: "dev_vendor_999",
        shopName: "PaperShop Books",
        ownerName: "Anas Syed",
        city: "Hyderabad",
        state: "Telangana",
        phone: "6301038443",
        rating: 4.8,
        status: "approved"
      };
    }
    try {
      return await getDocument(collId, docId);
    } catch {
      return null;
    }
  },
  createDocument: async (dbId: string, collId: string, docId: string, data: any) => {
    // For BOOKS: save to localStorage so customer site picks it up immediately
    if (collId === COLLECTIONS.BOOKS) {
      const newId = `vendor_book_${Date.now()}`;
      const newBook = {
        ...data,
        $id: newId,
        id: newId,
        isAvailable: true,
        createdAt: new Date().toISOString()
      };
      saveLocalBook(newBook);
      return newBook;
    }
    if (docId === "unique()") {
       try { return await createDocument(collId, data); } catch { return { ...data, $id: `local_${Date.now()}`, id: `local_${Date.now()}` }; }
    }
    try { return await setDocument(collId, docId, data); } catch { return { ...data, $id: docId, id: docId }; }
  },
  updateDocument: async (dbId: string, collId: string, docId: string, data: any) => {
    try { return await updateDocument(collId, docId, data); } catch { return { ...data, $id: docId }; }
  },
  deleteDocument: async (dbId: string, collId: string, docId: string) => {
    try { return await deleteDocument(collId, docId); } catch { return null; }
  }
};

// Storage Helpers
export const uploadFile = async (path: string, file: File) => {
  const sRef = ref(storage, path);
  await uploadBytes(sRef, file);
  return await getDownloadURL(sRef);
};

export const deleteFile = async (path: string) => {
  const sRef = ref(storage, path);
  await deleteObject(sRef);
};

// Map storage methods for compatibility if needed
export const storageCompat = {
  createFile: async (bucketId: string, fileId: string, file: File) => {
    const id = fileId === "unique()" ? crypto.randomUUID() : fileId;
    const path = `${bucketId}/${id}`;
    const url = await uploadFile(path, file);
    return { id, $id: id, url };
  },
  getFileView: (bucketId: string, fileId: string) => {
    // Return direct public URL for Firebase Storage
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bookindia-55c4f.firebasestorage.app";
    const path = encodeURIComponent(`${bucketId}/${fileId}`);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media`;
  },
  deleteFile: async (bucketId: string, fileId: string) => {
    return await deleteFile(`${bucketId}/${fileId}`);
  }
};

export const getStorageUrl = storageCompat.getFileView;
