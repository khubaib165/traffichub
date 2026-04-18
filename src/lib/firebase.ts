import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";    
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,      
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let isInitialized = false;

// Only initialize Firebase in browser environment
if (typeof window !== "undefined") {
  try {
    // Check if all required environment variables are present
    if (
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
    ) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      isInitialized = true;

      // Connect to emulator in development (optional)
      if (process.env.NODE_ENV === "development") {
        try {
          if (!auth.currentUser) {
            connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
          }
        } catch (error) {
          // Emulator already connected
        }
      }
    } else {
      console.warn("Firebase configuration incomplete - missing required environment variables");
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
}

export { app, auth, db, storage, isInitialized };
export default app;
