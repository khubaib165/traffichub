import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * Example API route using Firebase Admin SDK
 * 
 * This route demonstrates server-side operations that require admin privileges.
 * Admin SDK can:
 * - Create/delete user accounts programmatically
 * - Set custom claims on users
 * - Delete users
 * - Access Firestore with elevated permissions
 * - Verify tokens server-side
 * 
 * @route GET /api/admin/verify-token
 */

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the token using admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);

    return NextResponse.json(
      {
        success: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);

    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
