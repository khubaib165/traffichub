import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(_request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query: any = adminDb.collection("users");

    // Apply filters
    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    // Order by creation date (descending)
    query = query.orderBy("createdAt", "desc");

    // Get total count
    const countSnapshot = await query.get();
    const total = countSnapshot.size;

    // Apply pagination
    let paginatedQuery = query.limit(limit);
    
    if (offset > 0) {
      const skipSnapshot = await query.limit(offset).get();
      if (skipSnapshot.docs.length > 0) {
        const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
        paginatedQuery = query.startAfter(lastDoc).limit(limit);
      }
    }

    const querySnapshot = await paginatedQuery.get();

    const users = querySnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || "",
        name: data.name || "User",
        role: data.role || "user",
        status: data.status || "active",
        verified: data.verified || false,
        balance: data.balance || 0,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        ...data,
      };
    });

    return NextResponse.json({ users, total, limit, offset });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : String(error),
        users: [], // Return empty array as fallback
        total: 0,
      },
      { status: 200 } // Return 200 so UI can handle gracefully
    );
  }
}
