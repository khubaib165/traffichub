import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK only once (only if credentials available)
if (!admin.apps.length && process.env.FIREBASE_ADMIN_SDK_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.warn("Firebase Admin SDK initialization skipped (credentials not available for build)");
  }
}

// Export admin services safely - don't call them during build
export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as any);
export const adminDb = admin.apps.length > 0 ? admin.firestore() : ({} as any);
export const adminStorage = admin.apps.length > 0 ? admin.storage() : ({} as any);

export default admin;
