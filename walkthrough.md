# QueryAI Frontend — Walkthrough

## What Was Built

A premium, dark-themed **Business Intelligence dashboard frontend** for **QueryAI** — a conversational AI that lets non-technical users generate interactive dashboards via natural language prompts.

**Tech Stack:** Next.js 16 · React · TypeScript · Recharts · Lucide Icons · Vanilla CSS

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          ← Full dark corporate theme
│   │   ├── layout.tsx           ← Root layout with metadata
│   │   └── page.tsx             ← Main page composition
│   └── components/
│       ├── Sidebar.tsx          ← Branded nav with collapse toggle
│       ├── Header.tsx           ← Title bar + search + notifications
│       ├── ChatPanel.tsx        ← AI prompt input + sample chips
│       ├── DashboardArea.tsx    ← KPI + chart grid layout
│       ├── KPICard.tsx          ← Metric card with sparkline
│       ├── ChartCard.tsx        ← Reusable chart wrapper
│       ├── SampleCharts.tsx     ← 4 Recharts demos (line/bar/pie/area)
│       └── FileUploadModal.tsx  ← CSV drag-and-drop upload
```

## Dashboard Screenshot

![QueryAI Dashboard](C:\Users\ASUS\.gemini\antigravity\brain\311b2d1b-e339-4343-96a3-cee5cbfe3027\queryai_dashboard_final_1773241633290.png)

## Dashboard Demo Recording

![Dashboard Interaction](C:\Users\ASUS\.gemini\antigravity\brain\311b2d1b-e339-4343-96a3-cee5cbfe3027\dashboard_verification_1773241585074.webp)

---

## Key Features

| Feature | Details |
|---|---|
| **Dark Corporate Theme** | Custom CSS variables, glassmorphism cards, gradient accents |
| **4 KPI Cards** | Revenue ($842K), Users (5,120), Orders (12,847), AOV ($68.50) with sparklines |
| **4 Chart Types** | Line (Revenue), Donut (Categories), Bar (Regional Sales), Area (User Growth) |
| **Chat Interface** | Floating prompt bar with sample query chips |
| **File Upload** | Drag-and-drop CSV/Excel modal |
| **Collapsible Sidebar** | Smooth toggle with QueryAI branding |
| **Micro-animations** | Hover effects, staggered fade-ins, tooltip styling |
| **Responsive** | Adapts to tablet/mobile with collapsed sidebar |

## Verification

- ✅ `npm run build` — compiled with zero errors
- ✅ Dev server running at `http://localhost:3000`
- ✅ All 4 KPI cards render with correct data and sparklines
- ✅ All 4 chart types render with interactive tooltips
- ✅ Sidebar, header, chat panel, and prompt chips all functional
- ✅ Hover effects and animations working
