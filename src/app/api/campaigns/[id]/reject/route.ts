import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason } = await request.json();

    await adminDb.collection("campaigns").doc(params.id).update({
      status: "rejected",
      rejectionReason: reason || "Rejected by admin",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: params.id, message: "Campaign rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting campaign:", error);
    return NextResponse.json(
      { error: "Failed to reject campaign" },
      { status: 500 }
    );
  }
}
