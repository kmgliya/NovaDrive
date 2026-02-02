# NovaDrive — Premium Booking Platform (Frontend)

NovaDrive is a Next.js App Router frontend for a premium booking platform inspired by SIXT.
Built per **Test Assignment #2 (Frontend: Dashboard + Business Logic)** with strict FSD architecture, complex slot logic,
optimistic updates, and realistic admin UX.

## Stack

- **Next.js 16 (App Router)** + TypeScript
- **Tailwind CSS** + `clsx`/`tailwind-merge`
- **React Query** for server state
- **Zustand** for UI/navigation state (wizard, slot locks, auth)
- **Axios** with mock adapter (latency, conflicts, partial errors)
- **Recharts** for dashboards
- **Lucide React** icons

## Architecture (FSD)

```
shared/     ui, api, utils, i18n
entities/   service, specialist, schedule, timeSlot, booking, user
features/   create-booking, reschedule-booking, cancel-booking, lock-slot, auth
widgets/    service-selector, specialist-schedule, booking-summary, user-bookings
app/        services, booking, profile, admin, about, catalog
```

Business logic (slot generation, locks, conflicts) is isolated from UI.

## Core Requirements Implemented

### Data Models (TypeScript)
- **Service**: id, title, duration, price, buffer before/after
- **Specialist**: id, name, specialization, weekly working hours, services, avatar
- **TimeSlot**: id, specialistId, start/end, status (free/locked/booked)
- **Booking**: id, serviceId, specialistId, timeSlotId, client, status, createdAt
- **User**: id, name, phone, role

### Slot Generation & Availability
- Generates **2–3 realistic slots per day** per specialist.
- Considers: working hours, service duration, buffer before/after.
- Excludes intersections with existing bookings.

### Slot Locking (3 minutes)
- Selecting a slot locks it for 3 minutes.
- Lock is released automatically if not confirmed.
- Locks are persisted in UI state with timer cleanup.

### Booking Wizard (4 steps)
1) Select service
2) Select specialist
3) Select date/time slot
4) Payment + confirmation

Wizard state is persisted in Zustand (page refresh does not reset flow).

### Reschedule & Cancel (Optimistic)
- Reschedule booking with conflict checks.
- Optimistic updates + rollback on API error.
- Cancel booking updates UI immediately.

### User Profile
- Shows user data (name, email, phone, status)
- Shows **active** and **past** bookings
- Allows reschedule/cancel for active bookings

### Admin Panel
- Dashboard with revenue trend + dataset-driven chart
- Car management
- Specialist management (edit name, avatar, specialization)
- Admin access protected by role

## Data & Mock API

- Mock API simulates latency, conflicts, partial failures.
- Bookings and specialists persist in `localStorage` for realism.
- Admin changes persist across reloads.

## Car Dataset Integration (Kaggle)

Dataset: https://www.kaggle.com/datasets/CooperUnion/cardataset  
Local CSV:
```
public/data/car_dataset.csv
```
Dashboard uses it to compute:
- **Average MSRP**
- **Total models**
- **Top makes** (bar chart)

Replace `public/data/car_dataset.csv` with the full Kaggle CSV to make dashboard fully data‑driven.

## Localization (RU/EN)

Locale switcher near the logo.
All key UI text is translated via `useI18n` store.

## Pages / Routes

- `/` — Home
- `/services` — Services selection
- `/booking` — Booking wizard
- `/profile` — User profile + bookings
- `/admin` — Admin dashboard (guarded)
- `/about` — About page with video + Google Map (Bishkek address)
- `/catalog` — Car catalog
- `/login` `/register` — Auth (mock)

## Admin Access

To register/login as admin, use **Admin code**:
```
novadrive-admin
```

Admin menu is visible only for users with role `admin`.

## Payment UX (Mock)

Payment is mock but behaves realistically:
- Card fields accept numeric input
- Confirmation requires all fields filled
- Total is shown in the payment block

No real charges are made.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Notes / Trade-offs

- Mock API is used to simulate real backend scenarios (conflicts, delays).
- Data is persisted in localStorage to simulate multi-session usage.
- Admin role is simulated with a secret code instead of backend authorization.

## Test Assignment Coverage Checklist

- ✅ FSD structure
- ✅ Complex slot generation
- ✅ Slot locking + timers
- ✅ Booking wizard with persisted state
- ✅ Reschedule + cancel (optimistic + rollback)
- ✅ User profile with active/past bookings
- ✅ Background sync (refetch intervals)
- ✅ Conflict simulation and partial errors
- ✅ Strict typing and state separation
- ✅ Dynamic admin dashboard with dataset
