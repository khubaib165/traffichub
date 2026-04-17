# Network Volume & Trends Page - Documentation

## Overview
A comprehensive analytics page for viewing network volume data broken down by countries, similar to the Push House dashboard interface.

## Page Location
- **URL**: `http://localhost:3002/networks/volume` (or 3000/3001 depending on port availability)
- **Route**: `/src/app/networks/volume/page.tsx`

## Features

### 1. **Filter System**
The page includes 5 different filter options to narrow down the data:

- **Search Countries** - Real-time search through country names
- **Format Filter** - Filter by ad format (Dating, Sweepstakes, Shopping)
- **Traffic Type Filter** - Filter by traffic type (Browser, Native)
- **Country Filter** - Select a specific country from dropdown
- **Connection Type Filter** - Filter by device type (Mobile, Desktop, Tablet)

All filters work in combination and update results in real-time.

### 2. **Data Table**
Displays country-level metrics with the following columns:

| Column | Description | Format |
|--------|-------------|--------|
| Country | Country name with flag emoji | Text + Flag |
| CPM | Cost Per Mille (per 1000 impressions) | $0.000 |
| CPC | Cost Per Click | $0.000 |
| CTR | Click-Through Rate | 0.00% |
| Yesterday's Clicks | Click volume from previous day | Number |
| Volume | Total traffic volume | Number |
| Trend | Growth/decline percentage | ±0.00% (with arrow) |
| Verticals | Ad categories applicable | Badges |
| Connection | Device type | Badge |

### 3. **Smart Metrics**
- **Color-coded trends**: Green for positive, red for negative
- **Contextual icons**: Shows trending up/down indicators
- **Status indicators**: Countries marked as "strong", "normal", or "weak"
- **Formatted numbers**: Readable thousands separators

### 4. **Pagination**
- **Items per page**: 10 results per page
- **Navigation**: Previous/Next buttons + numbered page buttons
- **Summary**: Shows current range and total results count

### 5. **Data Export**
- **Export as CSV**: Download filtered data as CSV file
- **Filename format**: `network-volume-YYYY-MM-DD.csv`
- **Includes**: All columns with formatted values

### 6. **Summary Cards**
At the bottom of the page, 4 summary metric cards display:

1. **Total Volume** - Sum of all traffic volume
2. **Avg CPM** - Average cost per thousand impressions
3. **Avg CTR** - Average click-through rate
4. **Yesterday's Total** - Total clicks from previous day

Each card shows different styling with gradient borders matching brand colors.

## Navigation
The page is integrated into the Networks section with a tab navigation:

- **Tab 1**: Available Networks (existing page)
- **Tab 2**: Network Volume & Trends (new page)

Users can toggle between both views using the navigation tabs below the page header.

## Data Structure

### Mock Data
The page comes pre-populated with mock data for 8 countries:
- Poland
- France
- Germany
- United Kingdom
- Italy
- Spain
- Netherlands
- Belgium

Each entry includes:
```typescript
{
  id: string;
  country: string;
  flag: string;                    // Emoji flag
  cpm: number;                     // Cost per mille
  cpc: number;                     // Cost per click
  ctr: number;                     // Click-through rate (decimal)
  yesterdayClicks: number;         // Previous day clicks
  volume: number;                  // Total traffic volume
  trend: number;                   // Percentage change
  verticals: string[];             // Ad categories
  connectionType: string;          // "Mobile" | "Desktop" | "Tablet"
  status: "strong" | "normal" | "weak";
}
```

## API Integration (Ready)
The page is prepared for API integration. To connect to real data:

1. **Uncomment the API call** in the `useEffect` hook:
```typescript
// const response = await fetch('/api/traffic?type=country');
// const data = await response.json();
// setCountryData(data.data);
// setFilteredData(data.data);
```

2. **Expected API Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "country": "Poland",
      "flag": "🇵🇱",
      "cpm": 0.048,
      ...
    }
  ]
}
```

3. **Available API Endpoints**:
   - `GET /api/traffic?type=country` - Country-level traffic data
   - `GET /api/traffic?type=volume` - Volume trends
   - `GET /api/networks` - Network information

## Styling & Design
- **Theme**: Respects the app's dark theme with gradient accents
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Glass-morphism**: Uses Card component with glass effect
- **Color scheme**:
  - Purple: Primary accent (CPM card)
  - Cyan: Secondary accent (CTR card)
  - Green: Positive trends and values
  - Red: Negative trends and warnings
  - Orange: Historical metrics

## Performance Considerations
- **Lazy loading**: Data loads on mount
- **Filter optimization**: Efficient filtering with memoization ready
- **Pagination**: Handles large datasets efficiently
- **Search**: Client-side search for instant results

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with ES6 support

## Loading States
- **Skeleton loaders**: Shows during data fetch
- **Toast notifications**: Success/error messages for exports
- **Disabled states**: Pagination buttons disabled at boundaries

## Future Enhancements
1. **Real-time updates**: WebSocket integration for live data
2. **Chart visualization**: Add sparklines or mini charts per country
3. **Comparison view**: Compare metrics across time periods
4. **Advanced filtering**: Date range, threshold-based filtering
5. **Sorting**: Click headers to sort by column
6. **Drill-down**: Click country to view detailed metrics
7. **Scheduled reports**: Email reports at intervals
8. **Data caching**: Implement caching layer for performance

## File References
- Page component: `src/app/networks/volume/page.tsx` (750+ lines)
- Modified files: `src/app/networks/page.tsx` (added tabs)
- Styles: Uses existing Tailwind CSS + design tokens

## Troubleshooting

### Data not loading?
- Check browser console for errors
- Verify API endpoint is responding
- Ensure .env variables are set

### Filters not working?
- Check filter values in state
- Verify data structure matches expected format
- Check browser console for errors

### Export not working?
- Ensure CSV headers and data are valid
- Check file size isn't too large
- Verify browser allows downloads

## Quick Start
1. Navigate to `http://localhost:3002/networks`
2. Click the "Network Volume & Trends" tab
3. Use filters to narrow data
4. Click Export to download as CSV
5. Scroll left/right on mobile to see all columns

## Code Comments
The component includes inline comments explaining:
- Filter logic
- Pagination calculations
- Color mapping functions
- Data transformation
- Export functionality

---

**Status**: ✅ Ready for use  
**Last Updated**: April 16, 2026  
**Component Type**: Client Component (React)  
**Framework**: Next.js 14.2.35  
