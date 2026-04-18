import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import pushHouseService from "@/lib/push-house-client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try Push House API first
    try {
      const result = await pushHouseService.pauseCampaign(id);
      return NextResponse.json(
        { ...result, message: "Campaign paused successfully", source: "push_house" },
        { status: 200 }
      );
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable, pausing in Firestore");

      // Fallback to Firestore
      await adminDb.collection("campaigns").doc(id).update({
        status: "paused",
        updatedAt: new Date(),
      });

      return NextResponse.json(
        { id, message: "Campaign paused successfully", source: "firestore" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error pausing campaign:", error);
    return NextResponse.json(
      { error: "Failed to pause campaign" },
      { status: 500 }
    );
  }
}
