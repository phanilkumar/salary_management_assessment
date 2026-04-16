# Deployment Guide

## Architecture

```
Vercel (React UI)  →  Render.com (Rails API)  →  Render Postgres
```

---

## Step 1 — Push to GitHub

```bash
cd salary_management_assessment
git init
git add salary-api/ salary-ui/ DEPLOYMENT.md
git commit -m "feat: complete salary management application"
git remote add origin https://github.com/YOUR_USERNAME/salary-management-assessment.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy Backend on Render.com

### Option A — Blueprint (recommended)

1. Go to [render.com](https://render.com) → New → Blueprint
2. Connect your GitHub repo
3. Render detects `salary-api/render.yaml` and provisions:
   - A **Web Service** (Rails API)
   - A **PostgreSQL** database

4. Set these environment variables manually in the Render dashboard:
   - `RAILS_MASTER_KEY` → copy from `salary-api/config/master.key`
   - `ALLOWED_ORIGINS` → set **after** you get the Vercel URL (Step 3)

5. Click **Apply** — Render will:
   - Run `bundle install`
   - Run `rails db:migrate`
   - Run `rails db:seed` (seeds 10,000 employees)
   - Start Puma

6. Your API URL will be: `https://salary-management-api.onrender.com`

### Option B — Manual setup

1. New → Web Service → connect repo → set **Root Directory** to `salary-api`
2. Set:
   - **Build command:** `bundle install && bundle exec rails db:migrate && bundle exec rails db:seed`
   - **Start command:** `bundle exec puma -C config/puma.rb`
3. Add a **PostgreSQL** database from Render dashboard
4. Link it by setting `DATABASE_URL` env var (Render provides this automatically if linked)

---

## Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `salary-ui`
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://salary-management-api.onrender.com/api/v1`
5. Click **Deploy**

Your frontend URL will be: `https://salary-management-assessment.vercel.app`

---

## Step 4 — Connect Frontend → Backend (CORS)

1. Go back to Render dashboard → salary-management-api → Environment
2. Update `ALLOWED_ORIGINS`:
   ```
   https://salary-management-assessment.vercel.app
   ```
3. Trigger a manual redeploy (or it auto-deploys)

---

## Step 5 — Verify Deployment

```bash
# Health check
curl https://salary-management-api.onrender.com/health

# Employees API
curl https://salary-management-api.onrender.com/api/v1/employees

# Insights
curl https://salary-management-api.onrender.com/api/v1/insights/overview
```

All three should return JSON. Then visit your Vercel URL and confirm the UI loads with data.

---

## Running Locally

### Backend
```bash
cd salary-api
cp .env.example .env       # fill in your Postgres credentials
bundle install
rails db:create db:migrate db:seed
rails s                    # runs on http://localhost:3000
```

### Frontend
```bash
cd salary-ui
npm install
npm run dev                # runs on http://localhost:5173
```

> Both servers must be running simultaneously. Vite proxies `/api` to `localhost:3000`.

---

## Environment Variables Reference

### salary-api

| Variable | Required | Description |
|---|---|---|
| `DB_USERNAME` | Dev only | Postgres username |
| `DB_PASSWORD` | Dev only | Postgres password |
| `DB_HOST` | Dev only | Postgres host (default: localhost) |
| `DATABASE_URL` | Production | Full Postgres connection string (set by Render) |
| `RAILS_MASTER_KEY` | Production | Copy from `config/master.key` |
| `ALLOWED_ORIGINS` | Both | Comma-separated list of allowed frontend URLs |
| `RAILS_ENV` | Production | Set to `production` |

### salary-ui

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Production | Full URL to Rails API e.g. `https://....onrender.com/api/v1` |

> In development, `VITE_API_BASE_URL` is empty — the Vite proxy handles routing.
