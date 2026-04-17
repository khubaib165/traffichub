# Deploy to Vercel - Complete Setup Guide

Vercel is the easiest way to deploy your Next.js app. It's made by Vercel (the Next.js creators), so it works perfectly!

## Why Vercel?

✅ **Easy** - 5 minutes to deploy  
✅ **Free** - Generous free tier  
✅ **Fast** - Automatic optimization  
✅ **Scalable** - Auto-scales with traffic  
✅ **APIs Work** - Full API support  
✅ **Database** - Firebase Firestore works great  
✅ **Automatic** - Redeploys on every git push

## Step-by-Step Setup

### Step 1: Create GitHub Account (If You Don't Have One)

1. Go to https://github.com/signup
2. Enter email, password, username
3. Verify email
4. Done!

**If you already have GitHub, skip to Step 2.**

---

### Step 2: Install Git (If Not Already Installed)

```powershell
# Check if git is installed
git --version

# If not installed, install via Chocolatey
choco install git

# Or download from: https://git-scm.com/download/win
```

---

### Step 3: Configure Git (One-Time Only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"

# Verify it worked
git config --global user.name
git config --global user.email
```

**Replace with YOUR actual name and email!**

---

### Step 4: Create GitHub Repository

**Option A: Using Web Browser (Easiest)**

1. Go to https://github.com/new
2. **Repository name:** `traffichub` (or any name)
3. **Description:** "Push House advertising platform dashboard"
4. Choose **Public** (so Vercel can access it)
5. Click **"Create repository"**
6. Copy the HTTPS URL (looks like: `https://github.com/YOUR_USERNAME/traffichub.git`)

**Option B: Using GitHub CLI**

```powershell
gh repo create traffichub --public --source=. --remote=origin --push
```

---

### Step 5: Initialize Git & Push Code

Run these commands in PowerShell (in your project folder):

```powershell
# Go to your project folder
cd 'c:\Users\Khubaib Hassan\Desktop\Traffichub.space'

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Push House dashboard"

# Add remote (REPLACE WITH YOUR GITHUB URL)
git remote add origin https://github.com/YOUR_USERNAME/traffichub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username!

After this, your code is on GitHub. You should see it at:  
`https://github.com/YOUR_USERNAME/traffichub`

---

### Step 6: Deploy to Vercel

#### Option A: Automatic (Easiest)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **GitHub** (sign in if needed)
4. Paste your repo URL: `https://github.com/YOUR_USERNAME/traffichub`
5. Click **"Import"**
6. Vercel auto-detects Next.js ✅
7. Scroll down → **Environment Variables**
8. Add your variables:
   - **Name:** `PUSHHOUSE_API_KEY`
   - **Value:** `41bae3126d9a47b987b7740de4f3b8b2`
9. Click **"Deploy"**
10. Wait 2-3 minutes...
11. **DONE!** 🎉

Your site is live at: `https://traffichub.vercel.app`

#### Option B: Using Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy (from project folder)
cd 'c:\Users\Khubaib Hassan\Desktop\Traffichub.space'
vercel --prod

# Follow prompts:
# - Link to existing project? NO (first time)
# - Set project name: traffichub
# - Framework: Next.js (auto-selected)
# - Build settings: Default ✅
```

---

## Configuration Details

### Project Settings on Vercel

After deployment, go to your Vercel project dashboard and set:

**Settings → Environment Variables**

| Name | Value |
|------|-------|
| `PUSHHOUSE_API_KEY` | `41bae3126d9a47b987b7740de4f3b8b2` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `traffichub-space` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |

(Get Firebase variables from `src/lib/firebase.ts`)

**Settings → Domains**

Add custom domain (optional):
- Buy domain from GoDaddy, Namecheap, etc.
- Add to Vercel: `Settings → Domains → Add`
- Update DNS records (Vercel gives you instructions)

**Settings → Build & Development**

Usually auto-detected, but verify:
- **Framework:** `Next.js`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm ci`

---

## Auto-Deployment (Continuous Deployment)

After initial setup, **every time you push to GitHub, Vercel automatically deploys!**

```powershell
# Make changes to your code
# Then push:
git add .
git commit -m "Update feature XYZ"
git push origin main

# Vercel automatically deploys! Watch at: https://vercel.com/dashboard
```

---

## Useful Vercel Commands

```powershell
# View deployment logs
vercel logs

# View current environment
vercel env list

# Redeploy latest version
vercel --prod

# Preview a deployment (creates temporary URL for testing)
vercel

# Delete project
vercel rm traffichub
```

---

## Monitoring & Maintenance

### View Deployment Status

1. Go to https://vercel.com/dashboard
2. Click your project
3. See:
   - ✅ Latest deployment status
   - 📊 Analytics & traffic
   - 🔧 Build logs
   - ⚡ Performance metrics

### View Logs in Real-Time

```powershell
vercel logs --tail
```

### Monitor Performance

Vercel dashboard shows:
- Page load times
- Serverless function duration
- Traffic sources
- Error rates

---

## Common Issues & Fixes

### Issue: "Module not found" Error

**Solution:** Missing environment variables

```powershell
# Go to Vercel Dashboard → Settings → Environment Variables
# Make sure ALL required variables are set
# Then redeploy
vercel --prod
```

### Issue: Database Not Connecting

**Solution:** Firebase might need updated rules

```
# Check firestore.rules - make sure rules allow your app
# Go to Firebase Console → Firestore → Rules
# Update if needed, deploy rules:
firebase deploy --only firestore:rules
```

### Issue: API Returning 500 Error

**Solution:** Check Vercel logs

```powershell
vercel logs --tail
# Look for errors in the logs
```

### Issue: Images Not Loading

**Solution:** Update `next.config.js` for Vercel

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
}
```

---

## Cost

| Feature | Free Tier | Cost After |
|---------|-----------|-----------|
| **Deployments** | Unlimited | FREE |
| **Bandwidth** | 100 GB/month | $0.50/GB after |
| **Serverless Functions** | 1M invocations/month | $0.50/M invocations |
| **Databases** | N/A | Firebase charges |
| **Edge Functions** | 100K calls/month | $0.50/M calls |

**Bottom line:** FREE for typical usage!

---

## Quick Reference

### Commands to Deploy

**First Time:**
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/traffichub.git
git push -u origin main
```

**Every Time You Update:**
```powershell
git add .
git commit -m "Your changes"
git push origin main
```

**Then on Vercel Dashboard:**
- New deployment starts automatically ✅
- Takes 1-2 minutes ⏱️
- Deploys when green checkmark appears ✔️

---

## Your Site URL

After deployment:

```
https://traffichub.vercel.app
```

**Share this link with anyone!** They can access your dashboard.

---

## Next Steps After Deployment

1. ✅ Test all pages at your Vercel URL
2. ✅ Test all API endpoints
3. ✅ Verify database connections work
4. ✅ Check admin settings persistence
5. ✅ Monitor performance dashboard
6. ✅ Share with team/partners
7. ✅ Add custom domain (optional)

---

## Need Help?

**If you get stuck:**

1. Check Vercel logs: https://vercel.com/dashboard → Project → Deployments
2. Check error messages (usually very clear)
3. Common fixes:
   - Missing env variables → Add them in Vercel Settings
   - Build errors → Check local build: `npm run build`
   - Database errors → Check Firebase rules
   - 404 errors → Check file paths

---

## Recommended Order

1. ✅ Create GitHub account
2. ✅ Install Git
3. ✅ Configure Git
4. ✅ Create GitHub repo
5. ✅ Push code to GitHub
6. ✅ Deploy to Vercel
7. ✅ Add environment variables
8. ✅ Test live site
9. ✅ Optional: Add custom domain

**Ready to start?** Let me know at Step 1 and I'll guide you through each one! 🚀

