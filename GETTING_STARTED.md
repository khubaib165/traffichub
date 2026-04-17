# TrafficFlow - Getting Started Guide

Welcome to TrafficFlow! This guide will help you set up and run the platform locally.

## Quick Setup (5 minutes)

### 1. Prerequisites

Make sure you have the following installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn ([Included with Node.js](https://www.npmjs.com/))
- Git ([Download](https://git-scm.com/download/))

### 2. Clone & Install

```bash
# Navigate to the project directory
cd "path/to/trafficflow"

# Install dependencies (wait for npm install to complete)
npm install

# Or with yarn
yarn install
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local and fill in your credentials:
# NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_value_here
# etc.
```

### 4. Start Development Server

```bash
npm run dev

# The application will be available at:
# http://localhost:3000
```

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Name it "TrafficFlow"
4. Enable Google Analytics (optional)
5. Create the project

### Step 2: Enable Services

1. Go to **Authentication** → Click **Get Started**
   - Enable **Email/Password** sign-in method

2. Go to **Firestore Database** → **Create Database**
   - Select your region (closest to your users)
   - Start in **Test Mode** (or production with security rules)

3. Go to **Storage** → **Get Started** (for campaign images)

### Step 3: Get Credentials

1. Go to **Project Settings** (gear icon → Project settings)
2. Under **Your apps**, click the **Web** icon (</>) 
3. Copy your Firebase config:

```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

4. Paste these values into your `.env.local` file with `NEXT_PUBLIC_` prefix

### Step 4: Deploy Security Rules

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## Stripe Setup

### Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create your account
3. Complete verification

### Step 2: Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy your **Publishable Key** and **Secret Key**
3. Add to `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Push.House API Setup

### Step 1: Get API Credentials

1. Contact Push.House or login at their platform
2. Get your API Key
3. Add to `.env.local`:

```
PUSHHOUSE_API_KEY=your_api_key_here
NEXT_PUBLIC_PUSHHOUSE_API_URL=https://api.push.house
```

## Running Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code with Prettier
npm run format
```

## File Structure Overview

```
src/
├── app/                    # Next.js pages & API routes
│   ├── dashboard/         # Dashboard page
│   ├── campaigns/         # Campaign pages
│   ├── analytics/         # Analytics page
│   ├── wallet/           # Wallet & payments
│   ├── auth/             # Login & register
│   └── api/              # API endpoints
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   └── providers/       # Context providers
├── lib/                 # Utilities & logic
├── styles/              # Global styles & tokens
└── middleware.ts        # Auth middleware
```

## Common Tasks

### Creating a New Page

1. Create a folder in `src/app/` (e.g., `src/app/settings/`)
2. Create `page.tsx`:

```tsx
"use client";

import { Layout } from "@/components/layout/Layout";

export default function SettingsPage() {
  return (
    <Layout>
      <h1>Settings</h1>
    </Layout>
  );
}
```

### Creating a New Component

1. Create a file in `src/components/` (e.g., `CustomCard.tsx`)
2. Use the design system:

```tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const CustomCard = () => {
  return (
    <Card variant="glass" padding="lg">
      <h3 className="text-lg font-bold text-text-primary mb-4">Title</h3>
      <Button variant="primary">Action</Button>
    </Card>
  );
};
```

### Adding a New API Route

1. Create a file in `src/app/api/` (e.g., `src/app/api/example/route.ts`)
2. Handle requests:

```tsx
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: "Hello" });
}
```

## Development Tips

### Utilities

Use utilities from `src/lib/utils.ts`:

```typescript
import {
  formatCurrency,      // "$1,234.50"
  formatNumber,        // "1.2M"
  formatPercentage,    // "12.3%"
  calculateCTR,        // Calculate click-through rate
  formatDate,          // "Apr 14, 2026"
  truncateText,        // "Hello..."
} from "@/lib/utils";
```

### Store Management

Use Zustand stores for state:

```typescript
import {
  useAuthStore,      // User auth state
  useCampaignStore,  // Campaign data
  useWalletStore,    // Wallet balance
  useUIStore,        // UI state (sidebar, etc)
} from "@/lib/store";

// In component
const { user, logout } = useAuthStore();
```

### API Calls

Use the Push.House API client:

```typescript
import { pushHouseService } from "@/lib/api-client";

// Get campaigns
const response = await pushHouseService.getCampaigns();

// Create campaign
const result = await pushHouseService.createCampaign({
  name: "My Campaign",
  format: "push-web",
  // ...
});
```

### Design System

Access colors and tokens:

```typescript
import { colors, spacing, shadows } from "@/styles/design-tokens";

const config = {
  color: colors.brandPurple,
  padding: spacing.md,
  shadow: shadows.glowPurple,
};
```

## Debugging

### Chrome DevTools

1. Open your app at `http://localhost:3000`
2. Press `F12` to open DevTools
3. Use **Console**, **Network**, **Application** tabs

### React DevTools

Install the React DevTools browser extension to inspect components and props.

### VS Code Debugging

Add `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Deployment

### Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t pushflow .

# Run container
docker run -p 3000:3000 pushflow
```

## Troubleshooting

### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection issues
- Check `.env.local` has correct Firebase credentials
- Verify Firebase project is active
- Check Firestore security rules allow your requests

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Performance Tips

1. **Images**: Use Next.js `Image` component for optimization
2. **Lazy Load**: Use dynamic imports for heavy components
3. **Memoization**: Use `React.memo()` for expensive components
4. **Bundle Analysis**: `npm run build --analyze`

## Next Steps

1. ✅ Set up Firebase
2. ✅ Set up Stripe
3. ✅ Configure Push.House API
4. 🚀 Start building features
5. 📱 Test on mobile
6. 🚀 Deploy to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## Support

- 📧 Email: support@trafficflow.app
- 🐛 Report bugs on [GitHub Issues](https://github.com/yourusername/trafficflow/issues)
- 💬 Join our community on Discord (coming soon)

---

Happy coding! 🚀
