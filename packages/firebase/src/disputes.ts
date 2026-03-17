import { databases, Query } from "./client";
import { FIREBASE_PROJECT_ID, COLLECTIONS } from "./config";
import type { Dispute, DisputeStatus } from "@rebookindia/types";

export const disputeActions = {
  createDispute: async (disputeData: Omit<Dispute, "createdAt">) => {
    return await databases.createDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.DISPUTES,
      disputeData.disputeId,
      {
        ...disputeData,
        status: "open",
        createdAt: new Date().toISOString(),
      }
    );
  },
  getDisputeById: async (disputeId: string): Promise<Dispute> => {
    return (await databases.getDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.DISPUTES,
      disputeId
    )) as unknown as Dispute;
  },
  getAllDisputes: async (status?: DisputeStatus): Promise<Dispute[]> => {
    const queries = status ? [Query.equal("status", status)] : [];
    const res = await databases.listDocuments(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.DISPUTES,
      queries
    );
    return res.documents as unknown as Dispute[];
  },
  updateDisputeStatus: async (disputeId: string, status: DisputeStatus, notes?: string) => {
    return await databases.updateDocument(
      FIREBASE_PROJECT_ID,
      COLLECTIONS.DISPUTES,
      disputeId,
      {
         status,
         ...(notes ? { adminNotes: notes } : {}),
         ...(status.startsWith("resolved") ? { resolvedAt: new Date().toISOString() } : {})
      }
    );
  },
  resolveWithRefund: async (disputeId: string, notes?: string) => {
    return await disputeActions.updateDisputeStatus(disputeId, "resolved_refund", notes);
  },
  resolveNoRefund: async (disputeId: string, notes?: string) => {
    return await disputeActions.updateDisputeStatus(disputeId, "resolved_no_refund", notes);
  }
};
