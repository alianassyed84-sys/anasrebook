import { Client, Databases, Account, Storage, Query, ID, OAuthProvider }
  from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const databases  = new Databases(client);
export const account    = new Account(client);
export const storage    = new Storage(client);
export { Query, ID, OAuthProvider };

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export const COLLECTIONS = {
  USERS:          "users",
  VENDORS:        "vendors",
  BOOKS:          "books",
  ORDERS:         "orders",
  REVIEWS:        "reviews",
  DISPUTES:       "disputes",
  NOTIFICATIONS:  "notifications",
  BOOKPASS:       "bookpass_subscriptions",
  DELIVERY_ZONES: "delivery_zones",
};

// Google OAuth login function — used by all 3 apps
export async function loginWithGoogle(successUrl: string, failureUrl: string) {
  account.createOAuth2Session(
    OAuthProvider.Google,
    successUrl,
    failureUrl
  );
}
