# Whistle Works 🏆

> **Referee Camp Management Made Simple** — A comprehensive platform for managing sports referee training camps, built for camp directors, evaluators, and referees.

Whistle Works is a full-featured web application that streamlines the entire lifecycle of referee training camps — from creation and scheduling to evaluation and performance tracking. It serves three distinct user roles (Directors, Evaluators, and Referees) with role-specific dashboards and capabilities.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture Overview](#-architecture-overview)
- [User Roles & Permissions](#-user-roles--permissions)
- [Route Map](#-route-map)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Integration](#-api-integration)
- [Authentication Flow](#-authentication-flow)
- [State Management](#-state-management)
- [UI Component Library](#-ui-component-library)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🛠 Tech Stack

### Frontend Core

| Technology        | Version | Purpose                               |
| ----------------- | ------- | ------------------------------------- |
| **React**         | 19      | UI framework                          |
| **Vite**          | 6.1     | Build tool & dev server               |
| **React Router**  | 7.1     | Client-side routing                   |
| **Tailwind CSS**  | 4.0     | Utility-first CSS framework           |
| **React Query**   | 5.90    | Server state management & caching     |

### UI & Design

| Library               | Purpose                                |
| --------------------- | -------------------------------------- |
| **Ant Design (antd)** | Pre-built UI components (DatePicker, Select, Modal, Tabs, etc.) |
| **Framer Motion**     | Animations & transitions               |
| **React Hook Form**   | Form validation & management           |
| **React Icons**       | Icon library                           |
| **react-hot-toast**   | Toast notifications                    |
| **sweetalert2**       | Confirmation dialogs & modals          |
| **react-fast-marquee**| Auto-scrolling partner logos           |
| **react-phone-number-input** | International phone number input |
| **clsx** + **tailwind-merge** | Conditional class merging (shadcn-style `cn()` utility) |

### Editor & Maps

| Library                    | Purpose                              |
| -------------------------- | ------------------------------------ |
| **@tiptap/react**          | Rich text editor (camp descriptions) |
| **@react-google-maps/api** | Google Maps Places Autocomplete      |
| **use-places-autocomplete**| Alternative Google Places integration|

### Data & Networking

| Library                | Purpose                       |
| ---------------------- | ----------------------------- |
| **Axios**              | HTTP client with interceptors |
| **@tanstack/react-table**| Data tables for rankings     |
| **date-fns**           | Date formatting & manipulation|
| **dayjs**              | Lightweight date library      |

### Dev Tools

| Tool                    | Purpose                    |
| ----------------------- | -------------------------- |
| **ESLint**              | Code linting               |
| **@vitejs/plugin-react-swc** | Fast SWC-based React compilation |
| **Path Alias (@/)**     | Clean imports using `@/` prefix |

---

## 📁 Project Structure

```
whistle-works/
├── public/                          # Static assets
│   ├── referee/                     # Referee dashboard icons
│   ├── dashboard-logo.svg           # Dashboard logo
│   ├── rankingData.json             # Ranking data (demo)
│   ├── site.webmanifest             # PWA manifest
│   └── _redirects                   # Netlify SPA redirect rules
│
├── src/
│   ├── main.jsx                     # App entry point
│   ├── App.jsx                      # Root app component
│   ├── index.css                    # Global styles & Tailwind CSS v4 config
│   │
│   ├── assets/                      # Shared media assets (images, logos, etc.)
│   │
│   ├── components/                  # Shared UI components
│   │   ├── common/                  # Atomic & reusable UI primitives (Logo, BackBtn, Loader, etc.)
│   │   └── shared/                  # Layout/navigation components (Header, Footer, DashboardHeader, UserPopover, etc.)
│   │
│   ├── context/                     # React Context definitions (AuthContext, etc.)
│   │
│   ├── providers/                   # Context providers (AuthProvider.jsx, etc.)
│   │
│   ├── services/                    # API Service layers (handles raw HTTP requests)
│   │   ├── auth.service.js          # Authentication services
│   │   ├── cms.service.js           # Public CMS pages (Home, About) services
│   │   ├── stripeConnection.service.js # Stripe onboarding & status services
│   │   ├── director-services/       # Director-specific services (camp, roster, crew, schedules, etc.)
│   │   ├── referee-services/        # Referee-specific services (registrations, my-games, performance, check-ins)
│   │   └── evaluator-services/      # Evaluator-specific services (schedules, registrations, evaluations)
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── axiosInstace.jsx         # Default Axios instance for route loaders
│   │   ├── useAuth.jsx              # Legacy/helper auth hooks
│   │   ├── useAxiosPublic.jsx       # Public Axios instance hook
│   │   ├── useAxiosSecure.jsx       # Secure Axios instance hook with 401 interceptor
│   │   ├── useCampSchedule.js       # Schedule fetching hook
│   │   ├── infinity-scroll-hook.js  # Reusable infinite scroll hook
│   │   │
│   │   └── api/                     # TanStack Query (React Query) hooks mapped to API services
│   │       ├── useAuth.js           # Auth query/mutation hooks
│   │       ├── useCms.js            # CMS query hooks
│   │       ├── useStripConnection.js # Stripe integration query/mutation hooks
│   │       ├── useEvaluation.js     # Referee evaluations hooks
│   │       ├── useNoAuthCamps.js    # Public camps hooks
│   │       ├── useRankings.js       # Rankings & settings hooks
│   │       ├── useRegisteredReferees.js
│   │       ├── useRefereeDetails.js
│   │       ├── director-hooks/      # Director-specific API hooks (useCamps, useCrews, useBuildSchedule, etc.)
│   │       ├── referee-hooks/       # Referee-specific API hooks (useRefereePerformance, useCampRegistration, etc.)
│   │       └── evaluator-hooks/     # Evaluator-specific API hooks (useEvaluatorCamps, useEvaluatorSchedule, etc.)
│   │
│   ├── lib/
│   │   └── utils.js                 # Shared helper utilities (e.g., tailwind merge cn() helper)
│   │
│   ├── utils/                       # Pure utility/helper functions
│   │   ├── formatDate.js            # Date formatter
│   │   ├── maskEmail.js             # Email masking
│   │   └── validatePassword.js      # Password validation
│   │
│   ├── router/
│   │   └── router.jsx               # React Router config and route definitions
│   │
│   ├── routes/
│   │   └── RoleBasedPrivateRoute.jsx # Route authentication & role check guard
│   │
│   ├── layout/                      # High-level layout wrappers
│   │   ├── RootLayout.jsx           # Public site layout (Header + Footer)
│   │   ├── AuthLayout.jsx           # Authentication layouts
│   │   ├── DirectorLayout.jsx       # Director dashboard layout
│   │   ├── EvolatorLayout.jsx       # Evaluator dashboard layout
│   │   └── RefereeLayout.jsx        # Referee dashboard layout
│   │
│   └── page/                        # Page-level components
│       ├── home/                    # Landing page
│       ├── about-us/                # About page
│       ├── all-camps/               # Public camps list
│       ├── faq/                     # FAQ page
│       ├── privacy-policy/          # Privacy Policy
│       ├── terms-conditions/        # Terms & Conditions
│       ├── auth/                    # Auth pages (SignIn, SignUp, VerifyOtp, ResetPassword, etc.)
│       └── dashboard/               # Role-based dashboard page trees
│           ├── NoticePopup.jsx      # Dashboard notice banner
│           ├── profile/             # Profile page
│           ├── campDetailsPage/     # Tabbed view for camp details, roster, and reports
│           │   ├── camp-details/    # Camp info & registration modal (with Stripe and coupon discount)
│           │   ├── roster/          # Camp roster view
│           │   └── ranking-report/  # Ranking reports view
│           ├── director-dashboard/  # Camp Director dashboard subpages with local components
│           │   ├── dashboard/       # Main dashboard home (with Stripe connect card)
│           │   ├── create-new-camp/ # Create camp page (displays camp fee and software fee)
│           │   ├── edit-camp/       # Edit camp page
│           │   ├── build-schedule/  # Camp schedule configuration
│           │   ├── court-list/      # Court and slot management
│           │   ├── evaluate/        # Referee evaluation pages
│           │   ├── ranking/         # Director ranking view
│           │   ├── crews/           # Crew management
│           │   └── strip-connection-success/ # Stripe onboarding callback target
│           ├── EvolatorDashboard/   # Evaluator dashboard subpages
│           └── RefereeDashboard/    # Referee dashboard subpages
│
├── package.json
├── vite.config.js
├── eslint.config.js
├── jsconfig.json
└── index.html
```

---

## 🏗 Architecture Overview

### Application Flow

```
User → Browser → Vite Dev Server → React App
                                      │
                           ┌──────────┴──────────┐
                           │   Router (react-router-dom) │
                           └──────────┬──────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
              Public Routes     Auth Routes       Dashboard Routes
              (RootLayout)    (AuthLayout)    (RoleBasedPrivateRoute)
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                              Director          Evaluator          Referee
                              Layout            Layout             Layout
```

### Data Flow

```
Component → Custom Hook → Axios Instance (useAxiosPublic/Secure)
                              │
                              ▼
                    React Query (useQuery/useMutation)
                              │
                              ▼
                    API Backend (Laravel)
                              │
                              ▼
                    Database (MySQL)
```

- **Public Axios Instance** (`useAxiosPublic`): Used for unauthenticated requests (login, signup, public camp data).
- **Secure Axios Instance** (`useAxiosSecure`): Used for authenticated requests; automatically attaches JWT token and handles 401 responses (auto-logout on session expiry).
- **Axios Instance** (`axiosInstace`): Used for route loaders within React Router's `loader` functions.

### State Management

| State Type     | Solution                    | Usage                                  |
| -------------- | --------------------------- | -------------------------------------- |
| **Server State** | React Query (TanStack Query) | All API data — camps, rosters, evaluations, notifications |
| **Auth State**   | React Context (AuthProvider) | User data, login/logout, access token  |
| **Form State**   | React Hook Form             | Form inputs, validation, submission    |
| **UI State**     | Local useState / URL params | Modals, tabs, dropdowns, filters       |

---

## 👥 User Roles & Permissions

The application has three distinct roles, each with its own dashboard and feature set:

### 1. 🎯 Director (Camp Director)
- Create, edit, and delete camps
- Build schedules and manage courts
- View and manage rosters (referees, evaluators, crews)
- Evaluate referee performance
- View ranking reports with settings
- Create and manage crews
- Send announcements
- View camp overview and details

### 2. 📋 Evaluator (Evaluator/Clinician)
- View registered/active camps
- Browse and register for available camps
- View camp details, schedules, and rosters
- Submit referee performance evaluations
- View ranking reports
- View assigned game schedules
- Access previous camp history

### 3. 🏅 Referee (Referee)
- Browse and register for training camps
- Check in to registered camps
- View assigned game schedules
- View personal performance metrics and breakdowns
- View ranking reports
- Receive feedback from evaluators
- Access previous camp history

---

## 🗺 Route Map

### Public Routes (`/`)

| Path                  | Page                     | Description                    |
| --------------------- | ------------------------ | ------------------------------ |
| `/`                   | Home                     | Landing page with CMS content  |
| `/about-us`           | AboutUs                  | About page (CMS-driven)        |
| `/all-camps`          | AllCamps                 | Browse all camps with filters  |
| `/all-camps/:id`      | CampDetailsPageForNoAuth | Public camp details            |
| `/privacy-policy`     | PrivacyPolicy            | Privacy policy                 |
| `/terms-conditions`   | TermsConditions          | Terms and conditions           |

### Auth Routes (`/auth`)

| Path                           | Page              | Description               |
| ------------------------------ | ----------------- | ------------------------- |
| `/auth/signin`                 | SignIn            | User login                |
| `/auth/signup`                 | SignUp            | User registration         |
| `/auth/verify-otp`             | VerifyOtp         | Email verification OTP    |
| `/auth/forget-password`        | ForgetPassword    | Password reset request    |
| `/auth/reset-password-otp`     | ResetPasswordOtp  | Password reset OTP        |
| `/auth/reset-password`         | ResetPassword     | Set new password          |

### Director Dashboard (`/director-dashboard`)

| Path                                       | Page              | Description                 |
| ------------------------------------------ | ----------------- | --------------------------- |
| `/director-dashboard`                      | Dashboard         | Main dashboard              |
| `/director-dashboard/create-new-camp`      | CreateNewCamp     | Create a new camp           |
| `/director-dashboard/camp-overview/:id`    | CampOverview      | View camp details           |
| `/director-dashboard/edit-camp/:id`        | EditCampPage      | Edit existing camp          |
| `/director-dashboard/build-schedule/:id`   | BuildSchedule     | Build camp schedule         |
| `/director-dashboard/court-list/:id`       | CreatedCourt      | Manage courts               |
| `/director-dashboard/camp-schedules/:id`   | CampSchedules     | View schedules              |
| `/director-dashboard/ranking/:id`          | Ranking           | Referee rankings            |
| `/director-dashboard/roster/:id`           | Roster            | Camp roster (referees)      |
| `/director-dashboard/evaluate/:id`         | Evaluate          | Evaluate referees           |
| `/director-dashboard/active-evaluate/:id`  | ActiveEvaluate    | Active evaluations          |
| `/director-dashboard/active-crews/:id`     | ActiveCrews       | Manage crews                |
| `/director-dashboard/crew-details/:crewId` | CrewDetailsPage   | Crew details                |
| `/director-dashboard/make-announcement/:id`| MakeAnnouncement  | Send announcements          |
| `/director-dashboard/profile`              | Profile           | User profile                |
| `/director-dashboard/stripe-connection-success`| StripeConnectionSuccess| Stripe onboarding success callback |

### Evaluator Dashboard (`/evaluator-dashboard`)

| Path                                       | Page              | Description                      |
| ------------------------------------------ | ----------------- | -------------------------------- |
| `/evaluator-dashboard`                     | EvolatorDashboard | Main dashboard                   |
| `/evaluator-dashboard/active-camps`        | MyCamp            | My registered camps              |
| `/evaluator-dashboard/camp/:id`            | CampDetailsPage   | Camp details (tabbed view)       |
| `/evaluator-dashboard/previous-camps`      | PreviousCamps     | Past camp history                |
| `/evaluator-dashboard/find-camps`          | EvolatorFindCamp  | Browse available camps           |
| `/evaluator-dashboard/profile`             | Profile           | User profile                     |

### Referee Dashboard (`/referee-dashboard`)

| Path                                       | Page              | Description                      |
| ------------------------------------------ | ----------------- | -------------------------------- |
| `/referee-dashboard`                       | RefereeDashboard  | Main dashboard                   |
| `/referee-dashboard/active-camps`          | ActiveCamps       | Checked-in & registered camps    |
| `/referee-dashboard/camp/:id`              | CampDetailsPage   | Camp details (tabbed view)       |
| `/referee-dashboard/previous-camps`        | PreviousCamps     | Past camp history                |
| `/referee-dashboard/find-camps`            | FindCamps         | Browse available camps           |
| `/referee-dashboard/payment-success`       | PaymentSuccess    | Payment success page             |
| `/referee-dashboard/payment-cancel`        | PaymentCancel     | Payment cancelled page           |
| `/referee-dashboard/profile`               | Profile           | User profile                     |

---

## ✨ Key Features

### 🔐 Authentication & Security
- Email/password registration with role selection
- Email verification via OTP
- Password reset flow (request → OTP → reset)
- JWT token-based authentication
- Auto-logout on session expiry (401 handling)
- Role-based access control (guards on all dashboard routes)
- Remember me functionality

### 🏕 Camp Management (Director)
- **Create Camp**: Rich form with Google Places Autocomplete, Tiptap rich text editor for descriptions, sports type selection, date pickers, timezone selection, and software fee display
- **Edit Camp**: Update all camp details
- **Camp Overview**: View camp info with edit/delete actions (only for camp creator)
- **Camp Status**: Active/inactive management

### 📅 Schedule & Court Management
- **Build Schedule**: Daily time range setup for each camp date
- **Court Management**: Create and manage multiple courts per camp
- **Game Slots**: Assign referees to specific game slots/courts
- **Schedule Publishing**: Control schedule visibility

### 📋 Roster Management
- **Referees**: View all registered referees with search/filter
- **Evaluators**: View and manage approved evaluators
- **Crews**: Create and manage referee crews
- **Roster Details**: View member information with detailed modals

### 📝 Evaluation System
- **Evaluation Form**: Comprehensive multi-criteria evaluation:
  - Call Accuracy
  - Communication Skills
  - Consistency of Calls
  - Court Position & Mechanics
  - Fitness & Mobility
  - Game Awareness
- **Evaluation Guidelines**: Reference guidelines for scoring
- **Private Comments**: Evaluator-only notes
- **Referee Feedback**: Feedback shared with referees
- **Recommended Level**: Suggested referee level advancement

### 📊 Performance & Rankings
- **Overall Performance**: Aggregated scores and statistics
- **Performance Breakdown**: Detailed metrics across evaluation criteria
- **Ranking Report**: Sorted referee rankings with scoring details
- **Ranking Settings**: Configure ranking parameters and weights
- **Recent Feedback**: Latest evaluator comments

### 👥 Crew Management
- Create and manage referee crews
- Add/remove members to crews
- View crew details
- Crew assignments to game slots

### 🔔 Notification System
- **Real-time Notifications**: In-app notification center
- **Notification Bell**: Unread count badge with dropdown
- **Infinite Scroll**: Paginated notification loading
- **Actions**: Mark as read, mark all read, delete, clear all
- **Types**: Assignments, announcements, schedule changes, removals
- **Auto-refresh**: Polling every 30-60 seconds

### 📢 Announcement System (Director)
- Send announcements to:
  - All members
  - All evaluators
  - All referees
  - Specific users (multi-select)
- Subject and message fields with validation

### 🔍 Camp Discovery & Filtering
- **Advanced Filters**: Sport type, location, date range
- **Sort Options**: Upcoming first, newest, oldest
- **Pagination**: Page-based navigation
- **URL Sync**: Filter state persisted in URL query params
- **Camp Cards**: Rich card display with logo, location, dates, price, sport type

### 💳 Payment & Stripe Connect Integration
- **Stripe Account Onboarding**: Camp Directors can securely link their Stripe accounts via the Connect Onboarding flow to receive registration payments directly.
- **Express Dashboard Access**: Fully onboarded Directors can access their Stripe Express dashboard from Whistle Works for payout/account management.
- **Split Payment Flow**:
  - **Camp Fee**: The base camp registration price (configured by the Director) goes directly to the Camp Director's connected Stripe account.
  - **Technology / Software Fee**: The sport-specific software/technology fee (set by admin) goes directly to the Admin's Stripe account.
- **Discount Coupons**: Referees can apply valid coupon codes during checkout (validated via `/v2/referee/camp/:id/validate-coupon`). The checkout payload includes coupon code context to apply discounts to the final Stripe Checkout session.
- **Payment Success & Cancel Pages**: Routes for successful (`/payment-success`) and cancelled (`/payment-cancel`) registration checkout flows.

### 👤 User Profile Management
- View and edit profile information
- Avatar upload
- Phone number with country code
- Address with Google Places Autocomplete
- Role-based profile paths

### 🏠 CMS-Driven Public Pages
- **Home Page**: Hero, Features, Training Camps, Partners (marquee), Testimonials, CTA
- **About Page**: Mission, Founder/CEO info, stats, team members, features grid
- All content managed via CMS API endpoints

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm**, **yarn**, **pnpm**, or **bun** (package manager)
- **Google Maps API Key** (for Places Autocomplete)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd whistle-works

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_BASE_URL=http://localhost:8000              # Backend API base URL
VITE_ACCESS_TOKEN=access_token                   # Local storage key name for JWT
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key # Google Maps API key
```

### Development

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
# Output: dist/
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🔑 Environment Variables

| Variable                    | Required | Description                                |
| --------------------------- | -------- | ------------------------------------------ |
| `VITE_BASE_URL`             | ✅ Yes   | Backend API base URL (e.g., `http://localhost:8000`) |
| `VITE_ACCESS_TOKEN`         | ✅ Yes   | localStorage key name for JWT token        |
| `VITE_GOOGLE_MAPS_API_KEY`  | ✅ Yes   | Google Maps API key for Places Autocomplete|

---

## 🔌 API Integration

All API requests are routed through Axios instances with consistent error handling.

### API Base URL Pattern

```
{VITE_BASE_URL}/api/{endpoint}
```

### Axios Instance Types

| Instance             | Auth Header | Usage                                      |
| -------------------- | ----------- | ------------------------------------------ |
| `useAxiosPublic()`   | ❌ No       | Login, signup, CMS content, public camp data|
| `useAxiosSecure()`   | ✅ Bearer   | All authenticated requests                 |
| `axiosInstace`       | ✅ Bearer   | Route loaders (React Router `loader` fn)   |

### Key API Endpoints

#### Authentication
- `POST /api/login` — User login
- `POST /api/register` — User registration
- `GET /api/logout` — User logout
- `GET /api/user-details` — Fetch authenticated user

#### Camps
- `GET /api/v1/camp/list` — List camps (with filters)
- `GET /api/v1/camp/details/:id` — Camp details
- `POST /api/v1/camp/create` — Create camp
- `DELETE /api/v1/camp/delete/:id` — Delete camp
- `GET /api/v1/camp/edit/:id` — Get camp edit data
- `GET /api/v1/camp/sports-type` — Sports types
- `GET /api/v1/camp/locations` — Available locations

#### Schedule & Courts
- `GET /api/v1/camp/:id/schedule` — Camp schedule
- `GET /api/v1/camp/:id/date-range` — Date range data

#### Roster
- `GET /api/roster/camp/details/:camp_id` — Full roster details

#### Evaluations
- `POST /api/referee/evaluation/upsert` — Submit/update evaluation
- `GET /api/referee/evaluation/camp/:id/all-referees` — All referees for evaluation

#### Rankings
- `GET /api/referee/evaluation/camp/:id/all-referees` — Ranking data

#### Notifications
- `GET /api/notifications` — List notifications (paginated)
- `GET /api/notifications/counts` — Unread count
- `POST /api/notifications/:id/mark-as-read` — Mark single read
- `POST /api/notifications/mark-all-as-read` — Mark all read
- `DELETE /api/notifications/delete/:id` — Delete notification
- `DELETE /api/notifications/clear-read` — Clear read notifications

#### Announcements
- `POST /api/director/announcement/store` — Send announcement

#### CMS
- `GET /api/cms/home` — Home page CMS content
- `GET /api/cms/about` — About page CMS content

#### Referee-specific
- `POST /api/v1/referee/camp/:id/register` — Register for camp
- `POST /api/v1/referee/camp/:id/checkin` — Check in to camp
- `GET /api/v1/referee/camp/my-checkins` — My checked-in camps
- `GET /api/v1/referee/camp/my-registrations` — My registrations
- `GET /api/referee/camp/:id/assigned-slots` — Assigned game slots
- `GET /api/referee/my-evaluations/:camp_id` — My performance data

#### Evaluator-specific
- `POST /api/evaluator/camp-registration/register` — Register as evaluator
- `GET /api/evaluator/camp-registration/my-registrations` — My registrations

---

## 🔐 Authentication Flow

```
User → Sign In / Sign Up
           │
           ▼
     [Backend validates]
           │
     ┌─────┴─────┐
     │           │
   Success     Error
     │           │
     ▼           ▼
 JWT Token   Show error
 stored in   toast + 
 localStorage  message
     │
     ▼
 [AuthProvider]
     │
     ├─ Store token
     ├─ Fetch user data
     └─ Set isLoggedIn = true
           │
           ▼
    [RoleBasedPrivateRoute]
           │
     ┌─────┴─────┐
     │           │
  Matches    Doesn't match
   role?       role?
     │           │
     ▼           ▼
  Render     Redirect to
  Dashboard  appropriate
             dashboard
```

### Token Management
- **Storage**: JWT stored in `localStorage` under the key specified by `VITE_ACCESS_TOKEN`
- **Refresh**: User data is re-fetched on mount if token exists
- **Expiry**: 401 responses trigger auto-logout + toast notification
- **Storage Sync**: Cross-tab storage change listener keeps auth state in sync

---

## 📦 State Management

### React Query (TanStack Query)

React Query is the primary state management solution, handling all API data:

```javascript
// Query Example
const { data, isLoading } = useQuery({
  queryKey: ["camp-details", campId],
  queryFn: async () => {
    const response = await axiosSecure.get(`/v1/camp/details/${campId}`);
    return response?.data?.data;
  },
  enabled: !!campId,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutation Example
const mutation = useMutation({
  mutationFn: async (formData) => {
    const response = await axiosSecure.post("/endpoint", formData);
    return response?.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["related-data"] });
    toast.success("Success!");
  },
});
```

### Auth Context

```javascript
const { userData, handleLogin, handleLogout, isLoggedIn, accessToken, isLoading } = useAuth();
```

---

## 🎨 UI Component Library

### Custom Components

| Component              | Description                                  |
| ---------------------- | -------------------------------------------- |
| `CommonTitle`          | Section heading with consistent styling      |
| `CommonText`           | Body text with responsive sizing             |
| `CommonInputWrapper`   | Form input with label, errors, validation    |
| `CommonSubmitBtn`      | Styled button (primary/secondary variants)   |
| `CampCard`             | Camp display card with all relevant info     |
| `PaginationV2`         | Reusable pagination component                |
| `Loader` / `LoaderV2`  | Loading spinners                             |
| `ScreenLoading`        | Full-page loading overlay                    |
| `StarRating`           | Star rating display                          |
| `Icon`                 | SVG icon wrapper                             |
| `BackBtn`              | Navigation back button                       |
| `Profile`              | User profile page component                  |
| `EditProfileModal`     | Profile editing modal                        |

### Third-Party Components

- **Ant Design**: `Select`, `DatePicker`, `Modal`, `Tabs`, `Spin`, `Alert`, `Avatar`, `Card`, `Descriptions`, `Input`, `Popover`, `Result`, `Image`
- **Framer Motion**: Page/section entrance animations, modals, popups
- **Tiptap**: Rich text editor for camp descriptions with Bold, Italic, Heading, Bullet List, Ordered List
- **react-fast-marquee**: Auto-scrolling partner logos

---

## 🧪 Testing

> **Note**: The project currently does not have formal unit or integration tests configured. Testing infrastructure (Jest, Vitest, React Testing Library) can be added as needed.

```bash
# Run linting
npm run lint
```

---

## 🚢 Deployment

The project uses Vite for building, outputting to the `dist/` directory.

### Build

```bash
npm run build
```

### Static Deployment

Deploy the `dist/` folder to any static hosting provider:

- **Netlify**: The `public/_redirects` file handles SPA routing
- **Vercel**: Configure `vercel.json` with rewrites
- **Firebase Hosting**: Configure `firebase.json` rewrites
- **Apache/Nginx**: Serve `index.html` for all non-file routes

### SPA Routing

The `public/_redirects` file includes Netlify-compatible redirect rules for SPA routing:

```
/* /index.html 200
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- The project uses ESLint with React-specific rules
- PropTypes validation is disabled (`react/prop-types: off`)
- Path aliases (`@/`) are used for all imports
- Follow existing patterns for consistency

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)
- UI components from [Ant Design](https://ant.design/)
- State management by [TanStack Query](https://tanstack.com/query)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
