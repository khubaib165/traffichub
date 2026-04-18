import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await adminDb.collection("campaigns").doc(id).update({
      status: "active",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id, message: "Campaign approved successfully" },
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
