import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await adminDb.collection("users").doc(id).update({
      status: "suspended",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id, message: "User suspended successfully" },
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
