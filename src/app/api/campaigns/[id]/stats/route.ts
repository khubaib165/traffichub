import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const params_obj: Record<string, any> = {};
    if (from) params_obj.from = from;
    if (to) params_obj.to = to;

    const response = await pushHouseService.getCampaignStats(id, params_obj);

    return NextResponse.json(
      {
        stats: response.stats || response,
        source: "push_house",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching campaign stats:", error);

    // Return mock stats as fallback
    return NextResponse.json(
      {
        stats: {
          impressions: 10000,
          clicks: 250,
          spent: 12.50,
          ctr: 2.5,
          conversions: 15,
        },
        source: "fallback",
        warning: "Push House API unavailable",
      },
      { status: 200 }
    );
  }
}
