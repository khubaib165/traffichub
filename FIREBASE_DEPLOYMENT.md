# Firebase Hosting Deployment Guide

## Prerequisites
- Firebase project already created: `traffichub-space`
- Firebase CLI installed globally: `npm install -g firebase-tools`
- .env.local configured with Firebase credentials

## Deployment Steps

### Step 1: Build the Project
```bash
npm run build
```
This creates an optimized production build in the `.next` directory.

### Step 2: Export to Static Files (for Firebase Hosting)
```bash
npm run export
```
This generates static files in the `out/` directory that Firebase Hosting can serve.

### Step 3: Authenticate with Firebase
```bash
firebase login
```
This opens a browser to authenticate your Google account with Firebase.

### Step 4: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

This uploads your static files to Firebase Hosting and makes them live!

---

## Full Deployment Command

You can run all steps at once:
```bash
npm run build && npm run export && firebase deploy --only hosting
```

---

## Verify Deployment

After deployment completes, you'll get a URL like:
```
https://traffichub-space.web.app
```

Visit this URL to see your live website!

---

## Environment Variables

For production, make sure your `.env.local` includes:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `PUSHHOUSE_API_KEY` (server-side only, won't be visible in production)
- Other Stripe, SendGrid keys as needed

## Automatic Redeployment

Every time you run `firebase deploy --only hosting`, your changes go live immediately.

---

## Troubleshooting

**Error: "Project not initialized"**
- Run: `firebase init`
- Select the project `traffichub-space`
- Confirm existing firebase.json settings

**Error: "You don't have permission to deploy to site"**
- Run: `firebase login` again
- Make sure you're using the correct Google account

**404 on routes**
- Check firebase.json has "cleanUrls": true
- Next.js routes should automatically work

---

## Rollback to Previous Version

Firebase Hosting keeps version history. To view and revert:
1. Go to Firebase Console: https://console.firebase.google.com
2. Select `traffichub-space` project
3. Go to Hosting
4. Click "Releases" tab
5. Select a previous version and click "Revert"

---

## Next Steps to Optimize

1. **Add environment variables** in Firebase Console for secrets
2. **Set up continuous deployment** via GitHub Actions
3. **Enable CDN caching** for better performance
4. **Add custom domain** instead of using .web.app domain
