import { databases, ID, Query } from "./client";
import { APPWRITE_DB_ID, COLLECTIONS } from "./config";
import type { Vendor } from "@rebookindia/types";

export const vendorActions = {
  createVendor: async (vendorData: Omit<Vendor, "createdAt">) => {
    return await databases.createDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.VENDORS,
      vendorData.vendorId,
      {
        ...vendorData,
        createdAt: new Date().toISOString(),
      }
    );
  },
  getVendorById: async (vendorId: string): Promise<Vendor> => {
    return (await databases.getDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.VENDORS,
      vendorId
    )) as unknown as Vendor;
  },
  getVendorByUserId: async (userId: string): Promise<Vendor | null> => {
    const res = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.VENDORS,
      [Query.equal("userId", userId), Query.limit(1)]
    );
    return res.documents.length > 0 ? (res.documents[0] as unknown as Vendor) : null;
  },
  updateVendor: async (vendorId: string, data: Partial<Vendor>) => {
    return await databases.updateDocument(
      APPWRITE_DB_ID,
      COLLECTIONS.VENDORS,
      vendorId,
      data
    );
  },
  getAllVendors: async (filters: string[] = []): Promise<Vendor[]> => {
    const res = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.VENDORS,
      filters
    );
    return res.documents as unknown as Vendor[];
  },
  getPendingVendors: async (): Promise<Vendor[]> => {
    return await vendorActions.getAllVendors([Query.equal("status", "pending")]);
  },
  approveVendor: async (vendorId: string) => {
    return await vendorActions.updateVendor(vendorId, { status: "approved" });
  },
  suspendVendor: async (vendorId: string) => {
    return await vendorActions.updateVendor(vendorId, { status: "suspended" });
  },
  updateVendorRating: async (vendorId: string, newRating: number, totalReviews: number) => {
    return await vendorActions.updateVendor(vendorId, { 
        rating: newRating,
        totalReviews: totalReviews
    });
  }
};
