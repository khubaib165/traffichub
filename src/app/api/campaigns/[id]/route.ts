import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import pushHouseService from "@/lib/push-house-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try Push House API first
    try {
      const result = await pushHouseService.getCampaign(id);
      return NextResponse.json(
        { ...result, source: "push_house" },
        { status: 200 }
      );
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable, checking Firestore");

      // Fallback to Firestore
      const docSnapshot = await adminDb
        .collection("campaigns")
        .doc(id)
        .get();

      if (!docSnapshot.exists) {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        );
      }

      const data = docSnapshot.data();
      return NextResponse.json({
        id: docSnapshot.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
        startDate: data?.startDate?.toDate() || new Date(),
        endDate: data?.endDate?.toDate() || null,
        source: "firestore",
      });
    }
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Try Push House API first
    try {
      const result = await pushHouseService.updateCampaign(id, body);
      return NextResponse.json(
        { ...result, message: "Campaign updated successfully", source: "push_house" },
        { status: 200 }
      );
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable, updating Firestore");

      // Fallback to Firestore
      await adminDb.collection("campaigns").doc(id).update({
        ...body,
        updatedAt: new Date(),
      });

      return NextResponse.json(
        { id, message: "Campaign updated successfully", source: "firestore" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try Push House API first
    try {
      const result = await pushHouseService.deleteCampaign(id);
      return NextResponse.json(
        { id, message: "Campaign deleted successfully", source: "push_house" },
        { status: 200 }
      );
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable, deleting from Firestore");

      // Fallback to Firestore
      await adminDb.collection("campaigns").doc(id).delete();

      return NextResponse.json(
        { id, message: "Campaign deleted successfully", source: "firestore" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
