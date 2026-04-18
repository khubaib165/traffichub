import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import pushHouseService from "@/lib/push-house-client";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try Push House API first
    try {
      const result = await pushHouseService.getAudience(id);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for getting audience, checking Firestore");

      // Fallback to Firestore (Admin SDK)
      const snapshot = await adminDb.collection("audiences").doc(id).get();

      if (!snapshot.exists) {
        return NextResponse.json(
          { error: "Audience not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          data: {
            id: snapshot.id,
            ...snapshot.data(),
          },
          source: "firestore",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching audience:", error);
    return NextResponse.json(
      { error: "Failed to fetch audience" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Try Push House API first
    try {
      const result = await pushHouseService.updateAudience(id, body);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for updating audience, updating Firestore");

      // Fallback to Firestore (Admin SDK)
      await adminDb.collection("audiences").doc(id).update({
        ...body,
        updatedAt: new Date(),
      });

      const updated = await adminDb.collection("audiences").doc(id).get();
      return NextResponse.json(
        {
          data: {
            id: updated.id,
            ...updated.data(),
          },
          source: "firestore",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating audience:", error);
    return NextResponse.json(
      { error: "Failed to update audience" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try Push House API first
    try {
      const result = await pushHouseService.deleteAudience(id);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for deleting audience, deleting from Firestore");

      // Fallback to Firestore (Admin SDK)
      await adminDb.collection("audiences").doc(id).delete();

      return NextResponse.json(
        { success: true, source: "firestore" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error deleting audience:", error);
    return NextResponse.json(
      { error: "Failed to delete audience" },
      { status: 500 }
    );
  }
}
