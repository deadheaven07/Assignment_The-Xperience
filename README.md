# PlanCraft AI — Production-Grade Event Management Platform
> **Created for "The Xperience" SDE Intern Assessment**

PlanCraft AI is a production-grade, full-stack event management platform that empowers Event Directors to transform unstructured, fast-paced event updates and crises into a structured, proactive, real-time command cockpit.

---

## 🌟 Architectural Highlights

```
+----------------------------------------------------------------------------------------------------+
|                                      PLANCRAFT AI WEB PLATFORM                                     |
+--------------------------------------------------+-------------------------------------------------+
|   LEFT PANE (38% Width): AI CO-PILOT            |   RIGHT PANE (62% Width): OPERATIONS COCKPIT    |
|   - Event Switcher (Wedding <-> Corporate)       |   - Executive KPI Bar (Readiness, Spend, Hub)   |
|   - 1-Click Evaluator Scenario Presets           |   - Autonomous Proactive Risk Radar             |
|   - Conversational AI Stream (Entity Extraction) |   - 1-Click AI Risk Mitigation Buttons          |
|   - Suggested Quick-Action Chips                 |   - 📅 Timeline & Sub-Events Itinerary          |
|   - Voice Simulation & Natural Chat Input        |   - 📋 Smart Kanban Board (Status Advancing)    |
|                                                  |   - 🤝 Vendor Procurement Hub                   |
|                                                  |   - 🚌 Hospitality & Transit Logistics Matrix   |
|                                                  |   - 📊 Spend & Budget Analytics (Recharts)      |
+--------------------------------------------------+-------------------------------------------------+
                                                   ▲
                                                   │ Reactive WebSocket/HTTP State Sync
                                                   ▼
+----------------------------------------------------------------------------------------------------+
|                                    EXPRESS + TYPESCRIPT BACKEND                                    |
|   - Auth Controller (JWT + 1-Click Demo Login)                                                     |
|   - Event Controller (Full State Snapshots + Instant Reset to Seed)                                |
|   - Autonomous Heuristic Risk Engine (Capacity Deficits, Vendor Gaps, Deadline Cutoffs)            |
|   - AI Service (Google Gemini 1.5/2.0 Flash + Deterministic NLP Semantic Extractor Fallback)       |
|   - Resilience Layer (MongoDB Mongoose + In-Memory Store Fallback for Zero Setup Friction)         |
+----------------------------------------------------------------------------------------------------+
```

---

## 🎨 Luxury Indian Wedding Design System

Built on a light, warm luxury palette inspired by heritage hospitality, royal Indian weddings, and modern enterprise software:

| Design Token | Color Code | Role & Aesthetic Application |
|---|---|---|
| **Royal Ivory** | `#FAF8F5` | Primary background canvas with subtle warmth |
| **Silk White** | `#FFFDF9` / `#FFFFFF` | Card surfaces with champagne borders and soft blurs |
| **Royal Crimson** | `#9E1B32` (hover `#801426`) | Primary brand accent, executive badges, action buttons |
| **Champagne Gold** | `#D4AF37` (border `#E6C66E`) | Metallic luxury trims, highlights, and health progress meters |
| **Festive Marigold** | `#EAA221` (wash `#FEF6E9`) | Celebration highlights, procurement tags, and timeline accents |
| **Rose Petal Wash** | `#FDF2F4` (border `#F7D6DC`) | Subtle romantic accents and status pills |
| **Royal Slate** | `#1E293B` (muted `#64748B`) | High-contrast typography ensuring optimal accessibility |

---

## 🚀 Zero-Friction Evaluator Resilience

To ensure reviewers can evaluate the platform in seconds without setup roadblocks:

1. **Zero Database Configuration Required**:
   - If `MONGODB_URI` is provided, Mongoose connects smoothly.
   - If no database is present, the server automatically boots an **In-Memory Data Store** with full CRUD, reactive metrics, and persistence across the test session.
2. **Deterministic Gemini AI Fallback**:
   - If `GEMINI_API_KEY` is provided, calls Google Gemini 1.5/2.0 Flash for structured natural language processing.
   - If no API key is provided, a built-in **Deterministic Semantic NLP Extractor** handles all scenario presets, natural variations, entity extractions, and state changes with 100% precision.
3. **1-Click Evaluator Demo Login**:
   - The login page includes a single button: `⚡ 1-Click Evaluator Demo Login` which bypasses forms and issues a signed JWT immediately.
4. **1-Click Scenario Preset Pills**:
   - Evaluators do not need to type test prompts manually. One click on any preset pill executes the scenario and triggers live state transitions.
5. **Instant Scenario Reset**:
   - The `Reset` button on the Event Switcher instantly restores an event to its clean initial state so you can re-test workflows repeatedly.

---

## 💍 Assessment Scenarios Supported

### Scenario 1: Royal 3-Day Wedding (400 Guests)
- **Sub-events**: Sangeet (Day 1), Haldi Ceremony (Day 2 morning), Vedic Pheras (Day 2 evening), Grand Reception (Day 3).
- **Logistics**: 150 out-of-town royal guests, 75 hotel rooms, airport transfer fleets.
- **Preloaded Conflict & Crisis**:
  - **7-Day Catering Deadline**: Shahi Dawat Caterers requires headcount confirmation to avoid late surcharges.
  - **Reception Photographer Cancellation**: Drishti Studios becomes unavailable. Triggers a Critical Vendor Gap on the Risk Radar with 1-Click AI Actions:
    - `[Dispatch RFP to 3 Vetted Backup Photographers]` -> Shortlists KalaKriti Studios and adds emergency contract task to Kanban.
    - `[Reallocate ₹25,000 Emergency Contingency]` -> Expands budget buffer.

### Scenario 2: Apex Corporate Retreat (200 Employees)
- **Sub-events**: Arrival Breakfast, Team Building Obstacle Course, Star Awards Gala, Leadership Keynote, Farewell Networking Lunch.
- **Logistics**: 40 employees flying in, 100 deluxe rooms at JW Marriott Mussoorie.
- **Preloaded Conflict & Crisis**:
  - **Fleet Capacity Shortfall**: Contracted coach fleet accommodates 150 PAX, leaving 50 attendees stranded for HQ departure.
  - **1-Click AI Remedies**:
    - `[Book 50-Seater Tempo Fleet (+₹45,000)]` -> Instantly restores capacity to 200/200, updates logistics, marks Kanban task as done, and clears the alert.
    - `[Split into 2 Departure Waves]` -> Staggers departures into 07:00 AM & 08:30 AM batches.
  - **Schedule Shift**: "CEO arriving Day 2 via helicopter -> Move Keynote" shifts schedule to 11:00 AM.

---

## 🛠️ Project Structure

```
Assignment/
├── client/                           # Next.js 14 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx            # Global metadata & luxury styling
│   │   │   ├── page.tsx              # Landing & auto-redirect
│   │   │   ├── login/page.tsx        # 1-Click Demo Login & Auth
│   │   │   └── dashboard/page.tsx    # 38% / 62% Dual-Pane Cockpit
│   │   ├── components/
│   │   │   ├── chat/                 # EventSwitcher, ScenarioPresetBar, MessageBubble, ChatInput
│   │   │   ├── dashboard/            # MetricsHeader, RiskRadar, TimelineView, KanbanBoard, VendorGrid, LogisticsMatrix, BudgetAnalytics
│   │   │   ├── layout/               # Navbar with branding & profile
│   │   │   └── ui/                   # GoldBadge, StatusPill, MetricCard
│   │   ├── lib/                      # api.ts, types.ts, colorPalette.ts
│   │   ├── .env.example
│   │   └── package.json
├── server/                           # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/                   # db.ts (Mongoose + In-Memory Fallback)
│   │   ├── controllers/              # authController, eventController, chatController, riskController
│   │   ├── models/                   # store.ts (Reactive In-Memory Data Store)
│   │   ├── services/                 # aiService.ts, riskEngine.ts, seedData.ts
│   │   ├── routes/                   # api.ts (REST routes)
│   │   ├── types/                    # Domain TypeScript definitions
│   │   └── server.ts                 # Express entrypoint
│   ├── .env.example
│   └── package.json
├── .gitignore                        # Security hygiene (.env, node_modules)
└── README.md                         # Evaluator Documentation
```

---

## ⚡ Quickstart Guide (Under 2 Minutes)

### Prerequisites
- Node.js 18+ (tested on Node v20/v22/v26)
- npm 9+

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
*The server will start on `http://localhost:5001`. It runs out of the box in In-Memory mode if no MongoDB URI is supplied.*

### 2. Start Next.js Frontend
```bash
cd client
npm install
npm run dev
```
*The client will start on `http://localhost:3000`.*

### 3. Open Application
Navigate to `http://localhost:3000`. You will be automatically redirected to the Command Cockpit. You can also visit `http://localhost:3000/login` to test the 1-Click Demo Login flow.

---

## 📋 Evaluator Step-by-Step Testing Checklist

1. **Dual-Pane Layout**:
   - Verify Left Pane (38%) contains the AI Co-Pilot with the Active Scenario Switcher and preset chips.
   - Verify Right Pane (62%) contains the Executive KPI bar, Autonomous Risk Radar, and 5 operational tabs.
2. **Scenario 1 Wedding Presets**:
   - Click `[Crisis: Reception Photographer Unavailable]`.
   - Observe AI response, extracted entity chips (`Drishti Cinematic Studios`), vendor status drop to `gap`, and the critical alert on the Risk Radar.
   - Click `[Dispatch RFP to 3 Vetted Backup Photographers]` either on the Risk Radar or in chat.
   - Observe that the risk clears, the new vendor `KalaKriti Cinema (Backup Assigned)` is shortlisted, and a task is added to the Kanban board.
3. **Switch to Scenario 2 Corporate Retreat**:
   - Use the Event Switcher dropdown to select `Apex Global Leadership Retreat (200 Employees)`.
   - Observe the pre-existing Critical Risk: `Fleet Capacity Shortfall (50 Stranded Attendees)`.
   - Click `[Book 50-Seater Tempo Fleet (+₹45,000)]`.
   - Observe that fleet capacity updates to 200/200 (100%), the risk clears, the Kanban task moves to `Completed`, and readiness score improves.
4. **Inspect Operational Modules**:
   - **Timeline**: Check the chronological cards for each sub-event.
   - **Smart Kanban**: Click "Move" on any task to cycle its state (To-Do -> In Progress -> Done).
   - **Procurement Hub**: View vendor contracts in INR format.
   - **Logistics Matrix**: View gauges for rooms, airport shuttles, and fleet capacity.
   - **Spend Analytics**: View Recharts donut and bar charts showing category spend distribution.
5. **Reset Scenario**:
   - Click the `Reset` button next to the Event Switcher to restore all seed values and re-run scenarios from scratch.

---

## 🔒 Security & Secrets Hygiene
- No sensitive API keys or credentials are committed to source control.
- `.env` and `.env.local` files are excluded via the root `.gitignore`.
- All client communications pass through the Express backend via JWT authentication.
