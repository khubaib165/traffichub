import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";

export async function GET(_request: NextRequest) {
  try {
    console.log("🌐 [Countries API] Fetching real country data from Push House...");

    // Use the correct endpoint discovered in OpenAPI docs: /v1/collections/countries
    const response = await pushHouseService.getCountries();

    console.log("✅ Successfully fetched countries from Push House");
    console.log("📊 Countries count:", response.data?.length || 0);

    // Transform to display actual pricing data from the API
    const transformedData = response.data.map((country: any) => {
      const prices = country.prices || {};
      const minPrices = prices.min || { push: 0, inpage: 0, pop: 0 };
      const maxPrices = prices.max || { push: 0, inpage: 0, pop: 0 };

      // Return actual pricing data from API, not calculated/random data
      return {
        id: country.id,
        name: country.name,
        iso: country.iso,
        // Real pricing from Push House API for each vertical
        pricing: {
          push: { min: minPrices.push, max: maxPrices.push },
          inpage: { min: minPrices.inpage, max: maxPrices.inpage },
          pop: { min: minPrices.pop, max: maxPrices.pop },
        },
        // Available verticals (from API - this is what's available)
        verticals: ["Push Ads", "Inpage Ads", "Pop Ads"],
        // Note: Real CPC, clicks, and category-specific verticals (Sweepstakes, Dating, etc.)
        // require partner-level API access or dashboard authentication
      };
    });

    return NextResponse.json({
      data: transformedData,
      source: "push_house",
      note: "CPC and click data require partner-level API authentication. Pricing data is from /v1/collections/countries endpoint.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ [Countries API] Error:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to fetch countries from Push House API",
        message: errorMessage,
        data: [],
        debug: {
          timestamp: new Date().toISOString(),
          endpoint: "/v1/collections/countries",
        },
      },
      { status: 500 }
    );
  }
}
