import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await adminDb.collection("users").doc(params.id).update({
      status: "suspended",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: params.id, message: "User suspended successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error suspending user:", error);
    return NextResponse.json(
      { error: "Failed to suspend user" },
      { status: 500 }
    );
  }
}
