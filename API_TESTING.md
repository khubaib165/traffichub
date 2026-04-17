# API Integration Testing Guide

## Overview
This document provides comprehensive testing procedures for all configured Push House API endpoints with fallback to Firestore.

## Testing Environment Setup

### Prerequisites
```bash
# Environment variables must be set in .env.local
PUSHHOUSE_API_KEY=41bae3126d9a47b987b7740de4f3b8b2
NEXT_PUBLIC_PUSHHOUSE_API_URL=https://api.push.house/v1
FIREBASE_PROJECT_ID=trafficflow-app
```

### Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3002
```

---

## 1. CAMPAIGNS ENDPOINT TESTS

### 1.1 List All Campaigns (GET)
**Endpoint:** `GET /api/campaigns`

**Test Cases:**

#### Test 1.1.1: List campaigns with no filters
```bash
curl -X GET http://localhost:3002/api/campaigns

# Expected Response:
{
  "campaigns": [{
    "id": "campaign_123",
    "name": "Campaign Name",
    "status": "active",
    "budget": 100,
    "stats": {
      "spend": 15.50,
      "clicks": 250,
      "conversions": 5,
      "ctr": 2.5,
      "cpc": 0.062
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-16T14:20:00Z"
  }],
  "total": 45,
  "limit": 50,
  "offset": 0,
  "source": "push_house"
}
```

**Verification:**
- ✓ Response status is 200
- ✓ campaigns array is present
- ✓ Each campaign has required fields
- ✓ source field indicates data source

#### Test 1.1.2: Filter by status
```bash
curl -X GET "http://localhost:3002/api/campaigns?status=active"

# Expected: Only active campaigns returned
```

**Verification:**
- ✓ All campaigns have status "active"
- ✓ Pagination info correct

#### Test 1.1.3: Pagination
```bash
curl -X GET "http://localhost:3002/api/campaigns?limit=10&offset=20"

# Expected: Returns 10 campaigns starting from offset 20
```

**Verification:**
- ✓ Response limit matches request
- ✓ Offset matches request
- ✓ Correct pagination data

---

### 1.2 Create Campaign (POST)
**Endpoint:** `POST /api/campaigns`

**Test 1.2.1: Valid Campaign Creation**
```bash
curl -X POST http://localhost:3002/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_12345",
    "name": "Test Campaign",
    "trafficType": "all",
    "formats": ["push", "banner"],
    "targetUrl": "https://example.com",
    "category": "mainstream",
    "payModel": "cpc",
    "sources": {
      "pushHouse": true,
      "partners": false
    },
    "targeting": {
      "country": "US",
      "city": "",
      "devices": ["desktop", "mobile"],
      "os": [],
      "browsers": []
    },
    "bidding": {
      "model": "cpc",
      "minCpc": 0.01,
      "maxCpc": 0.50
    },
    "budget": {
      "daily": 100,
      "total": 5000,
      "dailyClicksLimit": null
    },
    "schedule": {
      "startDate": "2024-04-16T00:00:00Z",
      "endDate": null
    },
    "creative": {
      "name": "Test Banner",
      "size": "300x250",
      "category": "mainstream"
    },
    "conversionType": "all"
  }'

# Expected Response (201):
{
  "id": "new_campaign_id_123",
  "message": "Campaign created successfully via Push House",
  "source": "push_house"
}
```

**Verification:**
- ✓ Status code is 201
- ✓ Response includes campaign ID
- ✓ Campaign appears in GET /api/campaigns list
- ✓ source field is accurate

**Test 1.2.2: Missing Required Fields**
```bash
curl -X POST http://localhost:3002/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign"
    # Missing userId, budget, targetUrl
  }'

# Expected Response (400):
{
  "error": "userId is required"
}
```

---

### 1.3 Get Campaign by ID (GET)
**Endpoint:** `GET /api/campaigns/:id`

**Test 1.3.1: Valid Campaign ID**
```bash
curl -X GET http://localhost:3002/api/campaigns/campaign_123

# Expected Response (200):
{
  "id": "campaign_123",
  "name": "Campaign Name",
  "status": "active",
  "budget": 100,
  "source": "push_house"
}
```

**Test 1.3.2: Invalid Campaign ID**
```bash
curl -X GET http://localhost:3002/api/campaigns/nonexistent_id

# Expected Response (404):
{
  "error": "Campaign not found"
}
```

---

### 1.4 Update Campaign (PUT)
**Endpoint:** `PUT /api/campaigns/:id`

**Test 1.4.1: Valid Update**
```bash
curl -X PUT http://localhost:3002/api/campaigns/campaign_123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Campaign Name",
    "status": "active"
  }'

# Expected Response (200):
{
  "data": {...updated_campaign...},
  "message": "Campaign updated successfully",
  "source": "push_house"
}
```

---

### 1.5 Pause Campaign (POST)
**Endpoint:** `POST /api/campaigns/:id/pause`

**Test 1.5.1: Pause Active Campaign**
```bash
curl -X POST http://localhost:3002/api/campaigns/campaign_123/pause

# Expected Response (200):
{
  "id": "campaign_123",
  "message": "Campaign paused successfully",
  "source": "push_house"
}

# Verification:
# - Campaign status changes to "paused"
# - GET /api/campaigns/campaign_123 returns status: "paused"
```

---

### 1.6 Resume Campaign (POST)
**Endpoint:** `POST /api/campaigns/:id/resume`

**Test 1.6.1: Resume Paused Campaign**
```bash
curl -X POST http://localhost:3002/api/campaigns/campaign_123/resume

# Expected Response (200):
{
  "id": "campaign_123",
  "message": "Campaign resumed successfully",
  "source": "push_house"
}

# Verification:
# - Campaign status changes to "active"
```

---

### 1.7 Delete Campaign (DELETE)
**Endpoint:** `DELETE /api/campaigns/:id`

**Test 1.7.1: Delete Campaign**
```bash
curl -X DELETE http://localhost:3002/api/campaigns/campaign_123

# Expected Response (200):
{
  "id": "campaign_123",
  "message": "Campaign deleted successfully",
  "source": "push_house"
}

# Verification:
# - GET /api/campaigns/campaign_123 returns 404
# - Campaign removed from GET /api/campaigns list
```

---

### 1.8 Campaign Statistics (GET)
**Endpoint:** `GET /api/campaigns/:id/stats`

**Test 1.8.1: Get Campaign Stats**
```bash
curl -X GET "http://localhost:3002/api/campaigns/campaign_123/stats"

# Expected Response (200):
{
  "stats": {
    "impressions": 10000,
    "clicks": 250,
    "spent": 12.50,
    "ctr": 2.5,
    "conversions": 15
  },
  "source": "push_house"
}
```

**Test 1.8.2: Get Campaign Stats with Date Range**
```bash
curl -X GET "http://localhost:3002/api/campaigns/campaign_123/stats?from=2024-04-01&to=2024-04-16"

# Expected: Stats filtered by date range
```

---

## 2. AUDIENCES ENDPOINT TESTS

### 2.1 List Audiences (GET)
```bash
curl -X GET http://localhost:3002/api/audiences

# Expected Response:
{
  "audiences": [{
    "id": "audience_123",
    "name": "US Desktop Users",
    "description": "Audience targeting US desktop visitors"
  }],
  "source": "push_house"
}
```

---

### 2.2 Create Audience (POST)
```bash
curl -X POST http://localhost:3002/api/audiences \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile Users",
    "description": "Users on mobile devices"
  }'

# Expected Response (201):
{
  "data": {
    "id": "new_audience_id",
    "name": "Mobile Users",
    "description": "Users on mobile devices",
    "status": "active"
  },
  "source": "push_house"
}
```

---

### 2.3 Update Audience (PATCH)
```bash
curl -X PATCH http://localhost:3002/api/audiences/audience_123 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Audience Name"
  }'

# Expected Response (200):
{
  "data": {...updated_audience...},
  "source": "push_house"
}
```

---

### 2.4 Delete Audience (DELETE)
```bash
curl -X DELETE http://localhost:3002/api/audiences/audience_123

# Expected Response (200):
{
  "success": true,
  "source": "push_house"
}
```

---

## 3. FORMATS ENDPOINT TESTS

### 3.1 List Formats (GET)
```bash
curl -X GET http://localhost:3002/api/formats

# Expected Response:
{
  "formats": [
    {
      "id": "1",
      "name": "Push Notification",
      "code": "push"
    },
    {
      "id": "2",
      "name": "In-Page",
      "code": "inpage"
    },
    {
      "id": "3",
      "name": "OnClick",
      "code": "onclick"
    },
    {
      "id": "4",
      "name": "Banner",
      "code": "banner"
    }
  ],
  "source": "push_house"
}
```

---

## 4. NETWORKS ENDPOINT TESTS

### 4.1 List Networks (GET)
```bash
curl -X GET http://localhost:3002/api/networks

# Expected Response:
{
  "networks": [
    {
      "id": "1",
      "name": "Push House Network",
      "code": "ph",
      "traffic": 50000,
      "cpc": 0.05
    }
  ],
  "source": "push_house"
}
```

### 4.2 Filter Networks by Country
```bash
curl -X GET "http://localhost:3002/api/networks?country=US"

# Expected: Networks filtered by country
```

---

## 5. STATISTICS ENDPOINT TESTS

### 5.1 Get General Stats (GET)
```bash
curl -X GET http://localhost:3002/api/stats

# Expected Response:
{
  "stats": [{
    "campaignId": "campaign_123",
    "impressions": 10000,
    "clicks": 250,
    "spent": 12.50,
    "ctr": 2.5,
    "conversions": 15
  }],
  "source": "push_house"
}
```

---

## 6. TRAFFIC ENDPOINT TESTS

### 6.1 Get Traffic Data (GET)
```bash
curl -X GET http://localhost:3002/api/traffic

# Expected Response:
{
  "traffic": {
    "total": 150000,
    "byCountry": [
      { "country": "US", "traffic": 50000 },
      { "country": "UK", "traffic": 30000 }
    ]
  },
  "source": "push_house"
}
```

### 6.2 Get Traffic by Country
```bash
curl -X GET "http://localhost:3002/api/traffic?type=country"

# Expected: Traffic breakdown by country
```

---

## 7. VALIDATION ENDPOINT TESTS

### 7.1 Validate URL (POST)
```bash
curl -X POST http://localhost:3002/api/validate/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Expected Response:
{
  "valid": true,
  "message": "URL is valid",
  "source": "push_house"
}
```

### 7.2 Invalid URL
```bash
curl -X POST http://localhost:3002/api/validate/url \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-url"}'

# Expected Response:
{
  "valid": false,
  "message": "Invalid URL format"
}
```

### 7.3 Validate Creative (POST)
```bash
curl -X POST http://localhost:3002/api/validate/creative \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Banner Title",
    "content": "Banner content",
    "imageUrl": "https://example.com/image.jpg",
    "size": "300x250"
  }'

# Expected Response:
{
  "valid": true,
  "message": "Creative is valid",
  "source": "push_house"
}
```

---

## 8. ERROR SCENARIOS

### 8.1 Rate Limit Exceeded (429)
After making >50 requests in 60 seconds:
```bash
curl -X GET http://localhost:3002/api/campaigns

# Expected Response (429):
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}

# Headers:
# Retry-After: 60
```

---

### 8.2 Server Errors (500)
```bash
# Expected Response (500):
{
  "error": "Failed to fetch campaigns",
  "campaigns": [],
  "total": 0
}
```

---

## 9. FALLBACK TESTING

### 9.1 Test Firestore Fallback
To test fallback behavior:

1. Stop Push House API (simulate outage)
2. Make API request:
```bash
curl -X GET http://localhost:3002/api/campaigns

# Expected: Uses Firestore, response includes:
{
  "campaigns": [...],
  "source": "firestore",
  "warning": "Push House API unavailable"
}
```

---

### 9.2 Test Mock Data Fallback
For endpoints that support mock data (formats, networks, traffic):

```bash
# Simulate API failure, should return mock data:
{
  "formats": [
    { "id": "1", "name": "Push Notification", "code": "push" },
    ...
  ],
  "source": "fallback",
  "warning": "Push House API unavailable"
}
```

---

## 10. INTEGRATION FLOW TESTS

### 10.1 Complete Campaign Lifecycle
1. ✓ Create campaign: `POST /api/campaigns`
2. ✓ Get campaign: `GET /api/campaigns/{id}`
3. ✓ Update campaign: `PUT /api/campaigns/{id}`
4. ✓ Get stats: `GET /api/campaigns/{id}/stats`
5. ✓ Pause campaign: `POST /api/campaigns/{id}/pause`
6. ✓ Resume campaign: `POST /api/campaigns/{id}/resume`
7. ✓ Delete campaign: `DELETE /api/campaigns/{id}`
8. ✓ Verify deleted: `GET /api/campaigns/{id}` → 404

### 10.2 Campaign with Audience
1. ✓ Create audience: `POST /api/audiences`
2. ✓ Create campaign targeting audience
3. ✓ Verify campaign created with audience targeting
4. ✓ Delete audience: `DELETE /api/audiences/{id}`

---

## 11. PERFORMANCE TESTING

### 11.1 Caching Test
```bash
# First request (cache miss)
time curl -X GET http://localhost:3002/api/formats

# Second request (cache hit - should be faster)
time curl -X GET http://localhost:3002/api/formats

# Time difference: Cache hit should be <50ms
```

### 11.2 Pagination Performance
```bash
# Test with large offset
curl -X GET "http://localhost:3002/api/campaigns?limit=100&offset=10000"

# Expected: Should complete within 2 seconds
```

---

## 12. LOGGING & DEBUGGING

### Access API Logs
Browser DevTools Console:
```javascript
// Get API logs
apiLogger.getLogs()

// Get stats
apiLogger.getStats()

// Export logs
console.save(apiLogger.exportLogs())
```

### Check Cache Status
```javascript
// Get cache stats
requestCache.getStats()

// Clear specific cache
invalidateCache("campaigns")

// Clear all cache
requestCache.clear()
```

### Check Rate Limit Status
```javascript
// Get stats
globalRateLimiter.getStats()

// Check remaining for IP
globalRateLimiter.getRemaining("192.168.1.1")
```

---

## Checklist

- [ ] All GET endpoints return 200 with correct data
- [ ] All POST endpoints return 201 with new resource ID
- [ ] All PUT endpoints return 200 with updated data
- [ ] All DELETE endpoints return 200 and remove resource
- [ ] Fallback to Firestore works when Push House unavailable
- [ ] Mock data returns when both APIs unavailable
- [ ] Rate limiting blocks after threshold
- [ ] Caching improves response time for repeated requests
- [ ] Pagination works with correct offsets
- [ ] Error messages are clear and helpful
- [ ] Response times within acceptable range (<1s for most endpoints)
- [ ] All required fields validated
- [ ] Response structure matches documentation

---

**Last Updated**: April 16, 2026
**Status**: Ready for Integration Testing
