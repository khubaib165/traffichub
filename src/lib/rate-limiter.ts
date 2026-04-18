/**
 * Rate Limiting Middleware for API Routes
 * Implements token bucket algorithm
 */

interface RateLimitConfig {
  maxRequests: number;
  windowSize: number; // milliseconds
  keyPrefix?: string;
}

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      maxRequests: config.maxRequests || 100,
      windowSize: config.windowSize || 60000, // 1 minute default
      keyPrefix: config.keyPrefix || "rl:",
    };

    // Cleanup expired entries every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  /**
   * Check if request is within rate limit
   */
  isAllowed(identifier: string): boolean {
    const key = `${this.config.keyPrefix}${identifier}`;
    const now = Date.now();

    if (!this.store[key]) {
      // Initialize new entry
      this.store[key] = {
        tokens: this.config.maxRequests - 1,
        lastRefill: now,
      };
      return true;
    }

    const entry = this.store[key];
    const timePassed = now - entry.lastRefill;
    const tokensToAdd = (timePassed / this.config.windowSize) * this.config.maxRequests;

    // Refill tokens
    entry.tokens = Math.min(this.config.maxRequests, entry.tokens + tokensToAdd);
    entry.lastRefill = now;

    if (entry.tokens >= 1) {
      entry.tokens -= 1;
      return true;
    }

    return false;
  }

  /**
   * Get remaining tokens for identifier
   */
  getRemaining(identifier: string): number {
    const key = `${this.config.keyPrefix}${identifier}`;
    if (!this.store[key]) return this.config.maxRequests;
    return Math.floor(this.store[key].tokens);
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    const key = `${this.config.keyPrefix}${identifier}`;
    delete this.store[key];
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.store = {};
  }

  /**
   * Get statistics
   */
  getStats() {
    const keys = Object.keys(this.store);
    return {
      activeIdentifiers: keys.length,
      totalEntryCount: keys.length,
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    Object.keys(this.store).forEach((key) => {
      const entry = this.store[key];
      if (now - entry.lastRefill > maxAge) {
        delete this.store[key];
      }
    });
  }
}

// Global rate limiters for different endpoints
export const globalRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowSize: 60000, // 1 minute
});

export const campaignRateLimiter = new RateLimiter({
  maxRequests: 50,
  windowSize: 60000, // 1 minute
});

export const authRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowSize: 60000, // 1 minute
});

/**
 * Rate limit middleware for Next.js API routes
 */
export function withRateLimit(
  limiter: RateLimiter = globalRateLimiter
) {
  return (handler: Function) => {
    return async (request: any, context?: any) => {
      // Get identifier from IP or user ID
      const identifier =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        request.ip ||
        "unknown";

      if (!limiter.isAllowed(identifier)) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            retryAfter: 60,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
            },
          }
        );
      }

      // Add rate limit info to response headers
      const remaining = limiter.getRemaining(identifier);
      request.rateLimitRemaining = remaining;

      return handler(request, context);
    };
  };
}

/**
 * Extract client IP from request
 */
export function getClientIp(request: any): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.socket?.remoteAddress ||
    "unknown"
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  globalRateLimiter,
  campaignRateLimiter,
  authRateLimiter,
  withRateLimit,
  getClientIp,
};
