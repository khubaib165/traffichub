import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, any> = {};

    if (searchParams.has("country")) {
      params.country = searchParams.get("country");
    }

    const response = await pushHouseService.getFormats(params);
    return NextResponse.json(
      {
        formats: response.formats || [],
        source: "push_house",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching formats:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch real formats from Push House API",
        message: errorMsg,
        formats: [],
        source: "none",
      },
      { status: 500 }
    );
  }
}
