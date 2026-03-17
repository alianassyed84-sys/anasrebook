import { databases, Query } from "./client";
import { FIREBASE_PROJECT_ID, COLLECTIONS } from "./config";
import type { Review } from "@rebookindia/types";

export const reviewActions = {
  createReview: async (reviewData: Omit<Review, "createdAt">) => {
    return await databases.createDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.REVIEWS,
      reviewData.reviewId,
      {
        ...reviewData,
        createdAt: new Date().toISOString(),
      }
    );
  },
  getReviewsByVendor: async (vendorId: string): Promise<Review[]> => {
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.REVIEWS,
      [Query.equal("vendorId", vendorId), Query.orderDesc("createdAt")]
    );
    return res.documents as unknown as Review[];
  },
  getReviewByOrder: async (orderId: string): Promise<Review | null> => {
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.REVIEWS,
      [Query.equal("orderId", orderId), Query.limit(1)]
    );
    return res.documents.length > 0 ? (res.documents[0] as unknown as Review) : null;
  },
  calculateVendorRating: async (vendorId: string) => {
    const reviews = await reviewActions.getReviewsByVendor(vendorId);
    if (!reviews || reviews.length === 0) return { rating: 0, totalReviews: 0 };
    
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return {
        rating: sum / reviews.length,
        totalReviews: reviews.length
    };
  }
};
