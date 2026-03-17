import { databases, ID } from "./client";
import { FIREBASE_PROJECT_ID, COLLECTIONS } from "./config";
import type { User } from "@rebookindia/types";

export const userActions = {
  createUser: async (userData: Omit<User, "createdAt">) => {
    return await databases.createDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.USERS,
      userData.userId, // Map provided userId or ID.unique()
      {
        ...userData,
        createdAt: new Date().toISOString(),
      }
    );
  },
  getUserById: async (userId: string): Promise<User> => {
    return (await databases.getDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.USERS,
      userId
    )) as unknown as User;
  },
  updateUser: async (userId: string, data: Partial<User>) => {
    return await databases.updateDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.USERS,
      userId,
      data
    );
  },
  activateBookPass: async (userId: string, expiryDate: string) => {
    return await databases.updateDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.USERS,
      userId,
      {
        isBookPass: true,
        bookPassExpiry: expiryDate
      }
    );
  },
  checkBookPassStatus: async (userId: string) => {
    const user = await userActions.getUserById(userId);
    if (!user.isBookPass || !user.bookPassExpiry) {
        return false;
    }
    const expiry = new Date(user.bookPassExpiry).getTime();
    return expiry > Date.now();
  },
  getAllUsers: async (): Promise<User[]> => {
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.USERS
    );
    return res.documents as unknown as User[];
  }
};
