# Q-Zone Manager — Project Documentation

## Product Purpose

Q-Zone is an offline-first POS and club-management app for a snooker/pool club. It manages table sessions, waiting lists, customers, payments, expenses, reports, and settings — all designed for tablet-first landscape use with responsive phone layouts.

---

## Business Rules

### Resources & Rates

| Resource | Rate (₹/hour) | Notes |
|----------|---------------|-------|
| Snooker Table (Full) | 300 | 12-ft, tournament cloth |
| Snooker Table (Half) | 180 | Per half-table session |
| Pool Table | 200 | 9-ft, standard cloth |
| Coaching (per hour) | 500 | One-on-one with coach |

- Rates are configurable in Settings and stored in the database
- Rate changes apply only to new sessions; active sessions retain their starting rate

### Billing Rules

1. **12-minute grace period** — No charge if session ends within 12 minutes of start
2. **Proportional extra billing** — After grace period, billed per minute at the hourly rate (rate ÷ 60)
3. **Final amount rounded up** — Total rounded up to the nearest ₹10
4. **Minimum charge** — ₹50 (covers grace period exit)

**Examples:**
- 10 min session → ₹0 (within grace)
- 25 min @ ₹300/hr → (25 × 5) = ₹125 → ₹130 (rounded up)
- 67 min @ ₹300/hr → (67 × 5) = ₹335 → ₹340
- 13 min @ ₹200/hr → (13 × 3.33) = ₹43.33 → ₹50 (minimum)

### Session Lifecycle

```
Available → Occupied (timer starts) → Paused (optional) → Completed → Payment → Available
                     ↓
              Waiting List (if all tables full)
```

- Only one active session per table at a time
- Sessions can be paused (max 30 min) — pause time excluded from billing
- Walk-ins create immediate sessions; reservations add to waitlist

### Waiting List

- FIFO queue per table type (Snooker Full / Snooker Half / Pool)
- Auto-promote when table frees: notify customer, 5-min window to claim
- Walk-in customers can join waitlist while playing on another table

### Customers

- Phone number = unique identifier (no auth required for walk-ins)
- Optional: name, email, preferred table type, notes
- Visit history, total spent, loyalty tier (Bronze/Silver/Gold)
- Quick-select from recent customers on new session

### Payments (Transactions)

- Cash, UPI, Card, Wallet (club credit)
- Split payments allowed across methods
- Partial payments create "pending" balance on customer
- Receipt auto-generated (thermal printer ready)

### Expenses

- Categories: Consumables, Maintenance, Utilities, Staff, Marketing, Other
- Linked to table/session when applicable
- Monthly budget tracking with alerts

### Reports

- Daily/Weekly/Monthly revenue
- Table utilization % (occupied hours ÷ open hours)
- Peak hours heatmap
- Customer lifetime value
- Expense breakdown
- Export CSV/PDF

---

## Architecture

### High-Level

```
┌─────────────────────────────────────────────────────────────┐
│                      React Native (Expo)                     │
├──────────────────┬──────────────────────┬────────────────────┤
│   Screens        │   Components         │   Hooks            │
│  (Expo Router)   │   (UI, Layout,       │   (Data, UI)       │
│                  │    Shared)           │                    │
├──────────────────┼──────────────────────┼────────────────────┤
│   Features       │   Stores             │   Services         │
│   (Domain logic) │   (Zustand)          │   (DB, Sync,       │
│                  │                      │    Export)         │
├──────────────────┼──────────────────────┼────────────────────┤
│   Repositories   │   Database           │   Types            │
│   (CRUD per      │   (expo-sqlite)      │   (TypeScript)     │
│    resource)     │                      │                    │
├──────────────────┼──────────────────────┼────────────────────┤
│   Theme          │   Utils              │                    │
│   (Tokens)       │   (Billing, Date,    │                    │
│                  │    Format, Valid)    │                    │
└──────────────────┴──────────────────────┴────────────────────┘
```

### Data Flow

1. **UI** → Hook → Store (optimistic update)
2. **Store** → Repository → SQLite (persist)
3. **Background** → Sync Service → Remote (when online)
4. **Repository** → Hook → Store → UI (reactive)

### Offline-First Strategy

- All writes go to local SQLite immediately
- `sync_status` column: `synced` | `pending` | `conflict`
- Background sync on app focus + every 5 min
- Conflict resolution: server wins for settings, local wins for sessions
- Queue stored in `sync_queue` table with retry logic

---

## Technology Stack

| Category | Choice | Version |
|----------|--------|---------|
| Framework | Expo + React Native | SDK 58 |
| Router | Expo Router (file-based) | ~58.0.32 |
| Language | TypeScript | ~6.0.3 |
| Database | expo-sqlite (SQLite) | ~58.0.18 |
| State | Zustand | ^5.1.0 |
| Icons | lucide-react-native | ^1.79.0 |
| Animation | react-native-reanimated | 4.7.1 |
| Gestures | react-native-gesture-handler | ~3.3.0 |
| Fonts | expo-font + Google Sans | ~58.0.12 |
| UI Primitives | @expo/ui | ~58.0.29 |
| Styling | StyleSheet + CSS variables | — |

---

## Visual Direction

### Reference: CosyPOS

Adapt the CosyPOS layout patterns:
- **Dark charcoal workspace** (`#111111` dark / `#F3F5F4` light)
- **Compact left navigation sidebar** (68px collapsed, 170px expanded)
- **Central resource grid** — responsive card grid (tables, waitlist, customers)
- **Right contextual details panel** — slides in on selection (320px tablet, full-screen phone)
- **Bottom operational status area** — live timer, active sessions count, alerts

### Color System (Current Implementation)

#### Dark Theme (Primary)

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#111111` | Main workspace background |
| `surface` | `#222222` | Cards, panels, sidebar |
| `surfaceSecondary` | `#303030` | Hover/pressed states, inputs |
| `border` | `#272C2E00` | Dividers, card borders (transparent) |
| `text.primary` | `#F4F5F4` | Primary text |
| `text.secondary` | `#A6A9AA` | Secondary text, labels |
| `text.muted` | `#777E80` | Placeholders, disabled |
| `accent` | `#AFCBC5` | Primary actions, active states (muted teal) |
| `accentSecondary` | `#C2DBE9` | Info, links, secondary actions (ice blue) |
| `sage` | `#CFDDDB` | Success, completed, positive |
| `status.available` | `#65B99A` | Available tables |
| `status.occupied` | `#E3BE78` | Occupied tables |
| `status.paused` | `#A9C5D2` | Paused sessions |
| `status.error` | `#D87979` | Errors, destructive |

#### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#F3F5F4` | Main workspace background |
| `surface` | `#FFFFFF` | Cards, panels, sidebar |
| `surfaceSecondary` | `#E9EEEC` | Hover/pressed states, inputs |
| `border` | `#DDE2E3` | Dividers, card borders |
| `text.primary` | `#111315` | Primary text |
| `text.secondary` | `#676767` | Secondary text, labels |
| `text.muted` | `#929999` | Placeholders, disabled |
| `accent` | `#AFCBC5` | Primary actions, active states |
| `accentSecondary` | `#C2DBE9` | Info, links, secondary actions |
| `sage` | `#CFDDDB` | Success, completed, positive |
| `status.available` | `#279B75` | Available tables |
| `status.occupied` | `#B98935` | Occupied tables |
| `status.paused` | `#6C9CB3` | Paused sessions |
| `status.error` | `#C65C5C` | Errors, destructive |

**Note:** Current colors differ from CLAUDE.md specification. Implementation uses muted teal (`#AFCBC5`) as primary accent instead of bright teal (`#2DD4BF`). Background is pure black (`#111111`) vs charcoal (`#1A1C1E`). Update theme tokens when implementing final design system.

### Typography

**Font Family:** Google Sans (400 Regular, 500 Medium, 600 SemiBold, 700 Bold) — loaded via expo-font

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `display-large` | 32 | 700 | 40 | -0.5 |
| `display-medium` | 28 | 600 | 36 | -0.25 |
| `display-small` | 24 | 600 | 32 | 0 |
| `heading-large` | 20 | 600 | 28 | 0 |
| `heading-medium` | 18 | 600 | 26 | 0 |
| `heading-small` | 16 | 600 | 24 | 0 |
| `body-large` | 16 | 400 | 24 | 0 |
| `body-medium` | 14 | 400 | 22 | 0 |
| `body-small` | 12 | 400 | 20 | 0 |
| `label-large` | 14 | 500 | 20 | 0.1 |
| `label-medium` | 12 | 500 | 18 | 0.2 |
| `label-small` | 11 | 500 | 16 | 0.3 |
| `code` | 13 | 400 | 20 | 0 | (monospace)
| `timer` | 48 | 700 | 56 | -1 | (session timer)

### Spacing Scale

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | — |
| `space-1` | 4 | Tight gaps |
| `space-2` | 8 | Standard gaps |
| `space-3` | 12 | Medium gaps |
| `space-4` | 16 | Standard padding |
| `space-5` | 20 | Medium padding |
| `space-6` | 24 | Large padding, section gaps |
| `space-8` | 32 | XL gaps |
| `space-10` | 40 | Section spacing |
| `space-12` | 48 | Major section spacing |

### Border Radius

| Token | Value |
|-------|-------|
| `radius-none` | 0 |
| `radius-sm` | 4 |
| `radius-md` | 8 |
| `radius-lg` | 12 |
| `radius-xl` | 16 |
| `radius-full` | 9999 |

### Shadows (Dark Theme)

| Token | Value |
|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` |
| `shadow-md` | `0 4px 8px rgba(0,0,0,0.4)` |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.5)` |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.6)` |

### Shadows (Light Theme)

| Token | Value |
|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow-md` | `0 4px 8px rgba(0,0,0,0.08)` |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.16)` |

### Icons

**Library:** Lucide React Native
- Size scale: 16 (inline), 20 (UI), 24 (navigation), 32 (feature)
- Stroke width: 2 (consistent)
- Use `stroke` color tokens, never `fill`

---

## Responsive Behavior

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `phone` | < 600px | Portrait phones |
| `phone-landscape` | 600–840px | Landscape phones |
| `tablet` | 840–1200px | Tablets portrait |
| `tablet-landscape` | 1200px+ | Tablets landscape (primary) |
| `desktop` | 1440px+ | Web/desktop |

### Layout Adaptation

| Component | Phone (Portrait) | Phone (Landscape) | Tablet (Portrait) | Tablet (Landscape) |
|-----------|------------------|-------------------|-------------------|---------------------|
| Sidebar | Bottom tab bar | Collapsed (68px) | Collapsed (68px) | Expanded (170px) |
| Resource Grid | Single column | 2 columns | 2 columns | 3–4 columns |
| Details Panel | Full-screen modal | Full-screen modal | Right panel (320px) | Right panel (320px) |
| Status Bar | Bottom fixed | Bottom fixed | Bottom fixed | Bottom fixed |
| Table Cards | Full width | Half width | Half width | Third/quarter width |

### Navigation Patterns

- **Phone:** Bottom tabs (5 max) + modal sheets for details
- **Tablet:** Left rail (icon + label) + persistent details panel
- **Web:** Same as tablet landscape

---

## Animation Principles

### Guiding Rules

1. **Purposeful** — Every animation communicates state change
2. **Fast** — 150–250ms for micro, 300–400ms for transitions
3. **Respect reduced motion** — Disable non-essential motion
4. **Thread-aware** — UI thread for layout, worklet for gestures
5. **Interruptible** — No animation locks the UI

### Motion Tokens

| Token | Duration | Easing | Use Case |
|-------|----------|--------|----------|
| `motion-instant` | 0ms | linear | Immediate feedback |
| `motion-quick` | 150ms | `cubic-bezier(0.2, 0, 0, 1)` | Press, hover, toggle |
| `motion-standard` | 250ms | `cubic-bezier(0.2, 0, 0, 1)` | Panel slide, card expand |
| `motion-smooth` | 350ms | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Screen transition, modal |
| `motion-spring` | — | `spring({damping: 18, stiffness: 180})` | Drawer, sheet, drag |
| `motion-bounce` | — | `spring({damping: 12, stiffness: 200})` | Success, celebration |

### Key Animations

| Interaction | Animation |
|-------------|-----------|
| Table card press | Scale 0.98 → 1.0 (150ms), background ripple |
| Sidebar expand/collapse | Width spring (320ms), icon translate (280ms) |
| Details panel slide | TranslateX spring (350ms), fade backdrop |
| Session timer tick | Number flip (100ms), pulse on minute change |
| Waitlist promotion | Slide up + highlight (400ms), sound |
| Payment success | Checkmark draw (500ms), confetti burst |
| Pull-to-refresh | Spinner spring, content translate |
| Tab switch | Cross-fade (200ms), indicator slide |

---

## Working Agreement

> **ChatGPT provides the UI code and design direction; Claude assists only when requested with project setup, backend integration, debugging and refactoring.**

### Division of Responsibilities

| Area | Owner |
|------|-------|
| Visual design, component UI, screens, styling, animations | ChatGPT |
| Project scaffolding, folder structure, config | Claude (on request) |
| Database schema, migrations, repositories | Claude (on request) |
| Business logic (billing, sync, auth) | Claude (on request) |
| Zustand stores, hooks, services | Claude (on request) |
| TypeScript types, utilities | Shared |
| Debugging, performance, refactoring | Claude (on request) |
| EAS build, deploy, native config | Claude (on request) |

### Collaboration Protocol

1. **ChatGPT leads UI** — Creates screens, components, theme tokens, animations
2. **Claude supports backend** — Implements repositories, services, stores when asked
3. **Shared types** — Both reference `src/types/`; Claude maintains, ChatGPT consumes
4. **No duplicate work** — Check existing files before creating
5. **Request explicitly** — "Claude, please implement X" — no assumptions

---

## Current Folder Structure

```
qzone-manager/
├── assets/
│   ├── fonts/
│   │   ├── GoogleSans-Bold.ttf
│   │   ├── GoogleSans-Medium.ttf
│   │   ├── GoogleSans-Regular.ttf
│   │   ├── GoogleSans-SemiBold.ttf
│   │   └── OFL.txt
│   ├── images/
│   │   ├── android-icon-background.png
│   │   ├── android-icon-monochrome.png
│   │   └── ...
│   └── logos/
│       ├── enhanced.avif
│       └── enhanced-op.avif
├── src/
│   ├── app/
│   │   ├── _layout.tsx              # Root layout: ThemeProvider, Stack, font loading
│   │   ├── index.tsx                # Redirects to /(main)/dashboard
│   │   └── (main)/                  # Main tab navigation group
│   │       ├── _layout.tsx          # Layout: Sidebar, TopHeader, Stack, BottomStatusBar
│   │       ├── dashboard.tsx        # ScreenPlaceholder (Dashboard)
│   │       ├── bookings.tsx         # ScreenPlaceholder (Bookings)
│   │       ├── waitlist.tsx         # ScreenPlaceholder (Waitlist)
│   │       ├── booking-history.tsx  # ScreenPlaceholder (Booking History)
│   │       ├── analytics.tsx        # ScreenPlaceholder (Analytics)
│   │       ├── customers.tsx        # ScreenPlaceholder (Customers)
│   │       ├── food.tsx             # ScreenPlaceholder (Food & Beverages)
│   │       └── settings.tsx         # ScreenPlaceholder (Settings)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Collapsible animated sidebar (68/170px)
│   │   │   ├── TopHeader.tsx        # Header with logo, date, theme toggle, notifications
│   │   │   ├── BottomStatusBar.tsx  # Status bar: online/offline, resource counts
│   │   │   ├── layout.types.ts      # TypeScript interfaces for layout props
│   │   │   └── index.ts
│   │   ├── shared/
│   │   │   ├── ScreenPlaceholder.tsx # Placeholder screen component
│   │   │   └── index.ts
│   │   └── ui/
│   │       └── index.ts             # Empty - primitive components to be created
│   ├── features/                    # Domain-specific modules (empty index.ts files)
│   │   ├── dashboard/
│   │   ├── sessions/
│   │   ├── waiting-list/
│   │   ├── customers/
│   │   ├── transactions/
│   │   ├── reports/
│   │   ├── expenses/
│   │   └── settings/
│   ├── theme/                       # Design tokens (partial implementation)
│   │   ├── colors.ts                # ✓ darkColors, lightColors implemented
│   │   ├── typography.ts            # ✗ Empty - needs implementation
│   │   ├── spacing.ts               # ✗ Empty - needs implementation
│   │   ├── shadows.ts               # ✗ Empty - needs implementation
│   │   ├── motion.ts                # ✗ Empty - needs implementation
│   │   ├── ThemeProvider.tsx        # ✓ ThemeContext with dark/light toggle
│   │   └── index.ts                 # ✓ Exports colors, fonts
│   ├── hooks/
│   │   ├── use-theme.ts             # ⚠ Broken - imports from non-existent @/constants/theme
│   │   └── index.ts
│   ├── stores/
│   │   └── index.ts                 # Empty - Zustand stores to be created
│   ├── services/
│   │   └── index.ts                 # Empty - services to be created
│   ├── repositories/
│   │   └── index.ts                 # Empty - repositories to be created
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql  # Empty - schema to be created
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts                 # Empty - types to be created
│   └── utils/
│       └── index.ts                 # Empty - utilities to be created
├── CLAUDE.md
├── app.json
├── package.json
└── tsconfig.json
```

---

## Current State (As Analyzed)

### ✅ Completed
- Expo SDK 58 project initialized with all dependencies
- Google Sans fonts in `assets/fonts/` and loaded in RootLayout
- Expo Router with (main) route group and 8 screens
- ThemeProvider with dark/light mode toggle
- Layout components: Sidebar (animated collapse/expand), TopHeader, BottomStatusBar
- ScreenPlaceholder for empty screen states
- Folder structure matches specification
- TypeScript config with strict mode

### ⚠️ Issues to Fix
1. **Broken hook**: `src/hooks/use-theme.ts` imports from `@/constants/theme` which doesn't exist — should use `src/theme/ThemeProvider`
2. **Empty theme tokens**: `spacing.ts`, `typography.ts`, `shadows.ts`, `motion.ts` are empty
3. **Color mismatch**: Current implementation uses `#111111`/`#AFCBC5` vs CLAUDE.md spec `#1A1C1E`/`#2DD4BF`
4. **Empty backend files**: database migration, types, stores, services, repositories, utils all empty
5. **No navigation tabs**: MainLayout uses Stack only — no bottom tab bar for phone
6. **Logo asset**: TopHeader references `../../../assets/logos/enhanced.avif` — verify exists

### 📋 Next Steps (for ChatGPT/UI Implementation)
1. Fix `use-theme.ts` hook to use ThemeProvider context
2. Implement complete theme token system (spacing, typography, shadows, motion)
3. Create primitive UI components in `src/components/ui/`
4. Build feature components in `src/features/`
5. Implement actual screen content replacing ScreenPlaceholders
6. Add bottom tab navigation for phone layouts
7. Create database schema and repositories
8. Implement Zustand stores with offline-first sync

---

**Status**: Initial scaffold complete. Ready for UI implementation by ChatGPT. Backend integration by Claude on request.