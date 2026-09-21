# 🚀 Cyclone Watch Deployment & GitHub Guide

This guide provides step-by-step instructions to **push this project to GitHub** and **deploy it to Vercel as a fully functioning website**.

---

## 📋 Table of Contents
1. [Pushing to GitHub](#1-pushing-to-github)
2. [Deploying to Vercel](#2-deploying-to-vercel)
3. [Live Cloud Backend (Optional)](#3-live-cloud-backend-optional)
4. [Environment Variables Reference](#4-environment-variables-reference)

---

## 1. Pushing to GitHub

### Step 1.1: Create a Repository on GitHub
1. Open your browser and navigate to [https://github.com/new](https://github.com/new).
2. Set **Repository name** (e.g. `cyclone-watch` or `sih-cyclone-watch`).
3. Set Visibility: **Public** or **Private**.
4. **Leave "Add a README file", ".gitignore", and "Choose a license" UNCHECKED** (your project already has these configured).
5. Click **Create repository**.

### Step 1.2: Add Remote and Push
In your project terminal (`E:\Project(SIH)`), run:

```bash
# Add your GitHub repository as origin (replace with your repo URL)
git remote add origin https://github.com/Ramcharan77587/<your-repo-name>.git

# Push the main branch
git branch -M main
git push -u origin main
```

*(Windows Git Credential Manager will prompt you once in your browser to authorize GitHub access if not already logged in).*

---

## 2. Deploying to Vercel

The repository is pre-configured with **`vercel.json`** and single-page application (SPA) rewrite rules so that routing, refresh, Leaflet maps, and simulated AI inference work out-of-the-box.

### Option A: Import Directly from GitHub (Recommended)
1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New…** ➜ **Project**.
3. Locate your newly pushed `cyclone-watch` repository and click **Import**.
4. Configure Project Settings:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: Leave as `./` (or select `cyclone-dashboard`). Both work because root & nested `vercel.json` files are pre-configured!
   - **Build Command**: `npm run build` (auto-detected).
   - **Output Directory**: `cyclone-dashboard/dist` (or `dist` if root dir is `cyclone-dashboard`).
5. (Optional) In **Environment Variables**, you can leave `VITE_API_BASE_URL` empty to run in ultra-resilient standalone simulation mode, or provide a URL to a live FastAPI cloud backend.
6. Click **Deploy**.

Within ~45 seconds, your website will be live at `https://<project-name>.vercel.app`!

---

### Option B: Deploy via Vercel CLI
If you prefer deploying directly from the command line:

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Run vercel deploy from the project root
vercel

# For production deployment:
vercel --prod
```

---

## 3. Live Cloud Backend (Optional)

If you wish to host the Python FastAPI backend in the cloud alongside the Vercel frontend:

| Cloud Platform | Setup Guide | Free Tier Availability |
| :--- | :--- | :--- |
| **Render** | Create a **Web Service**, link GitHub repo, Root: `cyclone_backend`, Build: `pip install -r requirements.txt`, Start: `uvicorn main:app --host 0.0.0.0 --port $PORT` | Free tier available |
| **Railway** | Connect repo, select `cyclone_backend` directory, Railway auto-detects Python / Dockerfile. | Starter trial |
| **Koyeb / Fly.io** | Deploy using the pre-built `cyclone_backend/Dockerfile`. | Generous free tier |

Once deployed, copy the cloud backend URL (e.g., `https://cyclone-backend.onrender.com`) and add it to your Vercel Project Settings under **Environment Variables**:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://cyclone-backend.onrender.com`

Then redeploy on Vercel to automatically stream live database records and real neural inference!

---

## 4. Environment Variables Reference

| Variable | Scope | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Frontend | `http://localhost:8000` | Points to FastAPI backend. If unreachable, the frontend automatically falls back to rich mock data. |
| `PORT` | Backend | `8000` | Server listening port. |
| `DATABASE_URL` | Backend | `sqlite:///cyclone.db` | SQLAlchemy connection string. |
| `MOSDAC_USERNAME` | Backend | `None` | (Optional) ISRO MOSDAC credentials for live HDF5 satellite ingestion. |
| `MOSDAC_PASSWORD` | Backend | `None` | (Optional) ISRO MOSDAC account password. |
