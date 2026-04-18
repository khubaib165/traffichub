import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export async function GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(_request.url);
    const campaignId = searchParams.get("campaignId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const type = searchParams.get("type") || "general";

    const params: Record<string, any> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    let response;

    if (campaignId) {
      response = await pushHouseService.getCampaignStats(campaignId, params);
    } else if (type === "network") {
      response = await pushHouseService.getNetworkStats(params);
    } else if (type === "traffic") {
      response = await pushHouseService.getTrafficByCountry(params);
    } else {
      response = await pushHouseService.getStats(params);
    }

    return NextResponse.json(
      {
        stats: (response as any).stats || response,
        source: "push_house",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch real stats from Push House API",
        message: errorMsg,
        stats: null,
        source: "none",
      },
      { status: 500 }
    );
  }
}
