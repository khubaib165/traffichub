import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "@/lib/firebase";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import pushHouseService from "@/lib/push-house-client";

const db = getFirestore(initializeApp());

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try Push House API first
    try {
      const result = await pushHouseService.getAudience(id);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for getting audience, checking Firestore");

      // Fallback to Firestore
      const audienceRef = doc(db, "audiences", id);
      const snapshot = await getDoc(audienceRef);

      if (!snapshot.exists()) {
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
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Try Push House API first
    try {
      const result = await pushHouseService.updateAudience(id, body);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for updating audience, updating Firestore");

      // Fallback to Firestore
      const audienceRef = doc(db, "audiences", id);
      await updateDoc(audienceRef, {
        ...body,
        updatedAt: Timestamp.now(),
      });

      const updated = await getDoc(audienceRef);
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try Push House API first
    try {
      const result = await pushHouseService.deleteAudience(id);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for deleting audience, deleting from Firestore");

      // Fallback to Firestore
      const audienceRef = doc(db, "audiences", id);
      await deleteDoc(audienceRef);

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
