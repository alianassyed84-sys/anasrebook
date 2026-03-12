/**
 * Script to update demo user passwords to @123456
 * Usage: npx ts-node packages/appwrite/scripts/fixPasswords.ts
 */
import { Client, Users } from "node-appwrite";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const {
  APPWRITE_ENDPOINT = "https://sgp.cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
} = process.env;

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error("Missing Appwrite credentials.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const users = new Users(client);

async function fix() {
  const accounts = [
    { email: "admin@rebookindia.in", pass: "Admin@123456" },
    { email: "student@rebookindia.in", pass: "Student@123456" },
    { email: "vendor@rebookindia.in", pass: "Vendor@123456" }
  ];

  console.log("Updating passwords in Appwrite...");

  for (const acc of accounts) {
    try {
      const list = await users.list(undefined, acc.email);
      if (list.users.length > 0) {
        const userId = list.users[0].$id;
        await users.updatePassword(userId, acc.pass);
        console.log(`✅ Updated password for ${acc.email} to ${acc.pass}`);
      } else {
        console.log(`⚠️ User not found: ${acc.email}`);
      }
    } catch (err: any) {
      console.error(`❌ Failed ${acc.email}:`, err.message);
    }
  }
}

fix();
