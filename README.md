# RebookIndia — Monorepo

India's first organized second-hand book marketplace for students.

## Structure

```
rebookindiav2/
├── apps/
│   ├── customer/     → rebookindia.in           (port 4000)
│   ├── vendor/       → vendor.rebookindia.in    (port 4001)
│   └── admin/        → admin.rebookindia.in     (port 4002)
├── packages/
│   ├── firebase/     → @rebookindia/firebase    (SDK wrapper + seed scripts)
│   ├── types/        → @rebookindia/types       (shared TypeScript types)
│   ├── ui/           → @rebookindia/ui          (shared components)
│   └── utils/        → @rebookindia/utils       (formatters, calculators)
└── turbo.json        → Turborepo pipeline config
```

## Getting Started

```bash
# Install all dependencies (from root)
npm install

# Run all 3 apps simultaneously
npm run dev

# Run individual apps
npm run dev:customer     # localhost:4000
npm run dev:vendor       # localhost:4001
npm run dev:admin        # localhost:4002
```

## Seeding Demo Data

```bash
# Inject all demo data into Firebase
npm run seed
```

## Build for Production

```bash
npm run build            # Build all apps
npm run build:customer   # Customer only
npm run build:vendor     # Vendor only
npm run build:admin      # Admin only
```

## Environment Variables

Each app needs its own `.env.local`. See `packages/firebase/.env.example` for reference.

| App | Key Variables |
|---|---|
| `apps/customer` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `apps/vendor` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `apps/admin` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_API_KEY` |

## Demo Credentials (Firebase Auth)

| Role | Email | Password |
|---|---|---|
| Customer | student@rebookindia.in | Student@123 |
| Vendor | vendor@rebookindia.in | Vendor@123 |
| Admin | admin@rebookindia.in | Admin@123 |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Firebase (Firestore)
- **Auth**: Firebase Auth
- **Storage**: Firebase Storage
- **Monorepo**: Turborepo + npm workspaces
- **Deployment**: Vercel (3 separate projects)
