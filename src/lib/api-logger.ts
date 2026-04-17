/**
 * API Request/Response Logging Utility
 * Provides comprehensive logging for all API interactions
 */

export interface ApiLogEntry {
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  duration: number; // milliseconds
  userId?: string;
  error?: string;
  source?: "push_house" | "firestore" | "fallback";
}

class ApiLogger {
  private logs: ApiLogEntry[] = [];
  private maxLogs = 1000;

  log(entry: ApiLogEntry) {
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      const statusColor =
        entry.status >= 200 && entry.status < 300
          ? "color: green"
          : entry.status >= 400
            ? "color: red"
            : "color: orange";

      console.log(
        `%c[${entry.method}] ${entry.endpoint} ${entry.status} (${entry.duration}ms)`,
        statusColor
      );

      if (entry.error) {
        console.error(`  Error: ${entry.error}`);
      }

      if (entry.source) {
        console.log(`  Source: ${entry.source}`);
      }
    }
  }

  getLogs(filter?: { endpoint?: string; method?: string }): ApiLogEntry[] {
    if (!filter) return this.logs;

    return this.logs.filter((log) => {
      if (filter.endpoint && !log.endpoint.includes(filter.endpoint)) return false;
      if (filter.method && log.method !== filter.method) return false;
      return true;
    });
  }

  clear() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getStats() {
    const total = this.logs.length;
    const errors = this.logs.filter((l) => l.status >= 400).length;
    const success = this.logs.filter((l) => l.status >= 200 && l.status < 300).length;
    const avgDuration = this.logs.length > 0 ? this.logs.reduce((sum, l) => sum + l.duration, 0) / this.logs.length : 0;

    return { total, errors, success, avgDuration };
  }
}

export const apiLogger = new ApiLogger();

/**
 * Enhanced fetch wrapper with logging and error handling
 */
export async function fetchWithLogging(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const startTime = performance.now();
  const method = options.method || "GET";

  try {
    const response = await fetch(url, options);
    const duration = performance.now() - startTime;

    // Parse response to detect source
    let source: "push_house" | "firestore" | "fallback" | undefined;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        // Note: We could check response body for source indicator
      }
    } catch {
      // Ignore
    }

    const status = response.status;

    apiLogger.log({
      timestamp: new Date().toISOString(),
      endpoint: url,
      method,
      status,
      duration,
      source,
    });

    return response;
  } catch (error) {
    const duration = performance.now() - startTime;

    apiLogger.log({
      timestamp: new Date().toISOString(),
      endpoint: url,
      method,
      status: 0,
      duration,
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}

/**
 * API Response wrapper with source detection
 */
export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  source?: "push_house" | "firestore" | "fallback";
  warning?: string;
}

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");
  const isProbablyJson = contentType?.includes("application/json");

  try {
    if (isProbablyJson) {
      const data = await response.json();

      return {
        ok: response.ok,
        status: response.status,
        data: data.data || data,
        error: !response.ok ? data.error : undefined,
        source: data.source,
        warning: data.warning,
      };
    } else {
      const text = await response.text();

      return {
        ok: response.ok,
        status: response.status,
        data: text as any,
        error: !response.ok ? text : undefined,
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: response.status,
      error: error instanceof Error ? error.message : "Failed to parse response",
    };
  }
}

/**
 * Client-side API request helper
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `/api${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  try {
    const response = await fetchWithLogging(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    return handleApiResponse<T>(response);
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export default apiLogger;
