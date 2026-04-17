import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import pushHouseService from "@/lib/push-house-client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try Push House API first
    try {
      const result = await pushHouseService.resumeCampaign(id);
      return NextResponse.json(
        { ...result, message: "Campaign resumed successfully", source: "push_house" },
        { status: 200 }
      );
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable, resuming in Firestore");

      // Fallback to Firestore
      await adminDb.collection("campaigns").doc(id).update({
        status: "active",
        updatedAt: new Date(),
      });

      return NextResponse.json(
        { id, message: "Campaign resumed successfully", source: "firestore" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error resuming campaign:", error);
    return NextResponse.json(
      { error: "Failed to resume campaign" },
      { status: 500 }
    );
  }
}
