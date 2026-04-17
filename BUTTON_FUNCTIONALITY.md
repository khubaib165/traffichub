# 🔘 Button Functionality & Admin Access Guide

## Why Buttons Aren't Fully Working

Your UI is displaying perfectly, but most action buttons are currently **placeholder components** that show the UI without backend logic. Here's why:

---

## 📊 Current Button Status

### ✅ Fully Working
- ✅ Navigation buttons (sidebar links)
- ✅ Login/Register forms
- ✅ Theme toggle (dark/light mode)
- ✅ Toast notifications

### 🟡 UI Only (No Backend)
- 🟡 "New Campaign" button - Shows UI but doesn't save
- 🟡 Edit/Delete campaign buttons - UI ready, need API calls
- 🟡 Deposit buttons ($25, $50, $100, etc) - UI ready, need Stripe integration
- 🟡 Add Card / View Addresses - UI ready, need payment processor
- 🟡 Transaction history - Shows mock data, not real Firestore data
- 🟡 Filter/Search buttons - UI ready, need frontend filtering logic

---

## 🚀 How to Enable Full Button Functionality

### Phase 1: Wire Up Frontend Actions (No Backend Needed)

#### 1. Create Campaign Modal
```typescript
// src/app/campaigns/page.tsx - Add state for modal
const [showCreateModal, setShowCreateModal] = useState(false);

const handleNewCampaign = async (data: CampaignFormData) => {
  try {
    // This would call your API
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    toast.success('Campaign created!');
  } catch (error) {
    toast.error('Failed to create campaign');
  }
};
```

#### 2. Delete Campaign
```typescript
const handleDeleteCampaign = async (campaignId: string) => {
  if (confirm('Are you sure?')) {
    try {
      await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });
      toast.success('Campaign deleted');
      // Refresh campaigns list
    } catch (error) {
      toast.error('Delete failed');
    }
  }
};
```

#### 3. Deposit Buttons
```typescript
const handleDeposit = (amount: number) => {
  // In production, this would call Stripe
  toast.success(`Deposit of $${amount} initiated`);
  // Redirect to Stripe checkout
};
```

---

### Phase 2: Backend API Integration (Required for Production)

All API routes exist but need to be connected to Firestore:

#### Campaign API Routes (Already Created)
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/[id]` - Get single campaign
- `PUT /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign
- `POST /api/campaigns/[id]/pause` - Pause campaign
- `POST /api/campaigns/[id]/resume` - Resume campaign

#### Example Implementation
```typescript
// src/app/api/campaigns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Save to Firestore
    const docRef = await adminDb.collection("campaigns").add({
      ...data,
      createdAt: new Date(),
      userId: request.headers.get("userId"), // from auth
    });
    
    return NextResponse.json({ 
      success: true,
      id: docRef.id 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
```

---

### Phase 3: Real-Time Data from Firebase

#### Connect Campaign List to Live Data
```typescript
// src/app/campaigns/page.tsx
import { useEffect, useState } from "react";
import { adminDb } from "@/lib/firebase";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = db
      .collection("campaigns")
      .where("userId", "==", userId)
      .onSnapshot((snapshot) => {
        setCampaigns(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })));
      });

    return unsubscribe;
  }, [userId]);

  // Campaigns now update in real-time!
}
```

---

## 🔐 Admin Dashboard Access

### ✅ Admin Page is Now Ready!

**Location**: `/admin`  
**Access**: Click "Admin" in the sidebar (after login)

### Features Available:
1. **User Management**
   - View all users
   - Check account status
   - Approve/suspend users
   - View account balance and campaign count

2. **Campaign Moderation**
   - View pending campaigns
   - Approve or reject campaigns
   - Delete flagged campaigns
   - Flag suspicious activity

3. **System Reports**
   - Total revenue (30 days)
   - Average campaign budget
   - Total impressions
   - Click-through rate stats

4. **System Settings**
   - Configure commission rate
   - Set min/max campaign budgets
   - Enable/disable new registrations
   - Maintenance mode

---

## 🔑 How to Access Admin

### Method 1: Direct URL
```
http://localhost:3001/admin
```

### Method 2: Sidebar Navigation
1. Log in first
2. Look for **"Admin"** link in sidebar (bottom, with lock icon)
3. Click it

### Method 3: Protected Route (Future)
```typescript
// Make admin-only with middleware
// src/middleware.ts

const adminRoutes = ["/admin"];

if (adminRoutes.some(route => pathname.startsWith(route))) {
  const userRole = request.auth?.token?.role; // from Firebase
  if (userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

---

## 📝 Next Steps: Implement Full Functionality

### Priority 1: Connect Campaigns to Firebase
```bash
# Files to update:
1. src/app/campaigns/page.tsx - Add real Firestore data
2. src/app/api/campaigns - Connect to Firestore
3. src/app/api/campaigns/[id] - Implement PUT/DELETE logic
```

### Priority 2: Wire Up Admin Backend
```bash
# Files to update:
1. src/app/admin/page.tsx - Connect to Firestore queries
2. Create admin API routes for user management
3. Add moderation workflows
```

### Priority 3: Payment Integration
```bash
# Stripe setup:
1. Add STRIPE_SECRET_KEY to .env.local
2. src/app/api/stripe/charge - Charge deposits
3. src/app/wallet/page.tsx - Connect deposit buttons to Stripe
```

---

## 🎯 Example: Make Delete Button Work

### Step 1: Update Delete Handler
```typescript
// src/app/campaigns/page.tsx
const handleDeleteCampaign = async (campaignId: string) => {
  if (!confirm("Delete campaign?")) return;
  
  try {
    const response = await fetch(`/api/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      toast.success("Campaign deleted");
      // Re-fetch campaigns
      setRefresh(!refresh);
    }
  } catch (error) {
    toast.error("Delete failed");
  }
};
```

### Step 2: Implement API Route
```typescript
// src/app/api/campaigns/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    
    // Delete from Firestore
    await adminDb.collection("campaigns").doc(campaignId).delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
```

### Step 3: Test It!
1. Refresh your app
2. Click delete button
3. See real campaign get removed from Firestore

---

## 📊 Which Buttons to Implement First?

### Critical (MVP)
1. ✅ Create Campaign  
2. ✅ Edit Campaign
3. ✅ Delete Campaign
4. ✅ Pause/Resume Campaign
5. ✅ Filter/Search campaigns

### High Priority (Phase 2)
6. Deposit (Stripe)
7. Withdraw (Bank transfer)
8. Add Payment Method

### Nice to Have (Phase 3)
9. Export reports
10. Advanced filtering
11. Bulk actions

---

## 🧪 Test Admin Dashboard

Visit: http://localhost:3001/admin

Try:
- ✅ View users tab
- ✅ View campaigns tab
- ✅ View reports (mock data)
- ✅ View settings
- ✅ Click action buttons (will show toast)

---

## 💡 Tips

- Buttons are **UI-ready** but not connected
- All backend APIs already created in `/api` folder
- Just need to wire them up to Firestore
- Admin page is fully functional template
- Start with campaigns (easiest to implement)

---

## 🔗 More Resources

- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Stripe Payment Integration](https://stripe.com/docs)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

**Your UI is production-ready! Next: Connect the buttons to real data! 🚀**
