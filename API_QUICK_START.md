# API Quick Start Guide

## Getting Started in 5 Minutes

### 1. Start Development Server
```bash
cd "c:\Users\Khubaib Hassan\Desktop\Traffichub.space"
npm run dev
```
Server runs on: **http://localhost:3000**

### 2. Environment Setup
Create `.env.local` with:
```
PUSHHOUSE_API_KEY=41bae3126d9a47b987b7740de4f3b8b2
NEXT_PUBLIC_PUSHHOUSE_API_URL=https://api.push.house/v1
FIREBASE_PROJECT_ID=trafficflow-app
```

---

## Basic API Calls

### Create a Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "name": "My Campaign",
    "targetUrl": "https://example.com",
    "dailyBudget": "100"
  }'
```

### List Campaigns
```bash
curl -X GET http://localhost:3000/api/campaigns
```

### Pause Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns/campaign_id/pause
```

### Resume Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns/campaign_id/resume
```

### Get Campaign Stats
```bash
curl -X GET http://localhost:3000/api/campaigns/campaign_id/stats
```

---

## Frontend Usage

### In React Components
```javascript
import { apiRequest } from "@/lib/api-logger";

// Make API request
const response = await apiRequest("/campaigns", {
  method: "POST",
  body: { name: "New Campaign", ... }
});

if (response.ok) {
  console.log("Campaign created:", response.data);
} else {
  console.error("Error:", response.error);
}
```

### Using Fetch
```javascript
const response = await fetch("/api/campaigns", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(campaignData)
});

const data = await response.json();
```

---

## All Endpoints (Quick Reference)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/:id` | Get campaign |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Delete campaign |
| POST | `/api/campaigns/:id/pause` | Pause campaign |
| POST | `/api/campaigns/:id/resume` | Resume campaign |
| GET | `/api/campaigns/:id/stats` | Campaign stats |
| GET | `/api/audiences` | List audiences |
| POST | `/api/audiences` | Create audience |
| GET | `/api/audiences/:id` | Get audience |
| PATCH | `/api/audiences/:id` | Update audience |
| DELETE | `/api/audiences/:id` | Delete audience |
| GET | `/api/formats` | List formats |
| GET | `/api/networks` | List networks |
| GET | `/api/stats` | Get statistics |
| GET | `/api/traffic` | Get traffic data |
| POST | `/api/validate/url` | Validate URL |
| POST | `/api/validate/creative` | Validate creative |
| GET/POST | `/api/admin/settings` | Admin settings |

---

## Debugging

### Check API Logs in Browser Console
```javascript
apiLogger.getLogs()
apiLogger.getStats()
```

### Check Cache Status
```javascript
requestCache.getStats()
requestCache.clear() // Clear all cache
```

### Check Rate Limits
```javascript
globalRateLimiter.getStats()
```

---

## Common Issues & Solutions

### Issue: "Rate limit exceeded"
**Solution**: Wait 60 seconds or check rate limit configuration

### Issue: Push House API unavailable
**Solution**: API automatically falls back to Firestore. Check server logs.

### Issue: Empty response
**Solution**: Check network tab in browser dev tools, verify request parameters

### Issue: CORS errors
**Solution**: Ensure API running on same host as frontend, or CORS configured

---

## Testing Endpoints

### Test GET
```bash
curl -X GET http://localhost:3000/api/campaigns
```

### Test POST
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","userId":"user1","targetUrl":"https://test.com","dailyBudget":"50"}'
```

### Test DELETE
```bash
curl -X DELETE http://localhost:3000/api/campaigns/campaign_id
```

---

## Response Examples

### Success Response
```json
{
  "campaigns": [...],
  "source": "push_house",
  "status": 200
}
```

### Error Response
```json
{
  "error": "Campaign not found",
  "status": 404
}
```

### Rate Limited Response
```json
{
  "error": "Rate limit exceeded",
  "status": 429,
  "retryAfter": 60
}
```

---

## Important Files

| File | Purpose |
|------|---------|
| `src/lib/push-house-client.ts` | Push House API client |
| `src/lib/api-logger.ts` | API request logging |
| `src/lib/api-cache.ts` | Request caching |
| `src/lib/rate-limiter.ts` | Rate limiting |
| `src/app/api/campaigns/route.ts` | Campaign endpoints |
| `src/app/api/audiences/route.ts` | Audience endpoints |
| `API_ENDPOINTS.md` | Full endpoint documentation |
| `API_TESTING.md` | Testing guide |

---

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── campaigns/        ← Campaign endpoints
│   │   ├── audiences/        ← Audience endpoints
│   │   ├── formats/          ← Format endpoints
│   │   ├── networks/         ← Network endpoints
│   │   ├── stats/            ← Statistics endpoints
│   │   ├── traffic/          ← Traffic endpoints
│   │   ├── validate/         ← Validation endpoints
│   │   ├── admin/            ← Admin endpoints
│   │   └── users/            ← User endpoints
│   └── campaigns/
│       ├── page.tsx          ← List campaigns
│       └── create/page.tsx   ← Create campaign form
├── lib/
│   ├── push-house-client.ts  ← API client
│   ├── api-logger.ts         ← Logging
│   ├── api-cache.ts          ← Caching
│   ├── rate-limiter.ts       ← Rate limiting
│   └── firebase-admin.ts
└── components/
    └── ... (UI components)
```

---

## Performance Tips

1. **Use Caching**: Cached requests return in ~10-50ms
2. **Batch Requests**: Reduce number of API calls
3. **Pagination**: Use limit/offset parameters for large datasets
4. **Monitor Logs**: Check API logs for bottlenecks

---

## Key Features

✅ **20+ API Endpoints**
✅ **Push House API Integration**
✅ **Automatic Fallback to Firestore**
✅ **Request Caching**
✅ **Rate Limiting**
✅ **Comprehensive Logging**
✅ **Error Handling**
✅ **Full TypeScript Support**

---

## Links & Resources

- [Complete Endpoint Documentation](./API_ENDPOINTS.md)
- [Testing Guide](./API_TESTING.md)
- [Configuration Summary](./API_CONFIGURATION_SUMMARY.md)
- [Push House API Docs](https://api.push.house)

---

## Support

For issues or questions:
1. Check the documentation files
2. Review server logs: `npm run dev`
3. Check browser console for API logs
4. Verify environment variables

---

**Version**: 1.0  
**Last Updated**: April 16, 2026  
**Status**: ✓ Production Ready
