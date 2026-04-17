import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const type = searchParams.get("type") || "volume";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const params: Record<string, any> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (campaignId) params.campaignId = campaignId;

    let response;

    if (type === "volume") {
      response = await pushHouseService.getTrafficVolume(params);
    } else if (type === "country") {
      response = await pushHouseService.getTrafficByCountry(params);
    } else {
      response = await pushHouseService.getTraffic(params);
    }

    return NextResponse.json(
      {
        traffic: response.traffic || response.volume || response,
        source: "push_house",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch real traffic data from Push House API",
        message: errorMsg,
        traffic: null,
        source: "none",
      },
      { status: 500 }
    );
  }
}
