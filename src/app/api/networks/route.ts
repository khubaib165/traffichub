import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, any> = {};

    if (searchParams.has("country")) {
      params.country = searchParams.get("country");
    }
    if (searchParams.has("format")) {
      params.format = searchParams.get("format");
    }
    if (searchParams.has("limit")) {
      params.limit = searchParams.get("limit");
    }

    const response = await pushHouseService.getNetworks(params);
    return NextResponse.json(
      {
        networks: response.networks || [],
        source: "push_house",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching networks:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch real networks from Push House API",
        message: errorMsg,
        networks: [],
        source: "none",
      },
      { status: 500 }
    );
  }
}
