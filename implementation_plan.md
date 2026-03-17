# QueryAI Frontend — Conversational AI for Business Intelligence Dashboards

Build the frontend for **QueryAI**, a conversational AI that lets non-technical users generate interactive BI dashboards via natural language prompts. The UI should feel premium, modern, and corporate — aimed at CXOs.

## Proposed Changes

### Project Initialization

#### [NEW] `frontend/` directory

Initialize a Next.js project inside `c:\Users\ASUS\OneDrive\Desktop\DATAtalks\frontend\` using `npx create-next-app`. Install additional dependencies: `recharts`, `lucide-react`.

---

### Layout & Theme

#### [NEW] `frontend/src/app/globals.css`

Corporate dark theme with a curated color palette:
- **Dark background:** `#0f1117` (near-black), sidebar `#161822`
- **Accent:** Electric blue `#3b82f6` → `#60a5fa` gradient
- **Cards:** Glassmorphism with subtle backdrop blur, `rgba(255,255,255,0.04)` surfaces
- **Typography:** Google Font "Inter" for clean, modern text
- CSS custom properties for all design tokens, smooth transitions, micro-animations

#### [NEW] `frontend/src/app/layout.tsx`

Root layout with Inter font import, metadata (`<title>QueryAI</title>`), dark body background.

#### [NEW] `frontend/src/app/page.tsx`

Main page that composes all components: Sidebar + Header + Chat Panel + Dashboard Area.

---

### Core Components

#### [NEW] `frontend/src/components/Sidebar.tsx`

- QueryAI logo + branding at top
- Navigation items: Dashboard, History, Data Sources, Settings
- Active state indicators with animated highlight
- Collapsed/expanded toggle with smooth animation
- User avatar/profile section at bottom

#### [NEW] `frontend/src/components/Header.tsx`

- Page title ("Dashboard")
- Search bar (decorative for now)
- Notification bell icon, user profile avatar
- Breadcrumb or subtitle

#### [NEW] `frontend/src/components/ChatPanel.tsx`

- Floating chat input bar at the bottom of the dashboard area
- Text input with placeholder: *"Ask QueryAI anything about your data..."*
- Send button with animated icon
- Shows sample prompt suggestions as clickable chips when empty
- Loading/thinking animation when processing

#### [NEW] `frontend/src/components/DashboardArea.tsx`

- Grid layout for chart cards
- Renders sample/demo charts (Revenue Line Chart, Sales Bar Chart, Category Pie Chart, KPI cards)
- Each chart card has: title, subtitle, chart, action buttons (expand, download, filter)
- Empty state with illustration when no data

#### [NEW] `frontend/src/components/ChartCard.tsx`

- Reusable card wrapper for any chart
- Glassmorphism card styling
- Header with title + chart type badge
- Hover elevation effect
- Action toolbar (fullscreen, export, filter)

#### [NEW] `frontend/src/components/KPICard.tsx`

- Metric display card (e.g., Total Revenue, Active Users)
- Large number with trend indicator (▲/▼ with color)
- Sparkline mini-chart
- Subtle gradient background

#### [NEW] `frontend/src/components/FileUpload.tsx`

- Drag-and-drop CSV upload zone
- File type validation indicator
- Upload progress bar
- Preview of uploaded file (name, size, column count)

#### [NEW] `frontend/src/components/SampleCharts.tsx`

- Pre-built demo charts using Recharts with hardcoded sample business data:
  - **Line chart:** Monthly revenue over 12 months
  - **Bar chart:** Sales by region
  - **Pie chart:** Product category distribution
  - **Area chart:** User growth trend
- All charts with tooltips, legends, animations, responsive containers

---

### Design Details

| Element | Choice |
|---|---|
| **Font** | Inter (Google Fonts) |
| **Primary color** | `#3b82f6` (blue-500) |
| **Background** | `#0f1117` |
| **Surface/card** | `rgba(255,255,255,0.04)` with border `rgba(255,255,255,0.08)` |
| **Text** | `#e2e8f0` (primary), `#94a3b8` (secondary) |
| **Accent gradient** | `linear-gradient(135deg, #3b82f6, #8b5cf6)` |
| **Border radius** | `12px` cards, `8px` inputs, `24px` buttons |
| **Animations** | CSS transitions (200-300ms), hover scale(1.02), fadeIn keyframes |

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify the project compiles without errors.

### Manual Verification
- Run `npm run dev` inside `frontend/` and open `http://localhost:3000` in browser.
- Verify:
  1. Sidebar renders with QueryAI branding and navigation items
  2. Header bar displays correctly
  3. Dashboard area shows sample KPI cards and demo charts
  4. Chat input bar is visible at bottom with placeholder text and sample prompt chips
  5. Hover effects work on cards and buttons
  6. File upload zone is accessible
  7. Page is responsive (resize the browser window)
