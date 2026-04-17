# 🔥 Firebase Setup Guide for PushFlow

Your Firebase project **traffichub-space** is already configured in `.env.local`. Now you need to set up the actual services in Firebase Console.

---

## 📋 Setup Checklist

- [ ] Enable Email/Password Authentication
- [ ] Create Firestore Database
- [ ] Set up Storage for campaign images
- [ ] Deploy Firestore security rules
- [ ] (Optional) Set up custom claims for admin roles
- [ ] (Optional) Set up Cloud Functions for webhooks

---

## 🚀 Step-by-Step Setup

### Step 1: Enable Authentication

Go to [Firebase Console](https://console.firebase.google.com/) → Select **traffichub-space** project

1. Click **Authentication** in the left menu
2. Click the **Get Started** button
3. Click on **Email/Password** provider
4. Toggle **Enable** to ON
5. Click **Save**

✅ **Result**: Users can now sign up and log in with email/password

---

### Step 2: Create Firestore Database

1. Click **Firestore Database** in the left menu
2. Click **Create Database**
3. **Location**: Choose region closest to your users (or `us-central1` for default)
4. **Security Rules**: Select **Start in test mode** (we'll replace with production rules later)
5. Click **Create**

✅ **Result**: You now have a Firestore database ready to store user data

---

### Step 3: Set Up Cloud Storage

1. Click **Storage** in the left menu
2. Click **Get Started**
3. **Location**: Same as Firestore (or `us`)
4. Click **Done**

✅ **Result**: You can now upload campaign images, user avatars, etc.

---

### Step 4: Deploy Firestore Security Rules

Your security rules are in `firestore.rules` - they control who can read/write data.

**In your terminal:**

```bash
# Install Firebase CLI (first time only)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy only the Firestore rules
firebase deploy --only firestore:rules

# Or deploy everything (rules + functions if you add them)
firebase deploy
```

✅ **Result**: Your database is now protected with role-based access control (RBAC)

---

## 🔐 What Your Security Rules Do

### Collections Created Automatically:

1. **`/users/{userId}`** - User profiles
   - Each user can only read/write their own data
   - Admins can read all users

2. **`/users/{userId}/campaigns`** - User's campaigns
   - Users can only access their own campaigns
   - Auto-synced with `/campaigns` collection

3. **`/users/{userId}/wallet`** - User's balance & wallet info
   - Only user can read, admins can update

4. **`/users/{userId}/transactions`** - User's payment history
   - Only admins can write transactions
   - Users can only read their own

5. **`/users/{userId}/notifications`** - User notifications
   - Users and admins can read/write

6. **`/campaigns`** - Global campaigns collection
   - All authenticated users can read all campaigns
   - Users can only create/edit their own

7. **`/analytics`** - Analytics data
   - Only admins can write
   - Users can read their own

---

## 🎯 Database Schema (Auto-Created)

### Users Document
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",  // or "admin"
  "createdAt": "2026-04-14",
  "balance": 500.00,
  "status": "active"
}
```

### Campaign Document
```json
{
  "id": "campaign123",
  "userId": "user123",
  "name": "Summer Campaign",
  "status": "active",  // active, paused, pending, rejected, draft
  "budget": 1000.00,
  "spent": 234.56,
  "clicks": 1234,
  "impressions": 50000,
  "createdAt": "2026-04-14",
  "startDate": "2026-04-14",
  "endDate": "2026-05-14"
}
```

### Transaction Document
```json
{
  "id": "tx123",
  "userId": "user123",
  "type": "deposit",  // deposit, withdrawal, charge
  "amount": 100.00,
  "status": "completed",  // pending, completed, failed
  "paymentMethod": "credit_card",
  "createdAt": "2026-04-14",
  "description": "Deposit via Credit Card"
}
```

### Wallet Document
```json
{
  "id": "wallet123",
  "userId": "user123",
  "balance": 500.00,
  "currency": "USD",
  "lastUpdated": "2026-04-14"
}
```

---

## 🛠️ Optional: Set Up Admin Role

To make a user an **admin** in Firebase, you have two options:

### Option 1: Custom Claims (Recommended)

Use Firebase Admin SDK to set custom claims:

```bash
# Using Firebase CLI (interactive)
firebase emulators:start
```

Or in your app code (using admin SDK):

```typescript
import { adminAuth } from "@/lib/firebase-admin";

// Make a user an admin
await adminAuth.setCustomUserClaims("user-uid-here", {
  admin: true,
  role: "admin"
});
```

### Option 2: Firestore Document

Manually update the user document:

```
Path: /users/{userId}
Field: role
Value: "admin"
```

---

## 🔑 Environment Variables (Already Configured)

Your `.env.local` already has:

```env
# ✅ Already Set
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDzyO6Yx6Q0-kN2pcjmAxkYxM2dtympwxg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=traffichub-space.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=traffichub-space
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=traffichub-space.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=232951891230
NEXT_PUBLIC_FIREBASE_APP_ID=1:232951891230:web:416c750ac059a9f267b50f
FIREBASE_ADMIN_SDK_KEY={...service account JSON...}
```

---

## 🧪 Test Your Setup

### 1. Sign Up a User

1. Open http://localhost:3001
2. Go to Register page
3. Create account with test email

### 2. Check Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Firestore Database**
3. You should see a `/users` collection with your user document

### 3. Test Data Creation

1. Log in to your app
2. Create a test campaign
3. Firestore should show new document in `/campaigns`

---

## 🚨 Security Rules Gotchas

### Authenticated + Ownership Check
```
Users can only see their own data
EXCEPT campaigns (all authenticated users can see all campaigns)
```

### Admin Bypass
```
Admins can:
- Read any user's data
- Update user wallets
- Write transactions
- Delete any campaign
```

### Database Consistency
```
When you create a campaign, it goes to:
1. /campaigns/{campaignId}
2. /users/{userId}/campaigns/{campaignId}

Both must be kept in sync
```

---

## 📊 Firestore Usage Limits (Free Tier)

- **Read operations**: 50,000/day
- **Write operations**: 20,000/day
- **Delete operations**: 20,000/day
- **Storage**: 1GB
- **Bandwidth**: 1GB/month

⚠️ On free tier, analytics pages might show warnings - this is normal for high-traffic simulations.

---

## 🔄 Next Steps

### When Setup is Complete:

1. ✅ Test authentication works
2. ✅ Deploy security rules
3. ✅ Test creating campaigns
4. ✅ Verify data appears in Firestore

### Then Add:

- [ ] Stripe integration (for payments)
- [ ] Push.House API integration (for ads)
- [ ] SendGrid integration (for emails)
- [ ] Analytics tracking

---

## 🐛 Troubleshooting

### "Permission denied" errors
```
Problem: Security rules blocking access
Solution: 
1. Check user is authenticated
2. Check user is owner of document
3. Check admin role is set
4. Redeploy rules: firebase deploy --only firestore:rules
```

### "Collection not found"
```
Problem: Trying to query collection that doesn't exist yet
Solution: Auto-created when first document is written
- Create a user account (creates /users collection)
- Create a campaign (creates /campaigns collection)
```

### "Storage quota exceeded"
```
Problem: Free tier limit reached
Solution:
1. Delete old test data
2. Upgrade to Blaze plan (pay-as-you-go)
3. Set up usage alerts
```

### Rules not updating
```
Problem: Deployed rules not taking effect
Solution:
1. Clear browser cache
2. Clear Firebase cache: firebase clear --force
3. Redeploy: firebase deploy --only firestore:rules
```

---

## 📚 Useful Firebase Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Authentication Methods](https://firebase.google.com/docs/auth)
- [Pricing & Quotas](https://firebase.google.com/pricing)

---

## ✅ Validation Checklist

After completing setup, verify:

- [ ] Can sign up with email/password
- [ ] Can log in
- [ ] User document created in `/users` collection
- [ ] Can create campaigns
- [ ] Campaign appears in both `/campaigns` and `/users/{uid}/campaigns`
- [ ] Can view dashboard with real data
- [ ] Can modify own campaign only
- [ ] Cannot modify other user's campaigns

---

## 🎉 You're Ready!

Your Firebase is now configured and secured. Your PushFlow app will:

✅ Store user profiles securely
✅ Track campaigns with full CRUD operations  
✅ Manage wallets and transactions
✅ Handle multi-user access with proper isolation
✅ Support admin operations
✅ Provide real-time updates

**Start the app:**
```bash
npm run dev
# Visit http://localhost:3001
```

Enjoy building! 🚀
