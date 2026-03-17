import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // This'll work in GCP/Vercel with SA env vars
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "rebookmj-d52b4.firebasestorage.app"
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export const serverClient = {
  get users() {
     return {
        get: async (id: string) => {
           const record = await auth.getUser(id);
           return { ...record, $id: record.uid };
        },
        create: async (id: string, email: string, pass: string, name: string) => {
           const record = await auth.createUser({
              uid: id === "unique()" ? undefined : id,
              email,
              password: pass,
              displayName: name
           });
           return { ...record, $id: record.uid };
        }
     };
  },
  get databases() {
     return {
        listDocuments: async (dbId: string, collId: string, _queries: any[] = []) => {
           const snap = await db.collection(collId).get();
           const docs = snap.docs.map(d => ({ ...d.data(), $id: d.id }));
           return { documents: docs, total: docs.length };
        },
        getDocument: async (dbId: string, collId: string, docId: string) => {
           const doc = await db.collection(collId).doc(docId).get();
           return { ...doc.data(), $id: doc.id };
        },
        createDocument: async (dbId: string, collId: string, docId: string, data: any) => {
           const id = docId === "unique()" ? db.collection(collId).doc().id : docId;
           await db.collection(collId).doc(id).set(data);
           return { ...data, $id: id };
        },
        updateDocument: async (dbId: string, collId: string, docId: string, data: any) => {
           await db.collection(collId).doc(docId).update(data);
           return { ...data, $id: docId };
        }
     };
  }
};

export const ID = {
   unique: () => crypto.randomUUID().replace(/-/g, "")
};

export const Query = {
   equal: (field: string, value: any) => ({ type: "where", field, operator: "==", value }),
   limit: (val: number) => ({ type: "limit", value: val })
};
