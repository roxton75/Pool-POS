# Q-Zone Manager

Offline-first POS and club-management app for snooker/pool clubs. Built with Expo, React Native, TypeScript, and Expo Router.

## Features

- **Table Sessions** — Start, pause, resume, and end sessions with live timers
- **Waitlist Management** — FIFO queues per table type with auto-promotion
- **Customer Directory** — Phone-based identity, visit history, loyalty tiers
- **Payments (Transactions)** — Cash, UPI, Card, Wallet; split payments, receipts
- **Expense Tracking** — Categories, budgets, session-linked expenses
- **Reports & Analytics** — Revenue, utilization, peak hours, customer LTV
- **Settings** — Configurable rates, table setup, tax, club info

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 58 + React Native 0.88 |
| Router | Expo Router (file-based) |
| Language | TypeScript 6 |
| Database | expo-sqlite (SQLite) |
| State | Zustand 5 |
| Icons | Lucide React Native |
| Animation | Reanimated 4 + Gesture Handler 3 |
| Fonts | Google Sans (400, 500, 600, 700) |
| Styling | StyleSheet + CSS variables |

## Visual Design

- **Tablet-first, landscape primary** — Responsive phone layouts
- **Dark/light themes** — CosyPOS-inspired charcoal workspace
- **Left sidebar** — Collapsible (68px/170px) with animated transitions
- **Bottom status bar** — Live connection, resource counts, waitlist
- **Muted teal accent** (`#AFCBC5`) with ice blue & sage

## Project Structure

```
src/
├── app/                    # Expo Router routes
│   ├── _layout.tsx         # Root: ThemeProvider, Stack, fonts
│   ├── index.tsx           # Redirects to dashboard
│   └── (main)/             # Main tab group (8 screens)
├── components/
│   ├── layout/             # Sidebar, TopHeader, BottomStatusBar
│   ├── shared/             # ScreenPlaceholder
│   └── ui/                 # Primitive components (to be built)
├── features/               # Domain modules (to be built)
├── theme/                  # Design tokens
│   ├── colors.ts           # ✓ Implemented
│   ├── ThemeProvider.tsx   # ✓ Context + dark/light toggle
│   └── spacing/typography/shadows/motion/  # ✗ Empty
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores (empty)
├── services/               # Sync, auth, export (empty)
├── repositories/           # Data access (empty)
├── database/               # Migrations (empty)
├── types/                  # TypeScript types (empty)
└── utils/                  # Billing, date, format, validation (empty)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- Expo CLI: `npm install -g expo-cli`
- Android Studio / Xcode for native builds, or Expo Go for testing

### Installation

```bash
# Clone and install
git clone https://github.com/roxton75/Pool-POS.git
cd Pool-POS
bun install  # or npm install
```

### Development

```bash
# Start dev server
bun run start      # or: npx expo start

# Platform-specific
bun run android    # Android emulator/device
bun run ios        # iOS simulator (macOS only)
bun run web        # Web browser
```

### Code Quality

```bash
bun run lint       # ESLint with Expo config
bunx tsc --noEmit  # TypeScript type check
```

## Current Status

**Phase: Initial Scaffold Complete** ✅

| Area | Status |
|------|--------|
| Expo project + deps | ✅ Done |
| Folder structure | ✅ Done |
| Route groups (8 screens) | ✅ Done |
| ThemeProvider (dark/light) | ✅ Done |
| Layout components | ✅ Done |
| Google Sans fonts | ✅ Loaded |
| Color tokens | ✅ Implemented |
| Spacing/typography/shadows/motion | ⏳ Empty |
| Database schema | ⏳ Empty |
| Zustand stores | ⏳ Empty |
| Repositories/services | ⏳ Empty |
| Feature components | ⏳ Empty |
| Screen content | ⏳ Placeholders |

## Working Agreement

> **ChatGPT provides UI code and design direction; Claude assists only when requested with project setup, backend integration, debugging, and refactoring.**

See [CLAUDE.md](CLAUDE.md) for full documentation including business rules, billing logic, architecture, and collaboration protocol.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run start` | Start Expo dev server |
| `bun run android` | Run on Android |
| `bun run ios` | Run on iOS |
| `bun run web` | Run on Web |
| `bun run lint` | Run ESLint |
| `bun run reset-project` | Reset to blank template |

## License

Private — Q-Zone Manager proprietary codebase.