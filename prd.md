# Product Requirements Document (PRD)
## Daily Expense Logger for Students

**Version:** 2.0  
**Date:** March 17, 2026  
**Status:** Ready for Development

---

## Table of Contents

1. Product Summary
2. Problem Statement
3. Target Users
4. Product Goals
5. Feature Requirements
6. User Flow
7. UI/UX Guidelines — Material Design 3 (M3)
8. Technical Architecture
9. Database Schema
10. Component Breakdown
11. Future Improvements

---

## 1. Product Summary

**Daily Expense Logger for Students** is a fast, minimal web application that lets students log their daily expenses in under 10 seconds. It works like a smart digital notebook — quick to open, quick to write in, and organized by date.

Version 2.0 introduces a polished Material Design 3 (M3) inspired interface with an animated splash screen on first load, a guest browsing mode, a persistent bottom navigation bar, a user profile page, and category-based spending analytics in the History section.

The design language follows **Google's Material Design 3 / Android 16 Expressive** guidelines — with rounded surfaces, dynamic color, pill-shaped navigation indicators, and fluid transitions. The theme color palette is **Orange, White, and Black**.

---

## 2. Problem Statement

Students make many small purchases daily — canteen food, auto rides, snacks, bus fares. These amounts are easy to forget and add up quickly. Existing finance apps are far too complex and slow for this use case.

Students need something that feels as fast and natural as jotting in a notebook, but with the convenience of categorized history and a clean visual summary of where money went.

---

## 3. Target Users

**Primary User:** College and university students

- Hostel students tracking daily canteen and snack spending
- Commuter students logging transport fares
- Students on a fixed allowance wanting spending awareness
- Any student who wants a no-fuss digital expense log

**User Characteristics:**
- Mobile-first, expects fast and tactile interfaces
- Familiar with Android / Material UI patterns
- Will not tolerate complex onboarding or dashboards
- Wants to glance at spending by category quickly

---

## 4. Product Goals

**Primary Goal:** Log an expense in under 10 seconds.

**Secondary Goals:**
- Allow unauthenticated users to browse and explore the app before committing to sign up
- Provide a user profile section where students can store their identity (name, age, college)
- Show spending breakdowns by category in History
- Deliver a polished, native-feeling Material Design 3 UI on web

**Non-Goals (out of scope):**
- Budget limits or alerts
- Income tracking
- Bank or UPI integrations
- AI suggestions
- Multi-user or shared expenses
- Export / CSV download

---

## 5. Feature Requirements

---

### Feature 1 — Splash Screen (App Launch Animation)

When the website is first opened, a branded splash screen is displayed before entering the app.

**Behavior:**
- App logo (icon + "Daily Expense Logger" text) is centered on screen
- Logo fades in and scales up with a smooth animation (~300ms ease-in)
- After 1.5–2 seconds total, the splash screen fades out and the Dashboard loads
- Splash only plays once per session (not on every navigation)
- Background color: Primary orange (`#FF6B00` or chosen brand orange)
- Logo / text color: White

**Acceptance Criteria:**
- Splash appears on fresh page load
- Transitions smoothly into the Dashboard
- Does not replay on browser back/forward or tab switch
- Animation feels fluid, not janky

---

### Feature 2 — Guest Mode (Browse Without Login)

Users can view the website and explore the interface without creating an account.

**Behavior:**
- Dashboard, History, and Profile pages are all accessible without login
- Top-left of the screen shows two buttons: **Log In** and **Sign Up**
- These buttons are visible at all times in the header when the user is not authenticated
- When a guest tries to perform any action (add expense, delete, save profile), a bottom sheet or inline prompt appears:
  > "Sign in to save your expenses. It's free and takes 10 seconds."
  > [Log In]  [Sign Up]
- Guest mode shows empty state UI — no data is displayed or stored
- Once logged in, the Log In / Sign Up buttons in the header are replaced with a profile avatar or icon

**Acceptance Criteria:**
- Unauthenticated users can open and navigate the app freely
- No actions write to the database without authentication
- Prompt to sign in appears on any interaction that requires auth
- After login, user returns to exactly where they were

---

### Feature 3 — Bottom Navigation Bar (Material Design 3)

The app uses a persistent **M3-style Bottom Navigation Bar** with three destinations.

**Tabs:**

| Tab      | Icon              | Label    | Route       |
|----------|-------------------|----------|-------------|
| Home     | Home icon         | Home     | `/`         |
| History  | Clock/History icon| History  | `/history`  |
| Profile  | Person icon       | Profile  | `/profile`  |

**M3 Design Spec:**
- Navigation bar height: 80dp (with bottom safe area padding on mobile)
- Active tab: Pill-shaped indicator behind the icon (orange tinted surface), icon filled, label visible
- Inactive tab: Icon outlined, label hidden or subtle
- Transitions: Smooth fade/slide between pages when switching tabs
- The bar uses a slightly elevated surface (M3 `Surface` at elevation 2) — subtle shadow or tonal elevation
- Border radius on the active indicator: fully rounded pill (`border-radius: 999px`)
- Icon size: 24dp
- Label font: M3 Label Medium (12sp)
- Colors:
  - Active indicator fill: `#FF6B00` (brand orange) at 20% opacity, icon color: `#FF6B00`
  - Inactive icon color: `#49454F` (M3 on-surface-variant)
  - Bar background: White (`#FFFFFF`) or near-white surface

**Reference:** https://m3.material.io/components/navigation-bar/specs

**Acceptance Criteria:**
- Three tabs visible at all times (except during splash screen)
- Active tab is clearly highlighted with M3 pill indicator
- Tapping a tab navigates to the correct route with smooth transition
- Active state persists on page refresh

---

### Feature 4 — Dashboard / Home (Add + Today's View)

The main screen where users log expenses and see today's list.

**Layout (top to bottom):**
1. **Top app bar:** App name or logo (left), Log In / Sign Up buttons (top-right, guest only) OR profile avatar (top-right, authenticated)
2. **Add Expense Card:** An M3-style elevated card containing the form
3. **Today's Date header:** e.g., "Today · 16 March"
4. **Expense List:** Each entry is an M3 List Item or Card
5. **Daily Total:** Shown at the bottom of today's list in a styled chip or summary row

**Add Expense Form Fields:**

| Field    | Type         | Required | Default      |
|----------|--------------|----------|--------------|
| Amount   | Number input | Yes      | Empty        |
| Category | Chip group / dropdown | Yes | None    |
| Date     | Date picker  | Yes      | Today        |
| Note     | Text field   | No       | Empty        |

**M3 Category Chips:**
Display categories as horizontal scrollable **Filter Chips** (M3 component) instead of a dropdown:
- `Food` `Transport` `Shopping` `Entertainment` `Bills` `Other`
- Selected chip: filled orange background, white text
- Unselected chip: outlined, grey text

**Save Button:**
- M3 **Filled Button**, orange, full-width or prominent
- Label: "Save Expense"

**Expense List Item (each row):**
- Leading: Category icon or color dot
- Title: Amount (bold, large) + Category name
- Trailing: Note text (subdued) + Delete icon button (trash icon)
- Divider between items (subtle)

**Acceptance Criteria:**
- Form is visible without scrolling on mobile
- Category chips scroll horizontally if they overflow
- Saving clears form and appends entry to today's list instantly
- Daily total updates in real time

---

### Feature 5 — History Page with Category Analytics

The History page shows past expenses grouped by date AND provides a visual category breakdown.

**Layout:**

**Section A — Category Analytics (top of History page)**

A summary panel at the top showing spending breakdown by category across all time or the current month.

Display as a **horizontal scrollable row of M3 Cards**, one per category with non-zero spending:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  🍔 Food    │  │ 🚌 Transport│  │ 🛍 Shopping │
│  ₹2,340     │  │  ₹870       │  │  ₹1,100     │
│  42%        │  │  16%        │  │  20%        │
└─────────────┘  └─────────────┘  └─────────────┘
```

Each card shows:
- Category icon/emoji
- Category name
- Total amount spent in that category
- Percentage of total spending

Below the cards, a simple **horizontal bar chart** (pure CSS or a lightweight lib like Recharts) shows category proportions visually using orange tones.

**Toggle:** User can switch between "All Time" and "This Month" for the analytics.

**Section B — Expense History (below analytics)**

Past expenses grouped by date, most recent first.

Each date group:
- Date header (M3 styled, e.g., "15 March · Wednesday")
- List of expenses for that date (same list item style as Dashboard)
- Daily total at the bottom of each group (M3 `Surface Variant` chip)

**Acceptance Criteria:**
- Category analytics are accurate and update when expenses are added/deleted
- Percentage values sum to 100%
- Empty categories are not shown
- History list is scrollable and performant with many entries
- Toggle between All Time / This Month works correctly

---

### Feature 6 — Profile Page

Users can view and edit their personal profile details.

**Profile Fields:**

| Field        | Type   | Required | Notes                  |
|--------------|--------|----------|------------------------|
| Name         | Text   | Yes      | Display name           |
| Age          | Number | No       | Student's age          |
| College Name | Text   | No       | Name of institution    |

**Layout:**
- Top: Large circular avatar (initials-based, orange background) — e.g., if name is "Ravi Kumar", show "RK"
- Below avatar: User's name (large, bold) and email (subdued)
- Form section: Name, Age, College Name fields (M3 Outlined Text Fields)
- **Save Button:** M3 Filled Button — "Save Profile"
- **Edit mode:** Tapping "Edit" makes fields editable; Save commits changes
- Profile data is stored in Supabase (`profiles` table, see Database Schema)

**Logged-Out State (Guest):**
- Shows a prompt: "Create an account to save your profile"
- [Sign Up] button, styled as M3 Filled Button

**Acceptance Criteria:**
- Profile data loads immediately on page open (if logged in)
- Editing and saving works correctly and persists across sessions
- Avatar updates initials if name is changed
- Guest sees a sign-up prompt instead of the form

---

### Feature 7 — Authentication (Login / Sign Up)

**Triggered by:**
- Tapping "Log In" or "Sign Up" buttons in the top-right header (guest mode)
- Tapping the prompt shown when a guest attempts any action

**UI:**
- M3-styled bottom sheet or full-screen modal (not a separate page, to preserve navigation context)
- Two tabs inside: "Log In" and "Sign Up"
- Fields: Email + Password (+ Confirm Password for Sign Up)
- Submit: M3 Filled Button ("Log In" or "Create Account")
- Error states shown inline below fields (M3 error styling — red supporting text)

**Post-login:**
- Sheet dismisses, user stays on the same page/tab they were on
- Header Log In / Sign Up buttons replaced by profile avatar

---

## 6. User Flow

```
APP OPENS
    ↓
[Splash Screen — Logo animation, ~1.5s]
    ↓
[Dashboard — Home Tab]
    │
    ├── Guest User
    │       ├── Can browse app freely
    │       ├── Taps any action → Sign In prompt (bottom sheet)
    │       └── Signs in → Returns to same screen, now authenticated
    │
    └── Logged-In User
            ├── Fills: Amount → Category Chip → (Note) → Save
            ├── Expense appears in today's list instantly
            ├── Can delete any expense
            │
            ├── Taps "History" tab
            │       ├── Views category analytics (cards + bar chart)
            │       ├── Toggles All Time / This Month
            │       └── Scrolls through past date-grouped expenses
            │
            └── Taps "Profile" tab
                    ├── Views name, age, college
                    ├── Taps Edit → edits fields
                    └── Taps Save → data persists
```

---

## 7. UI/UX Guidelines — Material Design 3 (M3)

### Design System Reference
Follow **Material Design 3** specifications from https://m3.material.io

Material Design 3 (also called Material You) is Google's current design system for Android 12–16. It emphasizes:
- **Dynamic color** and tonal palettes
- **Expressive, rounded shapes** (fully rounded buttons, pills, cards)
- **Elevated surfaces** with subtle shadows or color tinting instead of hard borders
- **Motion and transitions** that feel physical and natural

---

### Color Palette

| Token                  | Hex       | Usage                                      |
|------------------------|-----------|--------------------------------------------|
| Primary (Orange)       | `#FF6B00` | Buttons, active icons, chips, accent       |
| On Primary (White)     | `#FFFFFF` | Text/icons on orange surfaces              |
| Primary Container      | `#FFE0C2` | Active nav indicator, chip fill            |
| On Primary Container   | `#331200` | Text inside primary container              |
| Surface                | `#FFFBFE` | Page background, cards                     |
| Surface Variant        | `#F3EDE7` | Input fields, secondary card backgrounds   |
| On Surface             | `#1C1B1F` | Primary text                               |
| On Surface Variant     | `#49454F` | Secondary text, inactive icons             |
| Outline                | `#79747E` | Field borders, dividers                    |
| Error                  | `#B3261E` | Validation errors                          |
| Background             | `#FFFBFE` | App background                             |

---

### Typography (M3 Type Scale)

| Role            | Size  | Weight | Usage                         |
|-----------------|-------|--------|-------------------------------|
| Display Large   | 57sp  | 400    | (not used)                    |
| Headline Large  | 32sp  | 400    | Page titles                   |
| Headline Medium | 28sp  | 400    | Section headers               |
| Title Large     | 22sp  | 400    | Card titles, date headers     |
| Title Medium    | 16sp  | 500    | Expense amounts               |
| Body Large      | 16sp  | 400    | Form field text               |
| Body Medium     | 14sp  | 400    | Notes, secondary text         |
| Label Large     | 14sp  | 500    | Buttons                       |
| Label Medium    | 12sp  | 500    | Nav bar labels                |

Font: **Roboto** (default M3 font, available via Google Fonts)

---

### Shape (M3 Shape Scale)

| Token         | Radius   | Used For                                  |
|---------------|----------|-------------------------------------------|
| Extra Small   | 4dp      | Small chips (non-pill)                    |
| Small         | 8dp      | Small cards, text fields                  |
| Medium        | 12dp     | Cards, dialogs                            |
| Large         | 16dp     | Sheets, large cards                       |
| Extra Large   | 28dp     | FABs, large containers                    |
| Full          | 999dp    | Buttons, nav indicators, avatar           |

**Key rule:** Buttons, filter chips, avatar, nav indicators, and FABs are always **fully rounded** (`border-radius: 999px`).

---

### M3 Components Used

**Navigation Bar:**
- Background: White surface
- 80px height
- Active destination: Pill indicator (`border-radius: 999px`, `background: #FFE0C2`)
- Active icon: Filled, color `#FF6B00`
- Inactive icon: Outlined, color `#49454F`
- Label: 12sp, M3 Label Medium
- No divider line — use subtle elevation shadow instead

**Filled Button (primary action):**
```css
background: #FF6B00;
color: #FFFFFF;
border-radius: 999px;
padding: 10px 24px;
font: 500 14sp Roboto;
box-shadow: M3 elevation level 0 (flat, no shadow by default);
/* On hover: state layer overlay 8% white */
/* On press: ripple effect, state layer 12% */
```

**Outlined Text Field (inputs):**
```
Border: 1px solid #79747E (outline)
Border on focus: 2px solid #FF6B00
Label: Float above field on focus/fill
Corner radius: 4dp
```

**Filter Chips (category selection):**
```
Unselected: outlined border, grey label, white fill
Selected:   filled #FFE0C2 background, #FF6B00 label, optional checkmark
Border-radius: 999px (pill shape)
Height: 32dp
```

**Cards (expense entries, analytics):**
```
Background: #FFFBFE (Surface)
Border-radius: 12dp (M3 Medium shape)
Elevation: Level 1 (subtle shadow or tonal surface)
Padding: 16dp
```

**Bottom Sheet (auth prompt):**
```
Border-radius top: 28dp (M3 Large)
Background: Surface (#FFFBFE)
Handle bar: centered, 32x4dp, #79747E
Drag to dismiss: yes
```

---

### Splash Screen Spec

```
Background:    #FF6B00 (brand orange)
Logo icon:     White, centered, ~80x80dp
App name text: "Daily Expense Logger", White, Headline Medium
Animation:
  - Start: opacity 0, scale 0.8
  - End:   opacity 1, scale 1.0
  - Easing: cubic-bezier(0.34, 1.56, 0.64, 1)  ← M3 "Emphasized" spring easing
  - Duration: 400ms
  - Hold: 1200ms
  - Exit: fade out 300ms, then show Dashboard
```

---

### Motion / Transitions

| Transition            | Type                          | Duration |
|-----------------------|-------------------------------|----------|
| Splash → Dashboard    | Fade out splash + fade in app | 300ms    |
| Tab switch            | Fade through                  | 200ms    |
| Expense added to list | Slide in from top             | 250ms    |
| Expense deleted       | Fade + collapse               | 200ms    |
| Bottom sheet open     | Slide up from bottom          | 300ms    |

Use **M3 Emphasized easing** for entrances: `cubic-bezier(0.05, 0.7, 0.1, 1.0)`  
Use **M3 Emphasized Accelerate** for exits: `cubic-bezier(0.3, 0.0, 0.8, 0.15)`

---

### Responsive Behavior

- Design is **mobile-first** (375px base width)
- On desktop (>768px): Content is max-width 480px, centered, with the rest of the background showing as a subtle grey
- Bottom nav bar stays pinned to bottom even on desktop (simulating a phone frame if desired)
- No hamburger menu — bottom nav is the only navigation

---

## 8. Technical Architecture

### Frontend

| Technology     | Purpose                                          |
|----------------|--------------------------------------------------|
| React + Vite   | UI framework, fast development and HMR           |
| Tailwind CSS   | Utility styling (custom M3 tokens configured)    |
| Framer Motion  | Animations — splash, transitions, list entrances |
| Recharts       | Category analytics bar chart in History          |
| React Router v6| Page routing (Dashboard, History, Profile)       |
| Day.js         | Date formatting and manipulation                 |

**Note on Tailwind + M3:** Configure Tailwind's `theme.extend` to include M3 color tokens, border-radius values, and typography scale so all components are consistent.

### Backend & Database

| Technology       | Purpose                                       |
|------------------|-----------------------------------------------|
| Supabase         | Auth, Database, Row Level Security            |
| PostgreSQL       | Relational database managed by Supabase       |
| Supabase Auth    | Email/password authentication                 |
| Supabase JS SDK  | Frontend client for all DB and auth calls     |

### Hosting

| Service        | Purpose                 |
|----------------|-------------------------|
| Vercel         | Frontend deployment      |
| Supabase Cloud | Backend and database     |

---

### Project Structure

```
/src
  /components
    SplashScreen.jsx         → Animated splash with logo
    BottomNavBar.jsx         → M3 navigation bar (Home/History/Profile)
    TopAppBar.jsx            → Header with Login/Signup or avatar
    ExpenseForm.jsx          → Add expense form with chip selector
    ExpenseItem.jsx          → Single expense row (M3 list item)
    ExpenseDayGroup.jsx      → Date header + list + daily total
    CategoryCard.jsx         → Analytics card (icon, total, %)
    CategoryBarChart.jsx     → Recharts bar chart for category breakdown
    AuthSheet.jsx            → Bottom sheet login/signup modal
    GuestPrompt.jsx          → Inline nudge for unauthenticated actions
  /pages
    Dashboard.jsx            → Home tab
    History.jsx              → History tab with analytics
    Profile.jsx              → Profile tab
  /lib
    supabaseClient.js        → Supabase initialization
    useAuth.js               → Auth context hook
    useExpenses.js           → Expense data fetching hook
  /constants
    categories.js            → Category list with icons and colors
    theme.js                 → M3 color tokens
  App.jsx                    → Router + auth context + splash gate
  main.jsx                   → Entry point
```

---

## 9. Database Schema

### Table 1: `expenses`

| Column       | Type           | Constraints                             | Description                     |
|--------------|----------------|-----------------------------------------|---------------------------------|
| `id`         | UUID           | PRIMARY KEY, default: gen_random_uuid() | Unique expense ID               |
| `user_id`    | UUID           | NOT NULL, FK → auth.users(id)           | Links to authenticated user     |
| `amount`     | NUMERIC(10,2)  | NOT NULL, CHECK (amount > 0)            | Expense amount                  |
| `category`   | TEXT           | NOT NULL                                | One of 6 defined categories     |
| `note`       | TEXT           | NULLABLE                                | Optional short description      |
| `date`       | DATE           | NOT NULL, default: CURRENT_DATE         | Date of the expense             |
| `created_at` | TIMESTAMPTZ    | NOT NULL, default: NOW()                | Record creation timestamp       |

---

### Table 2: `profiles`

| Column         | Type        | Constraints                             | Description                   |
|----------------|-------------|-----------------------------------------|-------------------------------|
| `id`           | UUID        | PRIMARY KEY, FK → auth.users(id)        | Same as auth user ID          |
| `name`         | TEXT        | NULLABLE                                | Display name                  |
| `age`          | INTEGER     | NULLABLE, CHECK (age > 0 AND age < 120) | Student's age                 |
| `college_name` | TEXT        | NULLABLE                                | Name of college/university    |
| `updated_at`   | TIMESTAMPTZ | NOT NULL, default: NOW()                | Last profile update time      |

---

### SQL: Create Tables

```sql
-- Expenses table
CREATE TABLE expenses (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount      NUMERIC(10,2)  NOT NULL CHECK (amount > 0),
  category    TEXT           NOT NULL,
  note        TEXT,
  date        DATE           NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id           UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT,
  age          INTEGER      CHECK (age > 0 AND age < 120),
  college_name TEXT,
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Auto-create a blank profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

### Row Level Security (RLS)

```sql
-- ==============================
-- EXPENSES TABLE RLS
-- ==============================
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================
-- PROFILES TABLE RLS
-- ==============================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

### Useful Queries

```sql
-- Today's expenses
SELECT * FROM expenses
WHERE user_id = auth.uid() AND date = CURRENT_DATE
ORDER BY created_at ASC;

-- All expenses grouped by date
SELECT date, SUM(amount) AS daily_total, COUNT(*) AS count
FROM expenses
WHERE user_id = auth.uid()
GROUP BY date
ORDER BY date DESC;

-- Category analytics — all time
SELECT category, SUM(amount) AS total,
       ROUND(SUM(amount) * 100.0 / SUM(SUM(amount)) OVER (), 1) AS percentage
FROM expenses
WHERE user_id = auth.uid()
GROUP BY category
ORDER BY total DESC;

-- Category analytics — this month
SELECT category, SUM(amount) AS total,
       ROUND(SUM(amount) * 100.0 / SUM(SUM(amount)) OVER (), 1) AS percentage
FROM expenses
WHERE user_id = auth.uid()
  AND date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY category
ORDER BY total DESC;
```

---

## 10. Component Breakdown

### SplashScreen.jsx
- Renders orange full-screen background with centered logo + text
- Runs Framer Motion animation (scale + fade in → hold → fade out)
- Parent `App.jsx` conditionally renders app only after splash completes
- Uses `sessionStorage` flag to skip splash on subsequent navigations within the session

### BottomNavBar.jsx
- Three `NavLink` items using React Router
- Active detection via `useLocation()`
- Active item: renders pill `div` behind icon using absolute positioning + `border-radius: 999px`
- Animated indicator slides between positions using Framer Motion `layoutId`
- Icons from `lucide-react` or Material Symbols

### AuthSheet.jsx
- Conditionally shown when `isGuest && actionAttempted`
- Framer Motion `AnimatePresence` for slide-up / slide-down
- Tab switch between Log In and Sign Up
- Calls `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`

### ExpenseForm.jsx
- Category selection as horizontally scrollable chip row
- Amount input: `type="number"`, `inputMode="decimal"`
- Date picker: HTML `<input type="date">` styled with M3 outline field CSS
- On submit: calls `supabase.from('expenses').insert(...)`, then fires `onSuccess` callback

### CategoryCard.jsx + CategoryBarChart.jsx
- Cards display icon, name, total, percentage
- Chart uses Recharts `BarChart` with custom orange color scheme
- Data fetched via `useExpenses` hook filtering by `all` or `month`

### Profile.jsx
- On mount: `supabase.from('profiles').select('*').eq('id', user.id)`
- Edit mode toggle: controlled via `isEditing` state
- On save: `supabase.from('profiles').upsert({ id: user.id, name, age, college_name, updated_at: new Date() })`
- Avatar: first two initials from name, rendered as styled `div` with orange background

---

## 11. Future Improvements

| Feature                         | Notes                                                  |
|---------------------------------|--------------------------------------------------------|
| Monthly spending summary        | Total per month with comparison to previous month      |
| Edit expense entries            | Allow correcting amount, category, or note             |
| Filter history by category      | Tap a category card to filter history list             |
| Dark mode                       | M3 dark theme support (automatic from system setting)  |
| Swipe to delete on mobile       | Touch gesture for faster deletion                      |
| PWA / offline mode              | Log without internet, sync when reconnected            |
| Push notifications              | Optional daily reminder to log expenses                |
| Google Sign-In                  | Via Supabase OAuth provider                            |
| Profile photo upload            | Supabase Storage for avatar images                     |
| Export to CSV                   | Simple download of expense history                     |

---

*End of PRD — Daily Expense Logger for Students v2.0*