# TrafficFlow - Push Advertising Platform

**Push smarter. Grow faster.**

PushFlow is a premium, production-ready SaaS platform for managing push notification advertising campaigns. It provides a complete white-label interface connected to the Push.House advertising network, enabling users to create, manage, and analyze high-performing ad campaigns with real-time analytics.

## Features

✨ **Complete Campaign Management**
- Create and manage push, banner, and in-page ad campaigns
- Intuitive wizard-based campaign builder with live creative preview
- Real-time performance analytics and KPI tracking
- Advanced targeting by country, device, OS, browser, and more

💰 **Monetization & Wallet**
- Integrated payment system supporting credit cards and cryptocurrency
- Real-time balance displays and transaction history
- Deposit and withdrawal management
- Automatic compliance with payment regulations

📊 **Advanced Analytics**
- Real-time campaign performance metrics (impressions, clicks, conversions)
- Granular dimensional analysis (by country, device, OS, browser)
- Custom date range and period-over-period comparisons
- Exportable reports in multiple formats

🌐 **Network Management**
- Browse and connect to quality advertising networks
- Network filtering and comparison tools
- Real-time network volume and pricing data
- Fraud detection and quality assurance

👥 **Partner Program**
- Referral management system with commission tracking
- Custom referral links and performance analytics
- Automated payout calculations

🛡️ **Enterprise Security**
- Firebase Authentication with email verification
- Firestore with role-based access control (RBAC)
- Encrypted API communications
- Compliance with GDPR, CCPA, and industry standards

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS 3 with custom design tokens
- **Database**: Firebase Firestore with security rules
- **Authentication**: Firebase Auth
- **State Management**: Zustand
- **Charts & Analytics**: Recharts
- **UI Components**: Lucide React icons
- **Forms**: React Hook Form + Zod validation
- **API Integration**: Axios with custom interceptors
- **Notifications**: React Hot Toast
- **Payments**: Stripe integration
- **Animations**: Framer Motion
- **Email**: SendGrid integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Firestore enabled
- Stripe account (for payments)
- Push.House API credentials
- SendGrid API key (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pushflow.git
   cd pushflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   # ... (see .env.example for all variables)
   ```

4. **Deploy Firestore Rules**
   ```bash
   firebase login
   firebase deploy --only firestore:rules
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pushflow/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page (redirect)
│   │   ├── auth/                    # Authentication pages
│   │   ├── dashboard/               # Dashboard page
│   │   ├── campaigns/               # Campaign management
│   │   ├── analytics/               # Analytics & reporting
│   │   ├── wallet/                  # Wallet & payments
│   │   ├── networks/                # Network browsing
│   │   ├── partners/                # Partner program
│   │   └── api/                     # API routes
│   ├── components/
│   │   ├── providers/               # Context providers
│   │   ├── layout/                  # Layout components (Sidebar, Topbar)
│   │   └── ui/                      # Reusable UI components
│   ├── lib/
│   │   ├── types.ts                # TypeScript types
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── api-client.ts           # Push.House API client
│   │   ├── store.ts                # Zustand stores
│   │   └── utils.ts                # Utility functions
│   └── styles/
│       ├── globals.css             # Global styles & CSS variables
│       └── design-tokens.ts        # Design system tokens
├── public/                           # Static assets
├── firestore.rules                  # Firestore security rules
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # GitHub Actions pipeline
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Design System

### Color Palette

**Brand Colors:**
- Purple: `#7C3AED` (primary)
- Purple Dark: `#5B21B6` (hover state)
- Purple Light: `#EDE9FE` (backgrounds)
- Cyan: `#06B6D4` (accent, CTAs, charts)
- Green: `#10B981` (success, positive change)
- Amber: `#F59E0B` (warning, paused states)
- Red: `#EF4444` (danger, negative change)

**Dark Theme (Default):**
- Background: `#0F0F1A`
- Surface: `#16162A` (sidebar, topbar)
- Card: `#1E1E35` (panels, cards)
- Border: `rgba(255, 255, 255, 0.08)`
- Text Primary: `#FFFFFF`
- Text Secondary: `rgba(255, 255, 255, 0.6)`
- Text Muted: `rgba(255, 255, 255, 0.35)`

### Typography

- **Font**: Inter (sans-serif), JetBrains Mono (monospace)
- **Scale**: 12px (label), 13px (small), 14px (body), 16px (lead), 20px (h3), 24px (h2), 32px (h1)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Components

All UI components follow the design system and are located in `src/components/ui/`:

- **Button**: Primary, secondary, danger, ghost variants
- **Input**: With labels, error states, and icons
- **Card**: Default, glass, gradient variants
- **Badge**: Status-specific styling (active, paused, pending, rejected)
- **StatCard**: KPI display with trend indicators
- **Skeleton**: Shimmer loading placeholder
- **Layout**: Sidebar (collapsible), Topbar with notifications

### Design Tokens

Access design tokens from `src/styles/design-tokens.ts`:

```typescript
import { colors, typography, spacing, shadows, borders } from "@/styles/design-tokens";
```

## API Routes

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `PUT /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign
- `POST /api/campaigns/[id]/pause` - Pause campaign
- `POST /api/campaigns/[id]/resume` - Resume campaign

### Analytics
- `GET /api/stats` - Get campaign statistics
- `GET /api/campaigns/[id]/stats` - Get campaign-specific stats
- `GET /api/traffic` - Get traffic data by dimension

### Networks & Formats
- `GET /api/formats` - List available ad formats
- `GET /api/networks` - List available networks

## Authentication Flow

1. User registers/logs in via Firebase Auth
2. Auth token stored in localStorage
3. Token included in API requests via Axios interceptor
4. Token refreshed automatically on expiry
5. Expired token triggers logout and redirect to login

## State Management

PushFlow uses Zustand for state management with multiple stores:

- **useAuthStore**: User authentication state
- **useCampaignStore**: Campaign list and current campaign
- **useWalletStore**: Wallet balance and transactions
- **useNotificationStore**: User notifications and alerts
- **useThemeStore**: Dark/light mode preference
- **useUIStore**: UI state (sidebar, modals, etc.)

## Deployment

### Firebase Hosting

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy
```

### Docker

A Dockerfile can be created for containerized deployments:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only production

COPY .next ./
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### GitHub Actions CI/CD

The repository includes a comprehensive CI/CD pipeline (`.github/workflows/ci-cd.yml`) that:
- Runs linting and type checking on every push/PR
- Builds the application
- Deploys preview builds on PRs
- Deploys to production on merge to main
- Runs security audits
- Deploys Firestore rules

## Security Considerations

### Firestore Rules
- Role-based access control (RBAC)
- Users can only access their own data
- Admin-only operations protected
- Field-level security rules

### API Security
- All API routes validate authentication
- Request data validated with Zod schemas
- CORS configured appropriately
- Rate limiting recommended for production

### Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- Store secrets in GitHub Secrets for CI/CD
- Rotate credentials regularly

## Performance Optimization

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Caching**: ISR and on-demand revalidation
- **Bundle Analysis**: `npm run build --analyze`
- **Lighthouse**: Target 90+ on all metrics

## Monitoring & Analytics

Recommended integrations:
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and debugging
- **Mixpanel/Amplitude**: Product analytics
- **Google Analytics**: User behavior tracking

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@pushflow.app or open an issue on GitHub.

## Roadmap

- [ ] Advanced audience segmentation
- [ ] A/B testing framework
- [ ] Machine learning-based bid optimization
- [ ] Multi-account management
- [ ] Advanced webhooks and integrations
- [ ] Custom reporting builder
- [ ] Mobile app (iOS/Android)

## Changelog

### v1.0.0 (2026-04-14)
- Initial release
- Complete campaign management
- Real-time analytics
- Wallet and payments
- Partner program
- Network management
