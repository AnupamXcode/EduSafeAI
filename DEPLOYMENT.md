# EduRisk AI — Vercel Deployment Guide

This project is configured to deploy seamlessly to **Vercel** as a unified full-stack application (React 19 + Vite frontend with Python FastAPI Serverless Functions).

---

## Architecture on Vercel

```
                                [ Vercel Edge / Domain ]
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
         [ Static React Frontend ]                      [ Python Serverless ]
             `frontend/dist/`                              `api/index.py`
         (HTML, JS, CSS, Recharts)                    (FastAPI + Scikit-Learn)
                  │                                               │
             Browser UI  ─────────── Fetch `/api/...` ───────────┘
```

- **Frontend**: Built from `frontend/` using Vite and served through Vercel's Edge CDN.
- **Backend API**: Exposed via `api/index.py`, running FastAPI serverless functions with Python 3.11, Scikit-Learn, and the bundled UCI student datasets.
- **Same-Domain Routing**: In production, API requests use relative paths (`/api/...`), completely eliminating CORS configuration issues.

---

## Method 1: Deploy with Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Configure EduRisk AI for Vercel deployment"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your Git repository.
   - **Framework Preset**: Leave as `Vite` (or `Other`).
   - **Root Directory**: Leave as `./` (project root).
   - The included [`vercel.json`](file:///d:/Projects/College%20Project/ML%20Project/vercel.json) will automatically configure:
     - **Build Command**: `npm --prefix frontend run build`
     - **Output Directory**: `frontend/dist`
     - **Install Command**: `npm --prefix frontend install`
     - **Function Bundle**: Includes `data/**` for Python ML models.

3. **Click Deploy**:
   - Vercel will install frontend and Python dependencies.
   - Your application will be live at `https://<your-project-name>.vercel.app`.

---

## Method 2: Deploy with Vercel CLI

1. Run Vercel CLI from the project root:
   ```bash
   npx vercel
   ```
2. Follow the terminal prompts:
   - *Set up and deploy?* **Y**
   - *Which scope?* Select your personal account or team.
   - *Link to existing project?* **N**
   - *What's your project's name?* `edurisk-ai`
   - *In which directory is your code located?* `./`
3. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

---

## Local Development vs. Production

| Environment | Frontend URL | API Destination | Configuration |
| :--- | :--- | :--- | :--- |
| **Local Development** | `http://localhost:5173` | `http://127.0.0.1:8000` | Automated Vite Proxy (`vite.config.ts`) |
| **Vercel Production** | `https://*.vercel.app` | `/api/index.py` | Vercel Serverless Function (`vercel.json`) |

---

## Optional Environment Variables

If you ever wish to host the Python FastAPI backend on a separate server (e.g., Render, Railway, AWS EC2):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | External backend API URL | `https://api.edurisk.yourdomain.com` |

Leave `VITE_API_URL` empty to use the built-in Vercel Python serverless backend.
