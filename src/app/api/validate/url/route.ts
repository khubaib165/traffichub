import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required", valid: false },
        { status: 400 }
      );
    }

    // Validate URL format locally first
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { valid: false, message: "Invalid URL format" },
        { status: 200 }
      );
    }

    // Try Push House API validation
    try {
      const result = await pushHouseService.validateUrl(url);
      return NextResponse.json(result, { status: 200 });
    } catch (pushHouseError) {
      console.warn("Push House URL validation unavailable, using local validation");
      // Fallback to basic validation
      return NextResponse.json(
        {
          valid: /^https?:\/\/.+\..+/.test(url),
          message: "Local validation only",
          source: "fallback",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error validating URL:", error);
    return NextResponse.json(
      { error: "Failed to validate URL", valid: false },
      { status: 500 }
    );
  }
}
