import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK only once
if (!admin.apps.length && process.env.FIREBASE_ADMIN_SDK_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

// Create lazy-loaded getters for admin services
let _adminAuth: admin.auth.Auth | undefined;
let _adminDb: admin.firestore.Firestore | undefined;
let _adminStorage: admin.storage.Storage | undefined;

export function getAdminAuth() {
  if (!_adminAuth && admin.apps.length > 0) {
    _adminAuth = admin.auth();
  }
  return _adminAuth;
}

export function getAdminDb() {
  if (!_adminDb && admin.apps.length > 0) {
    _adminDb = admin.firestore();
  }
  return _adminDb;
}

export function getAdminStorage() {
  if (!_adminStorage && admin.apps.length > 0) {
    _adminStorage = admin.storage();
  }
  return _adminStorage;
}

// For backward compatibility, create objects that work at runtime
export const adminAuth = admin.apps.length > 0 ? admin.auth() : ({} as any);
export const adminDb = admin.apps.length > 0 ? admin.firestore() : ({} as any);
export const adminStorage = admin.apps.length > 0 ? admin.storage() : ({} as any);

export default admin;
