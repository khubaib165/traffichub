import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminDb.collection("campaigns").doc(params.id).update({
      status: "active",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: params.id, message: "Campaign approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving campaign:", error);
    return NextResponse.json(
      { error: "Failed to approve campaign" },
      { status: 500 }
    );
  }
}
