import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const doc = await adminDb.collection("admin").doc("settings").get();

    if (!doc.exists) {
      // Return default settings if none exist
      return NextResponse.json({
        commissionRate: 30,
        minBudget: 10,
        maxBudget: 10000,
        enableRegistrations: true,
        maintenanceMode: false,
      });
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();

    console.log("📝 Saving admin settings:", settings);

    // Validate settings
    if (
      typeof settings.commissionRate !== "number" ||
      typeof settings.minBudget !== "number" ||
      typeof settings.maxBudget !== "number"
    ) {
      console.error("❌ Invalid settings format:", settings);
      return NextResponse.json(
        { error: "Invalid settings format" },
        { status: 400 }
      );
    }

    // Save settings to Firestore
    const settingsData = {
      ...settings,
      updatedAt: new Date(),
      updatedBy: "admin",
    };

    await adminDb.collection("admin").doc("settings").set(settingsData);

    console.log("✅ Settings saved successfully to Firestore");

    return NextResponse.json({
      message: "Settings saved successfully",
      settings: settingsData,
    });
  } catch (error) {
    console.error("❌ Error saving settings:", error);
    return NextResponse.json(
      {
        error: "Failed to save settings",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
