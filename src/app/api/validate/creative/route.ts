import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import pushHouseService from "@/lib/push-house-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Creative data is required", valid: false },
        { status: 400 }
      );
    }

    // Basic local validation first
    const hasTitle = body.title || body.name;
    const hasContent = body.content || body.description;
    const hasImage = body.imageUrl || body.image;

    if (!hasTitle) {
      return NextResponse.json(
        { valid: false, message: "Creative title is required" },
        { status: 200 }
      );
    }

    // Try Push House API validation
    try {
      const result = await pushHouseService.validateCreative(body);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House creative validation unavailable, using local validation");
      // Fallback to basic validation
      return NextResponse.json(
        {
          valid: hasTitle && (hasContent || hasImage),
          message: "Local validation only",
          source: "fallback",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error validating creative:", error);
    return NextResponse.json(
      { error: "Failed to validate creative", valid: false },
      { status: 500 }
    );
  }
}
