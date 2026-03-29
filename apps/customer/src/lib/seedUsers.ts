import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function seedDemoUsers() {
  try {
    // Vendor document
    const vRef = doc(db, "vendors", "demo-vendor");
    const vSnap = await getDoc(vRef);
    if (!vSnap.exists()) {
      await setDoc(vRef, {
        uid:             "demo-vendor",
        shopName:        "PaperShop Books",
        ownerName:       "Test Vendor",
        email:           "vendor@rebookindia.in",
        phone:           "9000000000",
        city:            "Hyderabad",
        state:           "Telangana",
        pincode:         "500001",
        status:          "approved",
        subscriptionPlan: "gold",
        commissionRate:  10,
        rating:          4.8,
        totalReviews:    24,
        totalSales:      150,
        totalEarnings:   45000,
        pendingPayout:   3200,
        createdAt:       serverTimestamp(),
      });
    }
    console.log("✅ Demo users seeded!");
  } catch (e) {
    console.error("User seed error:", e);
  }
}
