# ConeWise Frontend - Development Documentation

## Week 1 Completion Status ✅

### Completed Tasks:
1. ✅ **React + Vite + Tailwind Project Initialized**
   - Created with TypeScript template for type safety
   - Tailwind CSS configured with PostCSS
   - All required dependencies installed

2. ✅ **Directory Structure Setup**
   ```
   src/
     components/
       Layout/
         Header.tsx
         Sidebar.tsx
         Layout.tsx
       Auth/
         LoginForm.tsx
         RegisterForm.tsx
     pages/
       LoginPage.tsx
       RegisterPage.tsx
       Dashboard.tsx
     hooks/
       useAuth.ts
     context/
       AuthContext.tsx
     services/
       api.ts
   ```

3. ✅ **Routing Implementation**
   - React Router v6 configured
   - Protected routes with PrivateRoute component
   - Auth-based redirects working

4. ✅ **Authentication Forms**
   - Login form with email/password validation
   - Register form with company name field
   - React Hook Form for form management
   - Error handling and loading states

5. ✅ **Layout Components**
   - Header with logout functionality
   - Sidebar navigation (expandable for future routes)
   - Responsive layout wrapper

6. ✅ **HTTP Client Setup**
   - Axios instance with base URL configuration
   - Auth token interceptor
   - 401 handling with redirect to login

7. ✅ **Environment Variables**
   - `.env` file configured
   - `.env.example` for reference
   - VITE_API_URL pointing to backend

8. ✅ **Auth State Management**
   - Context API for global auth state
   - JWT token persistence in localStorage
   - useAuth hook for easy access

---

# System Architecture Overview

## 1️⃣ SYSTEM STRUCTURE — HIGH LEVEL

### Backend (ConeWiseBackend)
- **Language**: Python
- **Framework**: FastAPI
- **Hosting**: Railway (Docker container)
- **DB**: PostgreSQL (Railway Managed Postgres)
- **Cache**: Redis (Railway Managed Redis)
- **Auth**: JWT Token (Backend managed)

**Responsibilities**:
- User & Company management
- Traffic Plan generation via GPT-4o API
- Input validation logic (UK TM compliance)
- Plan version history & review storage
- Credit management & Stripe integration
- Admin reporting & analytics endpoints

### Frontend (ConeWiseFrontend)
- **Language**: JavaScript (ES6) / TypeScript
- **Framework**: React + Vite + TailwindCSS
- **Hosting**: Railway (Static deployment)

**Responsibilities**:
- UI for:
  - Drawing map work area (MapLibre + OS NGD API)
  - Form input (work details)
  - AI Plan visualisation
  - Review/edit plan interface
  - Credit management UI
  - User account portal
  - Admin interface
- HTTP Client (Axios) to consume Backend API
- Auth token management (JWT storage)

---

## 2️⃣ GITHUB REPO STRUCTURE

| **Repo** | **Purpose** |
|----------|-------------|
| conewise-backend | FastAPI backend: API, AI calls, DB logic |
| conewise-frontend | React + Vite frontend: UI components, state management |

---

## 3️⃣ WEEK-BY-WEEK BUILD PLAN (2 DEVELOPERS)

### WEEK 1 — SYSTEM BOOTSTRAP ✅
**Backend Dev**
- Initialise FastAPI project
- Setup PostgreSQL on Railway (define DB schemas for users, jobs, credits, plan data)
- Setup Redis for caching layer
- Build basic API scaffolding:
  - /health route
  - /auth/login, /auth/register (JWT-based)

**Frontend Dev** ✅
- Initialize React + Vite + Tailwind project ✅
- Setup global app structure ✅
- Implement basic routing ✅
- Build login/register pages ✅
- Build shared layout components (sidebar, header, etc.) ✅
- Setup HTTP client to communicate with backend ✅

### WEEK 2 — CORE PLAN GENERATION API
**Backend Dev**
- Build Plan Generation API endpoints:
  - /generate-plan
- Connect to Gemini/Mistral model (via hosted API initially)
- Validate input/output format (GeoJSON + work metadata)
- Store AI response and request in DB

**Frontend Dev**
- Build "New Plan" page:
  - MapLibre map view (OS NGD API integration)
  - Polygon drawing tool
  - Basic form for work description, duration, etc.
- Connect form submission to /generate-plan API
- Display returned plan (read-only initially)

### WEEK 3 — REVIEW & EDITOR WORKFLOW
**Backend Dev**
- Build plan approval endpoints:
  - /plans/{id} (GET / PUT / DELETE)
- Add simple version history (track edits)
- Extend DB schemas to track approval status & edits

**Frontend Dev**
- Build Plan Review UI:
  - Show AI generated plan (pins + tapers)
  - Allow manual edit of pins and lines
  - Save edits via API
- Build basic status system (Pending, Approved, Rejected)

### WEEK 4 — USER MANAGEMENT SYSTEM
**Backend Dev**
- Build company/account management:
  - Companies table
  - Invite system (admin can invite staff)
- Refine role-based access control

**Frontend Dev**
- Build user profile & settings pages
- Build company settings page (invite users)
- Add role-based UI access depending on user role

### WEEK 5 — RULE VALIDATION ENGINE
**Backend Dev**
- Build pre-generation validation engine:
  - Check input data against basic UK traffic rules
  - Return errors if invalid inputs provided
- Build post-generation review flags (auto-flagging possible AI mistakes)

**Frontend Dev**
- UI for rule violations:
  - Show warnings/errors before plan submission
  - Display flagged AI outputs during review
- Allow staff reviewers to override flagged warnings

### WEEK 6 — CREDIT SYSTEM & BILLING
**Backend Dev**
- Build credit tracking logic
- Deduct credits per plan generated
- Stripe integration for purchasing credits

**Frontend Dev**
- Build credit dashboard (show available credits, history)
- Purchase credits UI with Stripe Checkout integration

### WEEK 7 — SUPPORT & ADMIN DASHBOARDS
**Backend Dev**
- Build admin reporting endpoints:
  - Plan volume
  - Company usage
  - Error tracking logs

**Frontend Dev**
- Build internal admin dashboards:
  - Plans by company
  - User activity logs
- Build integrated chat support system (using 3rd-party if preferred)

### WEEK 8 — POLISH, TESTING, QA PREP
**Backend Dev**
- Full end-to-end integration tests
- Security audits
- Final error handling and graceful failures

**Frontend Dev**
- Full UI pass and design polish
- Accessibility & mobile responsiveness
- UX consistency review

### WEEK 9 — BETA RELEASE PREP
- Both devs on joint bug-fixing and stability sprints
- Prepare documentation for beta testers
- Instrument analytics and error monitoring

### WEEK 10 — BETA RELEASE + MONITORING
- Launch limited beta cohort
- Collect structured feedback
- Hotfix any production issues
- Plan post-beta roadmap

---

## 👇 CRITICAL PRINCIPLES DURING BUILD

- ✅ **Strict API contracts** — front-end dev consumes backend API as a service, no shortcuts
- ✅ **Clear role split** — one owns front, one owns back, but collaborate tightly on API interfaces
- ✅ **Weekly integration checkpoints** — devs sync once weekly to verify compatibility
- ✅ **Minimal scope creep** — stick to MVP goals. Fancy features come later.
- ✅ Deployment always happens to Railway environments with CI/CD configured from GitHub.

---

## Railway Project Setup

**Project Name**: Conewise

**Services**:
- **Service 1: Backend**
  - FastAPI Docker container
  - Connects to Postgres and Redis internally
- **Service 2: Frontend**
  - React + Vite static deployment
- **Service 3: PostgreSQL** (Railway Managed DB)
- **Service 4: Redis** (Railway Managed Cache)

---

## 🌱 Environment Naming and Branching Model

### GitHub Branches:
| **Branch** | **Purpose** | **Environment** |
|------------|-------------|-----------------|
| main | Stable production-ready code | production |
| develop | Active development integration | staging |
| Feature branches | Per feature/task | Local only |

### Railway Environments:
| **Railway Env** | **Source** | **Usage** |
|-----------------|------------|-----------|
| production | Auto-deploy from main | Live production system |
| staging | Auto-deploy from develop | Developer integration environment |
| preview | Auto-deploy on PR creation | Per-PR preview builds |

**Simple Rule**:
- Only clean, tested code merges into main
- Daily active work happens on develop via feature branches

---

## 🚀 CI/CD Pipeline Setup

Railway has built-in GitHub integration:

### Backend (ConeWiseBackend)
1. Connect GitHub repo to Railway backend project
2. Configure:
   - main branch → auto-deploy to production env
   - develop branch → auto-deploy to staging env

### Frontend (ConeWiseFrontend)
Same setup as backend:
- Connect GitHub repo to Railway frontend project
- main → production deployment
- develop → staging deployment

---

## 🔑 Secrets and Environment Variables

### Backend ENV variables:
| **Key** | **Description** |
|---------|-----------------|
| OPENAI_API_KEY | GPT-4o API key |
| DATABASE_URL | Railway Postgres URL |
| REDIS_URL | Railway Redis URL |
| JWT_SECRET | JWT signing key |
| STRIPE_SECRET_KEY | Stripe secret key |
| FRONTEND_URL | Frontend URL (for CORS config) |

### Frontend ENV variables:
| **Key** | **Description** |
|---------|-----------------|
| VITE_API_URL | Backend API base URL |

**Critical rule**: Never commit secrets into GitHub repos. Secrets injected via Railway environment settings UI.

---

## 🔄 Development vs Production Data

- Two fully isolated Railway environments:
  - **Production** = real customers, live billing, live plans
  - **Staging** = internal test accounts, dummy Stripe sandbox keys
- Staging DB and Redis are totally separate instances
- Developers can safely test in staging without affecting production

---

## 🔒 GitHub Protections

### main branch:
- Required pull request approvals (2 approvers ideal)
- Status checks (build passes)
- No direct commits allowed

### develop branch:
- PR required but can be single approval
- Can be merged frequently for rapid testing

### Feature branches:
- Free work area for developers

---

## Development Notes

### Current Frontend Stack:
- React 18.3
- TypeScript 5.6
- Vite 7.0
- React Router 7.2
- Axios 1.7
- React Hook Form 7.54
- Tailwind CSS 3.4
- Zustand 5.0 (state management)
- JWT Decode 4.0

### API Integration Pattern:
- All API calls go through `src/services/api.ts`
- Auth token automatically attached to requests
- 401 responses trigger logout and redirect
- Form errors displayed inline with user-friendly messages

### Next Steps for Week 2:
1. Install MapLibre GL JS
2. Integrate OS NGD API for UK maps
3. Build polygon drawing tools
4. Create plan generation form
5. Connect to backend /generate-plan endpoint