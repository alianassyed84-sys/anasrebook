import { storage, ID } from "./client";
import { BUCKETS } from "./config";

export const storageActions = {
  uploadFile: async (bucketId: string, file: File) => {
    return await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );
  },
  getFileUrl: (bucketId: string, fileId: string) => {
    return storage.getFileView(bucketId, fileId).toString();
  },
  deleteFile: async (bucketId: string, fileId: string) => {
    return await storage.deleteFile(bucketId, fileId);
  },
  uploadBookImage: async (file: File) => {
    return await storageActions.uploadFile(BUCKETS.BOOK_IMAGES, file);
  },
  uploadKYCDocument: async (file: File) => {
    return await storageActions.uploadFile(BUCKETS.VENDOR_KYC_DOCS, file);
  },
  uploadProfilePhoto: async (file: File) => {
    return await storageActions.uploadFile(BUCKETS.PROFILE_PHOTOS, file);
  }
};
