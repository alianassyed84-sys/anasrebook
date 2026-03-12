import { account, ID } from "./client";

export const authActions = {
  signUpWithEmail: async (email: string, password: string, name: string, phone: string) => {
    // Note: Appwrite creates phone separately or updates current user details. 
    // Phone needs to be set properly for Appwrite if needed, basic signUp here covers email/name.
    const user = await account.create(ID.unique(), email, password, name);
    // Setting phone might require updating the user via Server SDK depending on auth methods enabled, 
    // or by calling account.updatePhone if possible.
    return user;
  },
  signInWithEmail: async (email: string, password: string) => {
    return await account.createEmailPasswordSession(email, password);
  },
  signInWithPhone: async (phone: string) => {
    return await account.createPhoneToken(ID.unique(), phone);
  },
  verifyOTP: async (userId: string, otp: string) => {
    return await account.createSession(userId, otp);
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
