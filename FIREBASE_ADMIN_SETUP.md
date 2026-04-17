# Firebase Admin SDK Setup Guide

## ✅ Configuration Complete

Your Firebase Admin SDK has been successfully integrated! This enables powerful server-side operations.

---

## 📋 What's Configured

### Client-Side Firebase (Browser)
- Location: `src/lib/firebase.ts`
- Used for: Authentication, real-time Firestore reads, file uploads
- Security: Public credentials (prefixed with `NEXT_PUBLIC_`)
- Scope: Browser only

### Server-Side Firebase Admin (Node.js)
- Location: `src/lib/firebase-admin.ts`
- Used for: Admin operations, bulk operations, privileged database access
- Security: Private service account key (never exposed to browser)
- Scope: API routes and server components only

---

## 🔑 Environment Variables

All configured in `.env.local`:

```
# Public Firebase Config (safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=traffichub-space
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Private Admin SDK (server-only)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account",...}
```

**⚠️ IMPORTANT**: `.env.local` is in `.gitignore` - never commit credentials!

---

## 🚀 Using Admin SDK

### Import in API Routes

```typescript
// ✅ Correct: Server-side only
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  // Admin operations here
}
```

### ❌ Common Mistakes

```typescript
// Wrong: Never import admin SDK in client components
import { adminAuth } from "@/lib/firebase-admin"; // ❌ Client component

// Wrong: Never use in browser code
fetch("/api/get-data").then(r => {
  // adminAuth not available here
});
```

---

## 🔧 Common Admin Operations

### 1. Verify ID Token (Server-Side)

```typescript
import { adminAuth } from "@/lib/firebase-admin";

// Verify token from Authorization header
const token = request.headers.get("Authorization")?.split(" ")[1];
const decodedToken = await adminAuth.verifyIdToken(token);
console.log(decodedToken.uid, decodedToken.email);
```

**Endpoint**: `GET /api/admin/verify-token`

### 2. Create Custom Claims

```typescript
import { adminAuth } from "@/lib/firebase-admin";

// Set custom role claims
await adminAuth.setCustomUserClaims(uid, {
  role: "admin",
  permissions: ["create_campaign", "view_analytics"]
});
```

### 3. Access Firestore with Admin Privileges

```typescript
import { adminDb } from "@/lib/firebase-admin";

// Write with elevated permissions
const userRef = adminDb.collection("users").doc(uid);
await userRef.set({
  email: user.email,
  role: "user",
  createdAt: new Date(),
});

// Read other users' data
const snapshots = await adminDb
  .collection("users")
  .where("role", "==", "admin")
  .get();
```

### 4. Bulk Delete Users

```typescript
import { adminAuth } from "@/lib/firebase-admin";

// Delete a user account
await adminAuth.deleteUser(uid);
```

### 5. Create User Programmatically

```typescript
import { adminAuth } from "@/lib/firebase-admin";

// Create account
const userRecord = await adminAuth.createUser({
  email: "user@example.com",
  password: "password123",
  displayName: "John Doe",
  emailVerified: false,
});

console.log("User created:", userRecord.uid);
```

---

## 📝 Example: Admin API Route

See `src/app/api/admin/verify-token/route.ts` for a complete example of:
- Getting Authorization header
- Verifying ID token with admin SDK
- Returning decoded token info
- Error handling

### Usage:

```bash
curl -H "Authorization: Bearer <id_token>" \
  http://localhost:3000/api/admin/verify-token
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Use admin SDK only in API routes or server components
- ✅ Verify permissions before admin operations
- ✅ Log admin operations for audit trails
- ✅ Rotate service account key periodically
- ✅ Use strong Firestore security rules
- ✅ Validate all inputs server-side

### ❌ DON'T:
- ❌ Never expose `FIREBASE_ADMIN_SDK_KEY` to frontend
- ❌ Never commit `.env.local` to git
- ❌ Never log full tokens to console
- ❌ Never skip input validation
- ❌ Never trust client-side permission checks

---

## 🛡️ Firestore Security Rules

Your `firestore.rules` file includes:

```firestore
// Helper: Check if user is authenticated
function isAuthenticated() {
  return request.auth != null;
}

// Helper: Check if user owns the document
function isOwner(uid) {
  return request.auth.uid == uid;
}

// Helper: Check user role (requires custom claims)
function hasRole(role) {
  return request.auth.token[role] == true;
}
```

These work together with admin SDK to provide layered security.

---

## 🔄 Workflow: Client → Server → Database

### 1. Client Side (Browser)
```typescript
// User logs in
signInWithEmailAndPassword(auth, email, password);
// → Returns ID token
```

### 2. Server Side (API Route)
```typescript
// Verify token has valid claims
const decoded = await adminAuth.verifyIdToken(idToken);
// → Check decoded.role, decoded.permissions
```

### 3. Database (Firestore)
```firestore
// final security layer
match /campaigns/{campaignId} {
  allow create: if isAuthenticated() && 
                   hasRole("advertiser");
  allow read: if isOwner(resource.data.userId) || 
                 hasRole("admin");
}
```

---

## 📊 Admin Dashboard Idea

Create an admin panel to:
- View all users and their roles
- Set custom claims for users
- Delete spammy campaigns
- Monitor API usage
- Generate reports

Example:

```typescript
// src/app/api/admin/users/route.ts
export async function GET(request: NextRequest) {
  const allUsers = await adminAuth.listUsers(1000);
  return NextResponse.json(allUsers.users);
}
```

---

## 🐛 Troubleshooting

### Error: "FIREBASE_ADMIN_SDK_KEY is not set"
- **Solution**: Add `FIREBASE_ADMIN_SDK_KEY` to `.env.local`
- Make sure it's valid JSON
- Check that it's NOT in `.env.example` (credentials should stay local)

### Error: "Invalid service account key"
- **Solution**: JSON is malformed
- Download fresh key from Firebase Console
- Make sure to escape newlines properly when setting as env var

### Error: "Permission denied" on Firestore
- **Cause**: Admin SDK uses different permission system
- **Solution**: Check your Firestore security rules
- Admin operations bypass client rules but must still be valid server-side

### Admin operations timing out
- **Cause**: Running too many operations in sequence
- **Solution**: Use batch operations for bulk writes
- Increase timeout for long-running operations

---

## 📚 Next Steps

1. **Test the Setup**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Try signing in
   ```

2. **Deploy Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Create Admin Routes** (as needed)
   - User management
   - Campaign moderation
   - Analytics queries
   - Report generation

4. **Monitor Usage**
   - Set up billing alerts in Firebase Console
   - Monitor reads/writes with Firebase stats
   - Log admin operations for audit trail

---

## 🎯 What You Can Do Now

With Admin SDK configured:

- ✅ Server-side token verification
- ✅ Create user accounts programmatically
- ✅ Set custom claims (roles, permissions)
- ✅ Bulk database operations
- ✅ Delete accounts and data
- ✅ Generate admin reports
- ✅ Moderate user-generated content
- ✅ Access all Firestore data (unrestricted)

---

## 📖 Firebase Admin SDK Docs

- [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin)
- [Admin Authentication](https://firebase.google.com/docs/auth/admin/start)
- [Admin Firestore](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)

---

**Configuration Status**: ✅ Complete  
**Ready to Use**: ✅ Yes  
**Credentials Secure**: ✅ Yes (.env.local in .gitignore)

Start building! 🚀
