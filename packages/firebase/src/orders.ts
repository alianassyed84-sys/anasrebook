import { databases, Query } from "./client";
import { FIREBASE_PROJECT_ID, COLLECTIONS } from "./config";
import type { Order, OrderStatus } from "@rebookindia/types";

export const orderActions = {
  createOrder: async (orderData: Omit<Order, "createdAt" | "updatedAt">) => {
    return await databases.createDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      orderData.orderId,
      {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
  },
  getOrderById: async (orderId: string): Promise<Order> => {
    return (await databases.getDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      orderId
    )) as unknown as Order;
  },
  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      [Query.equal("userId", userId), Query.orderDesc("createdAt")]
    );
    return res.documents as unknown as Order[];
  },
  getOrdersByVendor: async (vendorId: string): Promise<Order[]> => {
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      [Query.equal("vendorId", vendorId), Query.orderDesc("createdAt")]
    );
    return res.documents as unknown as Order[];
  },
  getAllOrders: async (filters: string[] = []): Promise<Order[]> => {
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      filters
    );
    return res.documents as unknown as Order[];
  },
  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    const updatePayload: Partial<Order> = { orderStatus: status, updatedAt: new Date().toISOString() };
    if (status === "delivered") {
        updatePayload.deliveredAt = new Date().toISOString();
    }
    return await databases.updateDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      orderId,
      updatePayload
    );
  },
  releaseVendorPayout: async (orderId: string) => {
    return await databases.updateDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.ORDERS,
      orderId,
      {
        isPayoutReleased: true,
        payoutReleasedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
  },
  getOrderStats: async () => {
    // Note: robust stats usually requires a Cloud Function or separate aggregation collection.
    // For now, returning basic dummy wrapper.
    return {
       totalOrders: 0,
       totalRevenue: 0
    };
  }
};
