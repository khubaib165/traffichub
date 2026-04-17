// Push House API Client
// API Documentation: https://api.push.house/

const PUSH_HOUSE_API_URL = "https://api.push.house/v1";
const API_TOKEN = process.env.PUSHHOUSE_API_KEY || "";

interface PushHouseRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function pushHouseApi<T = any>(
  endpoint: string,
  options: PushHouseRequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${PUSH_HOUSE_API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Set default headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-API-Token": API_TOKEN,
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Push House API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Push House API call failed:", error);
    throw error;
  }
}

export interface PushHouseAudience {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PushHouseCampaign {
  id: string;
  name: string;
  status: string;
  budget?: number;
  spent?: number;
  clicks?: number;
  impressions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PushHouseFormat {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface PushHouseNetwork {
  id: string;
  name: string;
  code: string;
  traffic: number;
  cpc?: number;
  cpm?: number;
}

export interface PushHouseStats {
  campaignId?: string;
  impressions: number;
  clicks: number;
  spent: number;
  ctc?: number;
  ctr?: number;
  conversions?: number;
}

export const pushHouseService = {
  // ===== AUDIENCES =====
  async getAudiences(
    params?: Record<string, string | number | boolean>
  ): Promise<{ audiences: PushHouseAudience[] }> {
    return pushHouseApi<{ audiences: PushHouseAudience[] }>(
      "/audiences",
      { params, method: "GET" }
    );
  },

  async getAudience(id: string): Promise<{ data: PushHouseAudience }> {
    return pushHouseApi<{ data: PushHouseAudience }>(
      `/audiences/${id}`,
      { method: "GET" }
    );
  },

  async createAudience(data: Partial<PushHouseAudience>): Promise<{ data: PushHouseAudience }> {
    return pushHouseApi<{ data: PushHouseAudience }>(
      "/audiences",
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async updateAudience(
    id: string,
    data: Partial<PushHouseAudience>
  ): Promise<{ data: PushHouseAudience }> {
    return pushHouseApi<{ data: PushHouseAudience }>(
      `/audiences/${id}`,
      { method: "PATCH", body: JSON.stringify(data) }
    );
  },

  async deleteAudience(id: string): Promise<{ success: boolean }> {
    return pushHouseApi<{ success: boolean }>(
      `/audiences/${id}`,
      { method: "DELETE" }
    );
  },

  // ===== CAMPAIGNS =====
  async getCampaigns(
    params?: Record<string, string | number | boolean>
  ): Promise<{ campaigns: PushHouseCampaign[] }> {
    return pushHouseApi<{ campaigns: PushHouseCampaign[] }>(
      "/campaigns",
      { params, method: "GET" }
    );
  },

  async getCampaign(id: string): Promise<{ data: PushHouseCampaign }> {
    return pushHouseApi<{ data: PushHouseCampaign }>(
      `/campaigns/${id}`,
      { method: "GET" }
    );
  },

  async createCampaign(data: Partial<PushHouseCampaign>): Promise<{ data: PushHouseCampaign }> {
    return pushHouseApi<{ data: PushHouseCampaign }>(
      "/campaigns",
      { method: "POST", body: JSON.stringify(data) }
    );
  },

  async updateCampaign(
    id: string,
    data: Partial<PushHouseCampaign>
  ): Promise<{ data: PushHouseCampaign }> {
    return pushHouseApi<{ data: PushHouseCampaign }>(
      `/campaigns/${id}`,
      { method: "PUT", body: JSON.stringify(data) }
    );
  },

  async deleteCampaign(id: string): Promise<{ success: boolean }> {
    return pushHouseApi<{ success: boolean }>(
      `/campaigns/${id}`,
      { method: "DELETE" }
    );
  },

  async pauseCampaign(id: string): Promise<{ data: PushHouseCampaign }> {
    return pushHouseApi<{ data: PushHouseCampaign }>(
      `/campaigns/${id}/pause`,
      { method: "POST" }
    );
  },

  async resumeCampaign(id: string): Promise<{ data: PushHouseCampaign }> {
    return pushHouseApi<{ data: PushHouseCampaign }>(
      `/campaigns/${id}/resume`,
      { method: "POST" }
    );
  },

  // ===== FORMATS =====
  async getFormats(
    params?: Record<string, string | number | boolean>
  ): Promise<{ formats: PushHouseFormat[] }> {
    return pushHouseApi<{ formats: PushHouseFormat[] }>(
      "/formats",
      { params, method: "GET" }
    );
  },

  // ===== NETWORKS =====
  async getNetworks(
    params?: Record<string, string | number | boolean>
  ): Promise<{ networks: PushHouseNetwork[] }> {
    return pushHouseApi<{ networks: PushHouseNetwork[] }>(
      "/networks",
      { params, method: "GET" }
    );
  },

  // ===== STATISTICS =====
  async getCampaignStats(
    campaignId: string,
    params?: Record<string, string | number | boolean>
  ): Promise<{ stats: PushHouseStats }> {
    return pushHouseApi<{ stats: PushHouseStats }>(
      `/campaigns/${campaignId}/stats`,
      { params, method: "GET" }
    );
  },

  async getStats(
    params?: Record<string, string | number | boolean>
  ): Promise<{ stats: PushHouseStats[] }> {
    return pushHouseApi<{ stats: PushHouseStats[] }>(
      "/stats",
      { params, method: "GET" }
    );
  },

  async getNetworkStats(
    params?: Record<string, string | number | boolean>
  ): Promise<{ stats: PushHouseStats[] }> {
    return pushHouseApi<{ stats: PushHouseStats[] }>(
      "/stats/network",
      { params, method: "GET" }
    );
  },

  async getTrafficByCountry(
    params?: Record<string, string | number | boolean>
  ): Promise<{ traffic: any[] }> {
    return pushHouseApi<{ traffic: any[] }>(
      "/stats/traffic/country",
      { params, method: "GET" }
    );
  },

  // ===== TRAFFIC =====
  async getTraffic(
    params?: Record<string, string | number | boolean>
  ): Promise<{ traffic: any[] }> {
    return pushHouseApi<{ traffic: any[] }>(
      "/traffic",
      { params, method: "GET" }
    );
  },

  async getTrafficVolume(
    params?: Record<string, string | number | boolean>
  ): Promise<{ volume: number }> {
    return pushHouseApi<{ volume: number }>(
      "/traffic/volume",
      { params, method: "GET" }
    );
  },

  // ===== VALIDATION =====
  async validateUrl(url: string): Promise<{ valid: boolean; message?: string }> {
    return pushHouseApi<{ valid: boolean; message?: string }>(
      "/validate/url",
      { method: "POST", body: JSON.stringify({ url }) }
    );
  },

  async validateCreative(creative: any): Promise<{ valid: boolean; message?: string }> {
    return pushHouseApi<{ valid: boolean; message?: string }>(
      "/validate/creative",
      { method: "POST", body: JSON.stringify(creative) }
    );
  },

  // ===== COLLECTIONS =====
  async getCountries(
    params?: Record<string, string | number | boolean>
  ): Promise<{ data: any[] }> {
    return pushHouseApi<{ data: any[] }>(
      "/collections/countries",
      { params, method: "GET" }
    );
  },

  // ===== GENERIC METHODS =====
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return pushHouseApi<T>(endpoint, { params, method: "GET" });
  },

  async post<T = any>(endpoint: string, body: any): Promise<T> {
    return pushHouseApi<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put<T = any>(endpoint: string, body: any): Promise<T> {
    return pushHouseApi<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async patch<T = any>(endpoint: string, body: any): Promise<T> {
    return pushHouseApi<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    return pushHouseApi<T>(endpoint, {
      method: "DELETE",
    });
  },
};

export default pushHouseService;
