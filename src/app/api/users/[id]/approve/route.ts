import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminDb.collection("users").doc(params.id).update({
      status: "verified",
      verified: true,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: params.id, message: "User approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { error: "Failed to approve user" },
      { status: 500 }
    );
  }
}
