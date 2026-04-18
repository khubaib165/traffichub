import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    await adminDb.collection("campaigns").doc(id).update({
      status: "rejected",
      rejectionReason: reason || "Rejected by admin",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id, message: "Campaign rejected successfully" },
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
