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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-S599EXQZC5"
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
    const user = await getCurrentUser();
    if (!user) throw new Error("No user found");
    return { ...user, $id: user.uid };
  },
  createEmailPasswordSession: async (email: string, pass: string) => {
    return await loginWithEmail(email, pass);
  },
  deleteSession: async (id: string) => {
    if (id === "current") return await logout();
  },
  updateName: async (name: string) => {
    // Basic implementation if needed
  }
};

export const databases = {
  listDocuments: async (dbId: string, collId: string, queries: any[] = []) => {
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
  },
  getDocument: async (dbId: string, collId: string, docId: string) => {
    return await getDocument(collId, docId);
  },
  createDocument: async (dbId: string, collId: string, docId: string, data: any) => {
    if (docId === "unique()") {
       return await createDocument(collId, data);
    }
    return await setDocument(collId, docId, data);
  },
  updateDocument: async (dbId: string, collId: string, docId: string, data: any) => {
    return await updateDocument(collId, docId, data);
  },
  deleteDocument: async (dbId: string, collId: string, docId: string) => {
    return await deleteDocument(collId, docId);
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
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "rebookmj-d52b4.firebasestorage.app";
    const path = encodeURIComponent(`${bucketId}/${fileId}`);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media`;
  },
  deleteFile: async (bucketId: string, fileId: string) => {
    return await deleteFile(`${bucketId}/${fileId}`);
  }
};

export const getStorageUrl = storageCompat.getFileView;
