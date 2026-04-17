# TrafficFlow API Endpoints Configuration

## Overview

All API endpoints have been configured and integrated with Push House API with intelligent fallback to Firestore. The backend services have automatic error recovery and comprehensive logging.

## API Endpoint Directory

### Base URLs
- **Push House API**: `https://api.push.house/v1`
- **Backend API**: `/api`
- **Dev Server**: `http://localhost:3002` (currently running)

---

## 1. AUDIENCES ENDPOINTS

### List All Audiences
**Endpoint:** `GET /api/audiences`

**Query Parameters:**
- `country` (optional): Filter by country
- `format` (optional): Filter by format

**Response:** `{ audiences: PushHouseAudience[], source: "push_house" | "firestore" }`

**Usage:**
```bash
curl -X GET http://localhost:3002/api/audiences
```

---

### Get Audience by ID
**Endpoint:** `GET /api/audiences/:id`

**Response:** `{ data: PushHouseAudience, source: "push_house" | "firestore" }`

---

### Create Audience
**Endpoint:** `POST /api/audiences`

**Request Body:**
```json
{
  "name": "My Audience",
  "description": "Optional description"
}
```

**Response:** `{ data: PushHouseAudience, source: "push_house" | "firestore" }`

---

### Update Audience
**Endpoint:** `PATCH /api/audiences/:id`

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** `{ data: PushHouseAudience, source: "push_house" | "firestore" }`

---

### Delete Audience
**Endpoint:** `DELETE /api/audiences/:id`

**Response:** `{ success: true, source: "push_house" | "firestore" }`

---

## 2. CAMPAIGNS ENDPOINTS

### List All Campaigns
**Endpoint:** `GET /api/campaigns`

**Query Parameters:**
- `status` (optional): Filter by status (active, paused, draft, etc.)
- `userId` (optional): Filter by user ID
- `limit` (optional, default: 50): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "campaigns": [Campaign],
  "total": 100,
  "limit": 50,
  "offset": 0,
  "source": "push_house" | "firestore"
}
```

---

### Get Campaign by ID
**Endpoint:** `GET /api/campaigns/:id`

**Response:**
```json
{
  "id": "campaign_id",
  "name": "Campaign Name",
  "status": "active",
  "budget": 100,
  "source": "push_house" | "firestore"
}
```

---

### Create Campaign
**Endpoint:** `POST /api/campaigns`

**Request Body:**
```json
{
  "userId": "user_id",
  "name": "Campaign Name",
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
    "city": "New York",
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
    "total": null,
    "dailyClicksLimit": null
  },
  "schedule": {
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null
  },
  "creative": {
    "name": "Banner Name",
    "size": "300x250",
    "category": "mainstream"
  },
  "conversionType": "all"
}
```

**Response:**
```json
{
  "id": "new_campaign_id",
  "message": "Campaign created successfully",
  "source": "push_house" | "firestore"
}
```

---

### Update Campaign
**Endpoint:** `PUT /api/campaigns/:id`

**Request Body:** Any campaign fields to update

**Response:**
```json
{
  "data": Campaign,
  "message": "Campaign updated successfully",
  "source": "push_house" | "firestore"
}
```

---

### Delete Campaign
**Endpoint:** `DELETE /api/campaigns/:id`

**Response:**
```json
{
  "id": "campaign_id",
  "message": "Campaign deleted successfully",
  "source": "push_house" | "firestore"
}
```

---

### Pause Campaign
**Endpoint:** `POST /api/campaigns/:id/pause`

**Response:**
```json
{
  "id": "campaign_id",
  "message": "Campaign paused successfully",
  "source": "push_house" | "firestore"
}
```

---

### Resume Campaign
**Endpoint:** `POST /api/campaigns/:id/resume`

**Response:**
```json
{
  "id": "campaign_id",
  "message": "Campaign resumed successfully",
  "source": "push_house" | "firestore"
}
```

---

### Get Campaign Statistics
**Endpoint:** `GET /api/campaigns/:id/stats`

**Query Parameters:**
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)

**Response:**
```json
{
  "stats": {
    "impressions": 10000,
    "clicks": 250,
    "spent": 12.50,
    "ctr": 2.5,
    "conversions": 15
  },
  "source": "push_house" | "fallback"
}
```

---

## 3. FORMATS ENDPOINTS

### List Available Formats
**Endpoint:** `GET /api/formats`

**Query Parameters:**
- `country` (optional): Filter by country

**Response:**
```json
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
  "source": "push_house" | "fallback"
}
```

---

## 4. NETWORKS ENDPOINTS

### List Available Networks
**Endpoint:** `GET /api/networks`

**Query Parameters:**
- `country` (optional): Filter by country
- `format` (optional): Filter by format
- `limit` (optional): Limit results

**Response:**
```json
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
  "source": "push_house" | "fallback"
}
```

---

## 5. STATISTICS ENDPOINTS

### Get General Statistics
**Endpoint:** `GET /api/stats`

**Query Parameters:**
- `from` (optional): Start date
- `to` (optional): End date
- `type` (optional): "general" | "network" | "traffic"

**Response:**
```json
{
  "stats": [
    {
      "campaignId": "1",
      "impressions": 10000,
      "clicks": 250,
      "spent": 12.50,
      "ctr": 2.5,
      "conversions": 15
    }
  ],
  "source": "push_house" | "fallback"
}
```

---

### Get Network Statistics
**Endpoint:** `GET /api/stats?type=network`

**Response:**
```json
{
  "stats": [NetworkStats],
  "source": "push_house" | "fallback"
}
```

---

### Get Traffic by Country
**Endpoint:** `GET /api/stats?type=traffic`

**Response:**
```json
{
  "stats": [
    {
      "country": "US",
      "traffic": 50000
    }
  ],
  "source": "push_house" | "fallback"
}
```

---

## 6. TRAFFIC ENDPOINTS

### Get Traffic Data
**Endpoint:** `GET /api/traffic`

**Query Parameters:**
- `campaignId` (optional): Filter by campaign
- `type` (optional): "volume" | "country" | "generic"
- `from` (optional): Start date
- `to` (optional): End date

**Response:**
```json
{
  "traffic": {
    "total": 150000,
    "byCountry": [
      {
        "country": "US",
        "traffic": 50000
      }
    ]
  },
  "source": "push_house" | "fallback"
}
```

---

### Get Traffic Volume
**Endpoint:** `GET /api/traffic?type=volume`

**Query Parameters:**
- `from` (optional): Start date
- `to` (optional): End date

**Response:**
```json
{
  "traffic": {
    "volume": 150000
  },
  "source": "push_house" | "fallback"
}
```

---

### Get Traffic by Country
**Endpoint:** `GET /api/traffic?type=country`

**Query Parameters:**
- `from` (optional): Start date
- `to` (optional): End date

**Response:**
```json
{
  "traffic": [
    {
      "country": "US",
      "traffic": 50000
    }
  ],
  "source": "push_house" | "fallback"
}
```

---

## 7. VALIDATION ENDPOINTS

### Validate URL
**Endpoint:** `POST /api/validate/url`

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "URL is valid",
  "source": "push_house" | "fallback"
}
```

---

### Validate Creative
**Endpoint:** `POST /api/validate/creative`

**Request Body:**
```json
{
  "title": "Banner Title",
  "content": "Banner content",
  "imageUrl": "https://example.com/image.jpg",
  "size": "300x250"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Creative is valid",
  "source": "push_house" | "fallback"
}
```

---

## 8. ADMIN ENDPOINTS

### Get Admin Settings
**Endpoint:** `GET /api/admin/settings`

**Response:**
```json
{
  "commissionRate": 20,
  "minBudget": 10,
  "maxBudget": 10000,
  "registrationEnabled": true,
  "maintenanceMode": false
}
```

---

### Save Admin Settings
**Endpoint:** `POST /api/admin/settings`

**Request Body:**
```json
{
  "commissionRate": 20,
  "minBudget": 10,
  "maxBudget": 10000,
  "registrationEnabled": true,
  "maintenanceMode": false
}
```

**Response:**
```json
{
  "message": "Settings saved successfully",
  "settings": {...}
}
```

---

## 9. USERS ENDPOINTS

### List All Users
**Endpoint:** `GET /api/users`

**Response:**
```json
{
  "users": [User],
  "total": 100
}
```

---

### Approve User
**Endpoint:** `POST /api/users/:id/approve`

**Response:**
```json
{
  "id": "user_id",
  "message": "User approved successfully"
}
```

---

### Suspend User
**Endpoint:** `POST /api/users/:id/suspend`

**Response:**
```json
{
  "id": "user_id",
  "message": "User suspended successfully"
}
```

---

## Error Handling

All endpoints implement graceful fallback:

1. **Primary**: Push House API (if available)
2. **Fallback**: Firestore database (for CRUD operations)
3. **Fallback**: Mock data (for read-only operations like formats, networks)

Error responses include:

```json
{
  "error": "Error message",
  "source": "push_house" | "firestore" | "fallback",
  "warning": "Additional context if applicable"
}
```

---

## Authentication

All requests to Push House API include:
- Header: `X-API-Token: {API_TOKEN}` (from `PUSHHOUSE_API_KEY` env var)
- Header: `Content-Type: application/json`

---

## Environment Variables

Required `.env.local` file:
```
PUSHHOUSE_API_KEY=41bae3126d9a47b987b7740de4f3b8b2
NEXT_PUBLIC_PUSHHOUSE_API_URL=https://api.push.house/v1
FIREBASE_PROJECT_ID=trafficflow-app
```

---

## Testing Endpoints

### Quick Test Example:
```bash
# List campaigns
curl -X GET http://localhost:3002/api/campaigns

# Create campaign
curl -X POST http://localhost:3002/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user123",
    "name":"Test Campaign",
    "targetUrl":"https://example.com",
    "dailyBudget":"100"
  }'

# Get campaign stats
curl -X GET http://localhost:3002/api/campaigns/campaign123/stats

# Validate URL
curl -X POST http://localhost:3002/api/validate/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## Frontend Integration Points

### Pages Using APIs:
- **Campaigns Page** (`/campaigns`): Uses `/api/campaigns` for CRUD
- **Campaign Create Page** (`/campaigns/create`): Uses `/api/campaigns` POST
- **Admin Page** (`/admin`): Uses `/api/admin/settings`, `/api/users`
- **Dashboard** (`/dashboard`): Uses `/api/stats`, `/api/campaigns/:id/stats`
- **Analytics** (`/analytics`): Uses `/api/stats`, `/api/traffic`
- **Wallet** (`/wallet`): Uses `/api/wallet` (if implemented)
- **Networks** (`/networks`): Uses `/api/networks`
- **Partners** (`/partners`): Uses `/api/users`, `/api/campaigns`

---

## API Request/Response Flow

```
Frontend Form
    ↓
POST /api/campaigns
    ↓
Try Push House API (v1/{endpoint})
    ↓ (if fails)
Fallback to Firestore
    ↓ (if applicable)
Return Response with source indicator
    ↓
Frontend Display + Toast Notification
```

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Push House API token valid and active
- [ ] Firestore database initialized
- [ ] Firebase Admin SDK credentials set
- [ ] CORS properly configured
- [ ] Rate limiting implemented (optional)
- [ ] Logging and monitoring set up (optional)
- [ ] Backup/restore plan documented

---

## Support & Debugging

For debugging API issues:
1. Check server logs: `npm run dev`
2. Check browser console for client-side errors
3. Verify Push House API token in environment
4. Test Firestore connectivity
5. Check network tab in browser dev tools

All endpoints log errors to console with prefix `Error fetching/creating [resource]`.

---

**Last Updated**: {{ timestamp }}
**Status**: ✅ All endpoints configured and tested
**Dev Server**: Running on http://localhost:3002

