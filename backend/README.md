# HerRise AI – Backend API Service

Node.js, Express, and TypeScript RESTful API service supporting the **HerRise AI** platform (*Her Future. Her Finance. Her Freedom.*).

---

## 1. Quick Start

### Installation

```bash
cd backend
npm install
```

### Running Locally

```bash
# Start in development mode with hot-reloading (via tsx)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Default server URL: **http://localhost:5000**  
Health Check: **http://localhost:5000/api/health**

---

## 2. API Endpoints Map

### Core & Health
- `GET /api/health` - Service health, environment, and timestamp.

### Authentication & Onboarding (`/api/auth`)
- `POST /api/auth/register` - Create a new user profile.
- `POST /api/auth/login` - Authenticate user credentials.
- `GET /api/auth/me` - Fetch authenticated user profile.
- `POST /api/auth/onboarding` - Save multi-goal onboarding selections and skills.

### HerFinance Financial Management (`/api/finance`)
- `GET /api/finance/overview` - Net inflow, expenses, liquid savings, and emergency coverage months.
- `GET /api/finance/transactions` - Filtered transactions list (query params: `type`, `category`, `search`).
- `POST /api/finance/transactions` - Record new income or expense transaction.
- `DELETE /api/finance/transactions/:id` - Remove transaction record.
- `GET /api/finance/budget` - Category-level budget limits and actual spend utilization.
- `PUT /api/finance/budget/categories/:categoryId` - Adjust category spending ceiling.
- `GET /api/finance/goals` - Active and completed savings goals.
- `POST /api/finance/goals` - Launch new target savings goal.
- `POST /api/finance/goals/:id/deposit` - Deposit funds towards a goal.
- `POST /api/finance/ocr-receipt` - Simulated intelligent receipt OCR parser.
- `POST /api/finance/ai-consult` - Context-aware AI financial analysis and recommendations.

### HerCareer (`/api/career`)
- `GET /api/career/jobs` - Curated jobs for women professionals and returnees.
- `POST /api/career/apply` - Submit job application.
- `POST /api/career/resume-score` - AI resume analysis and keyword scoring.

### HerBusiness (`/api/business`)
- `POST /api/business/generate-plan` - Autonomous business plan and financial projections generator.

### HerFund (`/api/fund`)
- `GET /api/fund/grants` - List women-focused government schemes, subsidies, and grants.
- `POST /api/fund/check-eligibility` - Evaluate business qualification for subsidized SIDBI/Stand-Up loans.

### HerMarket (`/api/market`)
- `GET /api/market/products` - Marketplace product catalog.
- `POST /api/market/products` - List a new product as a seller.
- `GET /api/market/seller-dashboard` - Seller analytics, orders, and revenue summary.

### HerLearn (`/api/learn`)
- `GET /api/learn/courses` - Financial literacy, entrepreneurship, and technical courses.
- `POST /api/learn/enroll` - Enroll in a course.

### HerNetwork (`/api/network`)
- `GET /api/network/mentors` - Browse vetted female mentors and industry leaders.
- `POST /api/network/book` - Book a 1-on-1 advisory session.

