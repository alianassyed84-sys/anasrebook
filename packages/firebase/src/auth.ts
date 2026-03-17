import { account, ID } from "./client";

export const authActions = {
  signUpWithEmail: async (email: string, password: string, name: string, phone: string) => {
    // Note: Firebase auth stores phone separately. 
    // Phone needs to be set properly in Firestore profile.
    const user = await account.create(ID.unique(), email, password, name);
    return user;
  },
  signInWithEmail: async (email: string, password: string) => {
    return await account.createEmailPasswordSession(email, password);
  },
  signOut: async () => {
    return await account.deleteSession("current");
  },
  getCurrentUser: async () => {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },
  updateProfile: async (name: string) => {
      // NOTE: Client SDK `updateProfile` equivalent is updateName, updatePrefs etc.
      return await account.updateName(name);
  }
};
