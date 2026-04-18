import { NextRequest, NextResponse } from "next/server";
import pushHouseService from "@/lib/push-house-client";
import { adminDb } from "@/lib/firebase-admin";
import { campaignRateLimiter } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  // Check rate limit
  const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  if (!campaignRateLimiter.isAllowed(clientIp)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // First, try to fetch from Push House API
    try {
      const params: Record<string, any> = {
        limit,
        offset,
      };

      if (status && status !== "all") {
        params.status = status;
      }

      const response = await pushHouseService.get("/audiences", params);
      const audiences = Array.isArray(response) 
        ? response 
        : (response as any).audiences || (response as any).data || [];

      return NextResponse.json({
        campaigns: audiences.map((audience: any) => ({
          id: audience.id,
          name: audience.name || "Untitled",
          status: audience.status || "active",
          userId: userId || "unknown",
          totalBudget: 0,
          dailyBudget: 0,
          stats: {
            spend: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
          },
          createdAt: audience.createdAt || new Date(),
          updatedAt: audience.updatedAt || new Date(),
          ...audience,
        })),
        total: audiences.length,
        limit,
        offset,
        source: "push_house",
      });
    } catch (pushHouseError) {
      console.warn("Push House API failed, falling back to Firestore:", pushHouseError);

      // Fallback to Firestore if Push House fails
      let query: any = adminDb.collection("campaigns");

      try {
        if (status && status !== "all") {
          query = query.where("status", "==", status);
        }
        if (userId) {
          query = query.where("userId", "==", userId);
        }

        query = query.orderBy("createdAt", "desc");

        let paginatedQuery = query.limit(limit);

        if (offset > 0) {
          const skipSnapshot = await query.limit(offset).get();
          if (skipSnapshot.docs.length > 0) {
            const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
            paginatedQuery = query.startAfter(lastDoc).limit(limit);
          }
        }

        const querySnapshot = await paginatedQuery.get();
        var firestoreSnapshot = querySnapshot;
      } catch (firestoreError) {
        console.warn("Firestore query with orderBy failed, trying without ordering:", firestoreError);
        
        // Simple query without orderBy as fallback
        let simpleQuery: any = adminDb.collection("campaigns");
        
        if (status && status !== "all") {
          simpleQuery = simpleQuery.where("status", "==", status);
        }
        if (userId) {
          simpleQuery = simpleQuery.where("userId", "==", userId);
        }
        
        simpleQuery = simpleQuery.limit(limit);
        firestoreSnapshot = await simpleQuery.get();
      }

      const campaigns = firestoreSnapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Untitled Campaign",
          status: data.status || "draft",
          userId: data.userId || "",
          totalBudget: data.totalBudget || data.dailyBudget || 0,
          dailyBudget: data.dailyBudget || 0,
          stats: data.stats || {
            spend: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
          },
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(),
          endDate: data.endDate?.toDate ? data.endDate.toDate() : null,
          ...data,
        };
      });

      return NextResponse.json({
        campaigns,
        total: firestoreSnapshot.size,
        limit,
        offset,
        source: "firestore",
        warning: "Push House API unavailable",
      });
    }
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch campaigns",
        details: error instanceof Error ? error.message : String(error),
        campaigns: [],
        total: 0,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...campaignData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Try Push House API first
    try {
      const response = await pushHouseService.createCampaign({
        ...campaignData,
        userId,
      });

      return NextResponse.json(
        { 
          id: (response as any).id || (response as any).data?.id,
          message: "Campaign created successfully via Push House",
          source: "push_house",
        },
        { status: 201 }
      );
    } catch (pushHouseError) {
      console.warn("Push House creation failed, using Firestore:", pushHouseError);

      const docRef = await adminDb.collection("campaigns").add({
        ...campaignData,
        userId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        stats: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          ctr: 0,
          cpm: 0,
          cpc: 0,
          conversionRate: 0,
        },
      });

      return NextResponse.json(
        {
          id: docRef.id,
          message: "Campaign created successfully via Firestore",
          source: "firestore",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      {
        error: "Failed to create campaign",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
