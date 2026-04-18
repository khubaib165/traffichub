import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import app from "@/lib/firebase";
import pushHouseService from "@/lib/push-house-client";

const db = getFirestore(app);

export async function GET(_request: NextRequest) {
  try {
    // Try to get audiences from Push House API first
    try {
      const result = await pushHouseService.getAudiences();
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for audiences, falling back to Firestore");

      // Fallback to Firestore
      const audiencesRef = collection(db, "audiences");
      const q = query(
        audiencesRef,
        where("status", "!=", "deleted")
      );
      const snapshot = await getDocs(q);

      const audiences = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json(
        { audiences, source: "firestore" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching audiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch audiences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Audience name is required" },
        { status: 400 }
      );
    }

    // Try to create on Push House API first
    try {
      const result = await pushHouseService.createAudience(body);
      return NextResponse.json(result, { status: 201 });
    } catch (pushHouseError) {
      console.warn("Push House API temporarily unavailable for creating audience, saving to Firestore");

      // Fallback: Save to Firestore
      const audienceRef = collection(db, "audiences");
      const docRef = await addDoc(audienceRef, {
        name: body.name,
        description: body.description || "",
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json(
        {
          data: {
            id: docRef.id,
            name: body.name,
            description: body.description || "",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          source: "firestore",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating audience:", error);
    return NextResponse.json(
      { error: "Failed to create audience" },
      { status: 500 }
    );
  }
}
