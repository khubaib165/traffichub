# Deployment Guide - Traffichub.space

Your Next.js application can be deployed to several platforms. Here's how to do it:

## 🚀 RECOMMENDED: Vercel (Easiest - Made for Next.js)

Vercel is the official platform for Next.js and requires minimal setup.

### Step 1: Push to GitHub
```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/traffichub.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click "Sign Up" → Choose "GitHub" authentication
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Import"

### Step 3: Configure Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_SDK_KEY` (entire JSON)
   - `PUSHHOUSE_API_KEY`
   - `NEXT_PUBLIC_PUSHHOUSE_API_URL`
   - `NEXT_PUBLIC_APP_URL` → Change to: `https://your-domain.vercel.app`

### Step 4: Deploy
- Click "Deploy" button
- Vercel will automatically build and deploy
- Your site will be live at: `https://your-project.vercel.app`

### Step 5: Connect Custom Domain (Optional)
1. In Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as shown in Vercel dashboard

**Build Time:** 2-3 minutes  
**Cost:** Free tier available (perfect for starting)  
**Auto-Deploys:** Every time you push to GitHub

---

## Alternative: Netlify

### Step 1: Create Netlify Account
1. Go to https://app.netlify.com
2. Sign up with GitHub

### Step 2: Deploy
1. Click "New site from Git"
2. Select GitHub
3. Choose your repository
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add all environment variables in Netlify dashboard

### Step 3: Deploy
Click "Deploy site" → Wait 3-5 minutes

**Cost:** Free tier works  
**Custom domain:** Free

---

## Alternative: Railway.app (Easy with $5/month credit)

### Step 1: Create Account
1. Go to https://railway.app
2. Sign up (GitHub recommended)

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Choose your repository
4. Railway auto-detects Next.js

### Step 3: Add Environment Variables
In Railway dashboard:
- Add all `.env.local` variables

### Step 4: Deploy
- Railway auto-deploys
- Your site: `https://your-project.up.railway.app`

**Cost:** $5 free credit/month  
**Database:** Can easily add PostgreSQL/MongoDB here

---

## Alternative: AWS Amplify

### Step 1: Connect GitHub
1. Go to https://console.aws.amazon.com/amplify
2. Click "New app" → "Host web app"
3. Select GitHub and authorize
4. Choose repository

### Step 2: Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 3: Add Environment Variables
- Add all from `.env.local`

### Step 4: Deploy
- Click "Save and deploy"

**Cost:** Free tier available  
**Features:** Built-in CI/CD, custom domain

---

## Quick Setup Verification

Before deploying, ensure:
- ✅ `npm run build` completes without errors
- ✅ `npm run dev` works locally
- ✅ All environment variables in `.env.local`
- ✅ Firebase rules allow public read access to needed data
- ✅ Push House API key is valid

---

## What Gets Deployed

Your deployment includes:
- ✅ All React/Next.js pages
- ✅ All API routes (`/api/*`)
- ✅ Middleware (authentication, routing)
- ✅ Static files (images, CSS, etc.)
- ✅ Firebase connection (Firestore, Auth)
- ✅ Push House API integration

**What does NOT get deployed:**
- ❌ `.env.local` (environment variables added separately in host)
- ❌ `node_modules` (reinstalled on server)
- ❌ `.next` (rebuilt on deployment)

---

## Post-Deployment Checklist

After deployment:
1. Test login at: `your-site.com/auth/login`
2. Test Network Volume page: `your-site.com/networks/volume`
3. Test Admin page: `your-site.com/admin`
4. Verify API endpoints respond: `your-site.com/api/countries`
5. Check console for errors: Open DevTools (F12) → Console tab
6. Test Firebase operations (settings save/load)

---

## Troubleshooting

### "Firebase API key missing"
- Ensure `NEXT_PUBLIC_FIREBASE_API_KEY` is in environment variables
- Variables starting with `NEXT_PUBLIC_` are browser-accessible

### "Push House API returns 401"
- Check `PUSHHOUSE_API_KEY` is correct in environment variables
- Verify the key is not expired

### "Network Volume page shows no data"
- Check browser console for errors
- Verify Firestore rules allow public read
- Check Push House API connection in DevTools Network tab

### "Admin settings not saving"
- Check Firebase Admin SDK key is valid
- Verify Firestore has write permissions for authenticated users
- Check server logs for errors

---

## Recommended Deployment Path

**For Beginners:**
→ Vercel (simplest, automatic deploys)

**For Production Sites:**
→ Vercel + Custom Domain

**For Enterprise:**
→ AWS Amplify + Route 53 (DNS)

---

## Next Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/traffichub.git
   git push -u origin main
   ```

2. **Choose a platform** (recommend Vercel)

3. **Deploy in 3 clicks** on that platform

4. **Share your live URL** 🎉

Your website will be accessible 24/7 from anywhere in the world!

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Firebase:** https://firebase.google.com/docs
- **This Project:** See `README.md`
