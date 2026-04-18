"use client";

import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/lib/store";
import { User } from "@/lib/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is logged in - fetch their profile from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: userData.name || firebaseUser.displayName || "User",
              role: userData.role || "advertiser",
              avatar: userData.avatar,
              company: userData.company,
              verified: userData.verified || false,
              createdAt: userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date(),
              updatedAt: userData.updatedAt?.toDate ? userData.updatedAt.toDate() : new Date(),
            };
            setUser(user);
          } else {
            // User doc doesn't exist yet, create minimal user object
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User",
              role: "advertiser",
              verified: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setUser(user);
          }
        } else {
          // User is logged out
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setIsLoading]);

  return <>{children}</>;
};
