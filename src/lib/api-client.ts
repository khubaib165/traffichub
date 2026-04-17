import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiResponse } from "./types";

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string | undefined;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_PUSHHOUSE_API_URL || "") {
    this.baseURL = baseURL;
    this.apiKey = process.env.PUSHHOUSE_API_KEY;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add interceptor for auth
    this.client.interceptors.request.use((config) => {
      if (this.apiKey) {
        config.headers.Authorization = `Bearer ${this.apiKey}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          if (typeof window !== "undefined") {
            // Clear auth and redirect
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    const message = error.response?.data?.message || error.message || "An error occurred";
    return {
      success: false,
      error: message,
    };
  }
}

export const pushHouseApi = new ApiClient();

// Push.House API specific methods
export const pushHouseService = {
  // Campaigns
  async getCampaigns(filters?: Record<string, any>) {
    return pushHouseApi.get("/campaigns", { params: filters });
  },

  async getCampaign(id: string) {
    return pushHouseApi.get(`/campaigns/${id}`);
  },

  async createCampaign(data: any) {
    return pushHouseApi.post("/campaigns", data);
  },

  async updateCampaign(id: string, data: any) {
    return pushHouseApi.put(`/campaigns/${id}`, data);
  },

  async pauseCampaign(id: string) {
    return pushHouseApi.post(`/campaigns/${id}/pause`);
  },

  async resumeCampaign(id: string) {
    return pushHouseApi.post(`/campaigns/${id}/resume`);
  },

  async deleteCampaign(id: string) {
    return pushHouseApi.delete(`/campaigns/${id}`);
  },

  // Stats
  async getCampaignStats(campaignId: string, dateRange?: { from: string; to: string }) {
    return pushHouseApi.get(`/campaigns/${campaignId}/stats`, { params: dateRange });
  },

  async getNetworkStats(dateRange?: { from: string; to: string }) {
    return pushHouseApi.get("/stats/network", { params: dateRange });
  },

  async getTrafficByCountry(campaignId?: string, dateRange?: { from: string; to: string }) {
    return pushHouseApi.get("/stats/traffic/country", {
      params: { campaignId, ...dateRange },
    });
  },

  // Formats
  async getAvailableFormats() {
    return pushHouseApi.get("/formats");
  },

  // Networks
  async getAvailableNetworks(filters?: Record<string, any>) {
    return pushHouseApi.get("/networks", { params: filters });
  },

  // Traffic
  async getTrafficVolume(filters?: Record<string, any>) {
    return pushHouseApi.get("/traffic/volume", { params: filters });
  },

  // Validation
  async validateUrl(url: string) {
    return pushHouseApi.post("/validate/url", { url });
  },

  async validateCreative(creative: any) {
    return pushHouseApi.post("/validate/creative", creative);
  },
};

export default pushHouseApi;
