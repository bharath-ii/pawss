# 🐾 PAWWS — Pet Services Marketplace Platform

## Production-Ready Monorepo

```
PAWWS/
├── apps/
│   ├── customer/          # PAWWS Customer App (com.bharathi.pawws)
│   ├── partner/           # PAWWS Partner App (com.bharathi.pawwspartner)
│   └── admin/             # Admin Web Dashboard
├── packages/
│   ├── firebase/          # Shared Firebase config + functions
│   ├── shared/            # Shared types, utils, constants
│   └── ui/                # Shared UI primitives (optional)
└── firebase/              # Firebase Cloud Functions + Rules
```

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo + TypeScript |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Backend | Firebase (Auth, Firestore, Storage, Functions, FCM) |
| Maps | Google Maps Platform |
| Payments | Razorpay |
| Animations | Reanimated + Lottie |

## Color Palette

| Token | Value |
|---|---|
| Primary Pink | `#FFC0CB` |
| Dark | `#1A1A1A` |
| White | `#FFFFFF` |
| Surface | `#F8F8F8` |

## Font

**Poppins** — Google Fonts

## Getting Started

```bash
# 1. Install root dependencies
npm install

# 2. Setup Firebase
cd firebase && npm install

# 3. Customer App
cd apps/customer && npm install && npx expo start

# 4. Partner App
cd apps/partner && npm install && npx expo start

# 5. Admin Dashboard
cd apps/admin && npm install && npm run dev
```

## Firebase Setup

1. Create a Firebase project at console.firebase.google.com
2. Copy `.env.example` to `.env` and fill in your credentials
3. Deploy Firestore rules: `firebase deploy --only firestore:rules`
4. Deploy Cloud Functions: `firebase deploy --only functions`
5. Deploy Storage rules: `firebase deploy --only storage`
