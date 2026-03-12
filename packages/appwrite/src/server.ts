import { Client, Users, Databases, Storage } from 'node-appwrite';

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.warn("Server Appwrite SDK: Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY.");
}

const createServerClient = () => {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_PROJECT_ID!)
    .setKey(APPWRITE_API_KEY!);
  
  return {
    get users() {
      return new Users(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    }
  };
};

export const serverClient = createServerClient();
export { ID, Query, Permission, Role } from 'node-appwrite';
