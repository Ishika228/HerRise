# HerRise AI – Women's Financial Empowerment Platform

> **Tagline:** Her Future. Her Finance. Her Freedom.

HerRise AI is a unified platform empowering women to learn, earn, build businesses, manage finances, discover funding opportunities, find jobs, and connect with mentors.

---

## 📁 Repository Structure

The project is cleanly decoupled into standalone `frontend/` and `backend/` applications:

```
HerRise/
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components & layouts (DashboardLayout, etc.)
│   │   ├── context/              # HerFinanceContext, AuthContext, MarketContext, ToastContext
│   │   ├── data/                 # Comprehensive mock datasets & financial literacy curriculum
│   │   ├── pages/                # All 7 core modules & landing/auth flows
│   │   │   ├── HerFinance/       # Enterprise fintech module (10 interactive views)
│   │   │   ├── HerCareer/        # Career development & jobs
│   │   │   ├── HerBusiness/      # Business tools & plans
│   │   │   ├── HerFund/          # Grants & government schemes
│   │   │   ├── HerMarket/        # Women-owned marketplace
│   │   │   ├── HerLearn/         # Skill-building academy
│   │   │   └── HerNetwork/       # Mentor discovery & booking
│   │   ├── services/             # Client-side OCR parser, AI logic, storage
│   │   └── types/                # Domain & entity TypeScript interfaces
│   ├── public/                   # Static assets & icons
│   ├── index.html                # App entry HTML
│   ├── package.json              # Frontend dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite bundler configuration
│
├── backend/                      # Node.js + Express + TypeScript REST API Service
│   ├── src/
│   │   ├── config/               # Environment & port settings
│   │   ├── controllers/          # Business logic for auth, finance, career, fund, market, etc.
│   │   ├── data/                 # In-memory mock database store
│   │   ├── middleware/           # Error handlers, request logger, CORS
│   │   ├── routes/               # API route definitions (/api/auth, /api/finance, etc.)
│   │   └── server.ts             # Express application entry point
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example environment template
│   ├── package.json              # Backend dependencies & scripts
│   ├── tsconfig.json             # TypeScript compiler settings
│   └── README.md                 # Detailed API endpoint reference
│
├── package.json                  # Root monorepo workspace scripts
├── .gitignore                    # Root git ignore
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### 1. Root Workspace Commands (Run Both or Individually)

From the project root:

```bash
# Run Frontend (Development)
npm run dev:frontend

# Run Backend (Development)
npm run dev:backend

# Build both applications
npm run build
```

---

### 2. Running Frontend Separately

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev

# Production build & preview
npm run build
npm run preview
```

**Frontend Live URL:** [http://localhost:5173](http://localhost:5173)  
**HerFinance Module URL:** [http://localhost:5173/finance](http://localhost:5173/finance)

---

### 3. Running Backend Separately

```bash
cd backend

# Install dependencies
npm install

# Start Express server in development mode (with hot-reload)
npm run dev

# Build for production
npm run build

# Start compiled server
npm start
```

**Backend Live URL:** [http://localhost:5000](http://localhost:5000)  
**API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌐 API Overview

| Module | Base Path | Description |
| :--- | :--- | :--- |
| **Health** | `GET /api/health` | Service uptime and status |
| **Auth** | `/api/auth` | User registration, login, profile, and onboarding wizard |
| **HerFinance** | `/api/finance` | Overview, transactions, category budgets, goals, OCR, AI advice |
| **HerCareer** | `/api/career` | Curated job listings, applications, and AI resume scorer |
| **HerBusiness** | `/api/business` | Automated business plan & projection generator |
| **HerFund** | `/api/fund` | Subsidies, micro-grants, and women SIDBI eligibility check |
| **HerMarket** | `/api/market` | Product marketplace catalog & seller dashboard |
| **Digital Services** | `/api/digital-services` | Website packages, digital services, customer enquiries and admin quotations |
| **HerLearn** | `/api/learn` | Courses, enrollments, and lessons |
| **HerNetwork** | `/api/network` | Vetted mentors and 1-on-1 booking |

---

## HerMarket Digital Services

The digital agency marketplace is integrated into the existing HerMarket module; it does not use a separate frontend or port.

- Open `http://localhost:5173/market` and choose **Grow Your Business Online**.
- Admin dashboard: `http://localhost:5173/market/admin`.
- Website package and service defaults are inserted into MongoDB only when their catalog collections are empty. Admin edits are persisted in MongoDB.
- Customer enquiries are validated and saved to MongoDB with a unique enquiry ID. If MongoDB is unavailable, the API reports an error instead of showing a false confirmation.
- Quotations can be edited in the admin dashboard, saved against an enquiry, downloaded as a PDF, and prepared for email sharing. The email action opens the administrator's email app; attach the downloaded PDF before sending.
- No payment processing is implemented. Dashboard estimates are not collected-payment records.
- Domain, hosting, paid plugins and other third-party expenses are excluded unless separately listed in an approved quotation.

Set these variables in `backend/.env` (see `backend/.env.example`) and restart the backend:

```env
DIGITAL_SERVICES_ADMIN_TOKEN=use-a-long-random-secret
DIGITAL_SERVICES_WHATSAPP=919876543210
```

The admin token is a shared backend secret, submitted only when signing in and held in browser session storage. Never put it in a `VITE_*` variable or commit it. The WhatsApp number is optional and should use international format with digits only. Package and service prices, features, visibility, badges, billing periods and service imagery are managed from `/market/admin`.

Run the frontend on its existing port (`5173`) with `npm run dev:frontend` and the API on `5000` with `npm run dev:backend`. Build and validate both with `npm run build`.

---

## 🔒 Design System & Architecture Principles

- **Fintech Theme:** Navy blue (`#0f172a`), teal (`#0d9488`), emerald green (`#059669`), white, and light grey.
- **Client-Side Autonomy:** Frontend works seamlessly stand-alone with local mock stores, and is ready for full backend integration.
- **OCR Verification:** Simulated receipt extraction enforces human confirmation before ledger updates.
- **Modular Monorepo:** Clean separation of concerns between client UI and API service.
