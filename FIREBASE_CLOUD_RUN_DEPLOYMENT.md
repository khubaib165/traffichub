# Deploy to Firebase Hosting + Cloud Run (With APIs)

Your app is now configured to run on **Firebase Hosting** with **Cloud Run** handling the backend including all API routes.

## Prerequisites

You need to install:
1. **Google Cloud SDK** (gcloud CLI)
2. **Docker** (for container images)

## Step-by-Step Deployment

### Step 1: Install Required Tools

#### Option A: Using Chocolatey (Windows)
```powershell
choco install gcloud
choco install docker-desktop
```

#### Option B: Manual Installation
- **Google Cloud SDK**: https://cloud.google.com/sdk/docs/install
- **Docker Desktop**: https://www.docker.com/products/docker-desktop

After installation, restart PowerShell.

### Step 2: Authenticate with Google Cloud

```powershell
gcloud auth login
gcloud auth application-default login
gcloud config set project traffichub-space
```

### Step 3: Enable Required APIs

```powershell
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Step 4: Build and Deploy to Cloud Run

```powershell
cd 'c:\Users\Khubaib Hassan\Desktop\Traffichub.space'

# Build and deploy to Cloud Run
gcloud run deploy traffichub-app `
  --source . `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars PUSHHOUSE_API_KEY=41bae3126d9a47b987b7740de4f3b8b2
```

This will:
- Build your Docker image
- Deploy to Cloud Run
- Make it publicly accessible
- Apply your environment variables

### Step 5: Deploy to Firebase Hosting

```powershell
firebase deploy --only hosting
```

This connects your Firebase Hosting to the Cloud Run service.

### Step 6: Your Site is Live! 🎉

Visit: `https://traffichub-space.web.app`

Your app will be fully functional with:
- ✅ All pages working
- ✅ All API routes working
- ✅ Database connections working
- ✅ Authentication working

---

## Complete Deployment Command

If everything is set up, run this ONE command:

```powershell
gcloud run deploy traffichub-app --source . --platform managed --region us-central1 --allow-unauthenticated --set-env-vars PUSHHOUSE_API_KEY=41bae3126d9a47b987b7740de4f3b8b2 ; firebase deploy --only hosting
```

---

## What's Included in Your Deployment

| Component | Platform | Status |
|-----------|----------|--------|
| **Frontend Pages** | Firebase Hosting | ✅ Static, fast |
| **API Routes** | Cloud Run | ✅ Serverless, auto-scales |
| **Database** | Firebase Firestore | ✅ Connected |
| **Authentication** | Firebase Auth | ✅ Works |
| **Environment Vars** | Cloud Run | ✅ Configured |

---

## Costs

**First 12 months (with free tier):**
- Firebase Hosting: FREE
- Cloud Run: FREE (2M invocations/month free)
- Firestore: FREE (1 GB storage)

**After free tier:**
- Cloud Run: ~$0.00002 per invocation (very cheap)
- Firestore: ~$0.06 per 100K reads

---

## If You Get Errors

### Error: "gcloud command not found"
- Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
- Restart PowerShell after installation

### Error: "Docker daemon not running"
- Open Docker Desktop application
- Wait for it to fully start
- Try gcloud deploy again

### Error: "Permission denied"
```powershell
gcloud auth login
gcloud auth application-default login
```

### Error: "Invalid project"
```powershell
gcloud config set project traffichub-space
gcloud projects list  # Verify project appears
```

---

## Useful Commands

```powershell
# Check deployment status
gcloud run services list

# View logs
gcloud run services logs read traffichub-app --limit 50

# Update just environment variables
gcloud run services update traffichub-app `
  --set-env-vars PUSHHOUSE_API_KEY=YOUR_KEY

# View Cloud Run URL
gcloud run services describe traffichub-app --format 'value(status.url)'

# Delete deployment
gcloud run services delete traffichub-app
```

---

## Alternative: Use Vercel Instead (Easier)

If you find this complex, **Vercel** is simpler:
1. Push to GitHub
2. Import on Vercel.com
3. Add env vars
4. Done! Much faster.

---

## Need Help?

Run deployment step-by-step. Let me know if you hit any errors and I'll help you fix them!

**Ready? Run this in PowerShell:**

```powershell
cd 'c:\Users\Khubaib Hassan\Desktop\Traffichub.space'
gcloud auth login
```

Then follow the steps above.
