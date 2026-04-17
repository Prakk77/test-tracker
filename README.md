# TestTracker 🧪

A full-stack testing status tracker for Dev, Staging, and Production environments — built with **Next.js 14**, **Tailwind CSS**, **SQLite (better-sqlite3)**, and **Recharts**.

---

## ✨ Features

- **Per-environment test tracking**: `/dev`, `/staging`, `/production`
- **Test case management**: Add, update status (Passed / Failed / Not Tested), delete
- **Persistent storage** via SQLite — no external DB setup needed
- **Dashboard** (`/`) with:
  - KPI cards (total, passed, failed, pass rate)
  - Pie chart: pass/fail distribution
  - Bar chart: environment comparison
  - Dropdown to filter by environment
  - Recent activity feed
- **Dark theme** with clean, professional UI
- **Fully typed** TypeScript throughout

---

## 🗂 Project Structure

```
test-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Sidebar
│   │   ├── page.tsx            # Dashboard (/)
│   │   ├── dev/page.tsx        # /dev
│   │   ├── staging/page.tsx    # /staging
│   │   ├── production/page.tsx # /production
│   │   └── api/
│   │       ├── tests/
│   │       │   ├── route.ts        # GET all, POST new
│   │       │   └── [id]/route.ts   # PATCH status, DELETE
│   │       └── dashboard/route.ts  # Stats aggregation
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── EnvironmentPage.tsx  # Shared env page logic
│   │   ├── TestCaseRow.tsx
│   │   ├── AddTestForm.tsx
│   │   ├── StatsBar.tsx
│   │   └── StatusBadge.tsx
│   ├── lib/
│   │   └── db.ts               # SQLite singleton + types
│   └── globals.css
├── scripts/
│   └── init-db.js              # One-time DB init + seed
├── data/                       # Auto-created, holds testtracker.db
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- **Node.js 18+**
- **npm** or **yarn**

### 1. Install Dependencies

```bash
npm install
```

> `better-sqlite3` compiles a native addon. If you hit build errors, make sure you have Python and build tools installed:
> - **macOS**: `xcode-select --install`
> - **Ubuntu/Debian**: `sudo apt install python3 make g++`
> - **Windows**: Install [Windows Build Tools](https://github.com/nodejs/node-gyp#on-windows)

### 2. Initialize the Database (optional — auto-runs on first request)

```bash
npm run db:init
```

This creates `data/testtracker.db` and seeds 17 example test cases across all three environments.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tests` | Get all test cases |
| `GET` | `/api/tests?environment=dev` | Filter by environment |
| `POST` | `/api/tests` | Create a new test case |
| `PATCH` | `/api/tests/:id` | Update status or name |
| `DELETE` | `/api/tests/:id` | Delete a test case |
| `GET` | `/api/dashboard` | Get dashboard stats |

### POST `/api/tests` body
```json
{
  "name": "User login flow",
  "environment": "dev",
  "status": "not_tested"
}
```

### PATCH `/api/tests/:id` body
```json
{
  "status": "passed"
}
```

---

## 🏗 Production Build

```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

> ⚠️ **Important**: SQLite writes to the local filesystem, which is **ephemeral on Vercel's serverless platform**. The app works on Vercel for read/demo purposes, but for persistent production data use one of the alternatives below.

### Quick Deploy (demo/read-only)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Next.js.

### For Persistent Production Deployment

Replace `better-sqlite3` with a hosted DB:

**Option A — Vercel Postgres (Neon)**
```bash
npm install @vercel/postgres
```
Update `src/lib/db.ts` to use `@vercel/postgres` SQL queries.

**Option B — Turso (SQLite-compatible, edge-ready)**
```bash
npm install @libsql/client
```
```ts
import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN });
```

**Option C — PlanetScale / Supabase**
Use their respective JS SDKs and rewrite the API routes with equivalent queries.

### Environment Variables (for hosted DB)
```env
# .env.local
TURSO_URL=libsql://your-db.turso.io
TURSO_TOKEN=your_auth_token
```

---

## 🐳 Docker (Optional)

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t test-tracker .
docker run -p 3000:3000 -v $(pwd)/data:/app/data test-tracker
```

Mount the `data/` volume to persist the SQLite database across container restarts.

---

## 🧩 Extending the App

### Add Authentication
Use [NextAuth.js](https://next-auth.js.org/):
```bash
npm install next-auth
```
Wrap the layout with a `SessionProvider` and protect API routes with `getServerSession`.

### Add Test Case Notes / Comments
Add a `notes TEXT` column to the `test_cases` table and extend the `PATCH` handler and UI accordingly.

### Add Webhooks / Notifications
POST to a Slack webhook when a test status changes to `failed` inside the PATCH API route.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | SQLite via better-sqlite3 |
| Charts | Recharts |
| Icons | Lucide React |
| Language | TypeScript |

---

## 📄 License

MIT
