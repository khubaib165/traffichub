# Firebase Hosting Deployment Guide

Your Next.js app has API routes, so we need Firebase Hosting + Cloud Functions or Firebase Hosting with a Node.js server.

## Option 1: Firebase Hosting with Next.js Build (Recommended)

### Step 1: Update firebase.json for Next.js

Replace your `firebase.json` with this configuration:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": [
    {
      "site": "traffichub-space",
      "public": ".next/standalone/public",
      "cleanUrls": true,
      "trailingSlash": false,
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**",
        "src/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

### Step 2: Update next.config.js

Add standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  output: "standalone",
  experimental: {
    optimizePackageImports: ["recharts", "lucide-react"],
  },
};

module.exports = nextConfig;
```

### Step 3: Update package.json scripts

Replace the deploy script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "deploy": "npm run build && firebase deploy",
  "deploy:hosting": "npm run build && firebase deploy --only hosting",
  "deploy:firestore": "firebase deploy --only firestore",
  "lint": "next lint",
}
```

### Step 4: Build and Deploy

```bash
cd c:\Users\Khubaib Hassan\Desktop\Traffichub.space
npm run deploy
```

---

## Option 2: Firebase Hosting with Cloud Functions (Full Serverless)

This requires more setup but scales better. It separates static files from API routes.

### Step 1: Set up Cloud Functions

```bash
firebase init functions
```

When prompted:
- Language: TypeScript or JavaScript
- Select: TypeScript

### Step 2: Create functions/src/index.ts

```typescript
import * as express from "express";
import * as functions from "firebase-functions";

const app = express();

// Import your Next.js app
const { default: nextApp } = require("../../.next/server/pages/_app");

app.use((req, res, next) => {
  req.url = `/pages${req.url}`;
  nextApp(req, res);
});

export const api = functions.https.onRequest(app);
```

### Step 3: Update firebase.json

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "site": "traffichub-space",
    "public": ".next/out",
    "cleanUrls": true,
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

---

## SIMPLE METHOD: Use Firebase Hosting with Static Export

If you **don't need API routes** on production, use static export:

### Step 1: Update next.config.js

```javascript
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["recharts", "lucide-react"],
  },
};

module.exports = nextConfig;
```

### Step 2: Update firebase.json

```json
{
  "hosting": {
    "site": "traffichub-space",
    "public": "out",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Step 3: Deploy

```bash
npm run build
npm run export
firebase deploy --only hosting
```

---

## RECOMMENDED PATH (For Your App)

Since you have API routes, use **Option 1** (Standalone Next.js build):

### Quick Setup:

1. **Update next.config.js** - Add `output: "standalone"`
2. **Update firebase.json** - Change `public` to `.next/standalone/public`
3. **Build** - Run: `npm run build`
4. **Deploy** - Run: `firebase deploy`

Done! Your app with API routes will be live.

---

## LOGIN with Firebase

Before deploying, authenticate with Firebase:

```bash
firebase login
```

This opens browser to authorize Firebase CLI with your Google account.

---

## Step-by-Step Deployment

### 1. Login to Firebase
```bash
firebase login
```

### 2. Verify Project
```bash
firebase projects:list
```

Should show: `traffichub-space`

### 3. Update Configuration
Follow "Recommended Path" above - update 2 files

### 4. Build
```bash
npm run build
```

### 5. Deploy
```bash
firebase deploy
```

### 6. Your Site is Live!
Visit: `https://traffichub-space.firebaseapp.com`

---

## Verify Deployment

After deployment, test:

1. Homepage: `https://traffichub-space.firebaseapp.com/`
2. Network Volume: `https://traffichub-space.firebaseapp.com/networks/volume`
3. Admin: `https://traffichub-space.firebaseapp.com/admin`
4. API: `https://traffichub-space.firebaseapp.com/api/countries`

---

## Important Notes

⚠️ **API Routes on Firebase Hosting:**
- Static files served instantly
- API routes work with standalone mode
- Cold starts (~1-2 seconds) normal for serverless

⚠️ **Environment Variables:**
- Only `NEXT_PUBLIC_*` variables work on frontend
- Server variables need to be set in Firebase
- All your `NEXT_PUBLIC_*` vars are safe to expose

✅ **What Works:**
- ✅ Database (Firebase) queries
- ✅ All API routes
- ✅ Authentication
- ✅ Static pages
- ✅ ISR (Incremental Static Regeneration)

---

## Troubleshooting

### "Cannot find firebase project"
```bash
firebase use --add
# Select: traffichub-space
```

### "API routes not working"
- Verify `output: "standalone"` in next.config.js
- Check `.next/standalone` folder exists after build

### "Env vars not available"
- Only `NEXT_PUBLIC_*` works in browser
- Set server vars in `.env.local` (deploy reads from here)

### "Build fails"
- Try: `npm ci` instead of `npm install`
- Delete `.next` folder: `rm -r .next`
- Rebuild: `npm run build`

---

## Custom Domain

1. Firebase Console → Hosting → traffichub-space
2. Click "Add custom domain"
3. Enter: `traffichub.space`
4. Follow DNS setup instructions
5. Wait 24-48 hours for propagation

---

## Rollback Deployment

```bash
firebase hosting:channel:deploy
firebase hosting:clone
```

Or in Firebase Console → Hosting → Version History

---

## Need Help?

- Firebase Docs: https://firebase.google.com/docs/hosting/quickstart
- Next.js Deployment: https://nextjs.org/docs/deployment
- Troubleshooting: https://firebase.google.com/docs/hosting/troubleshooting

---

## Quick Command Reference

```bash
# Login
firebase login

# List projects
firebase projects:list

# Select project
firebase use traffichub-space

# Build
npm run build

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore

# View hosting logs
firebase hosting:log

# List versions
firebase hosting:versions:list

# Delete project (careful!)
firebase projects:delete PROJECT_ID
```

---

**Status:** Ready to deploy! Follow the "Recommended Path" section above.
