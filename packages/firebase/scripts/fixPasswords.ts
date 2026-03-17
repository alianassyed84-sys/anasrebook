/**
 * Script to update demo user passwords to @123456
 * Usage: npx ts-node packages/firebase/scripts/fixPasswords.ts
 */
import admin from "firebase-admin";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

const auth = admin.auth();

async function fix() {
  const accounts = [
    { email: "admin@rebookindia.in", pass: "Admin@123456" },
    { email: "student@rebookindia.in", pass: "Student@123456" },
    { email: "vendor@rebookindia.in", pass: "Vendor@123456" }
  ];

  console.log("Updating passwords in Firebase Auth...");

  for (const acc of accounts) {
    try {
      const user = await auth.getUserByEmail(acc.email);
      if (user) {
        await auth.updateUser(user.uid, { password: acc.pass });
        console.log(`✅ Updated password for ${acc.email} to ${acc.pass}`);
      } else {
        console.log(`⚠️ User not found: ${acc.email}`);
      }
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        console.log(`⚠️ User not found: ${acc.email}`);
      } else {
        console.error(`❌ Failed ${acc.email}:`, err.message);
      }
    }
  }
}

fix();
