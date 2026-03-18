# Production Deployment Guide

This guide walks you through the easiest and most reliable way to deploy your full-stack portfolio for free. We'll use **Neon** for the PostgreSQL database, **Render** for the FastAPI backend, and **Vercel** for the Next.js frontend.

---

### Step 1: Push Code to GitHub
Both Render and Vercel fetch your code directly from GitHub, so this must be done first.
1. Open your terminal in the root folder (`c:\codes\Portfolio`).
2. Run the following to initialize git and push to a new repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Production ready portfolio"
   git branch -M main
   # Create a repository on GitHub (e.g. "portfolio") and paste the remote command:
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

---

### Step 2: Set up a Free PostgreSQL Database (Neon)
1. Go to [Neon.tech](https://neon.tech/) and sign up.
2. Create a new project (e.g., "Portfolio DB").
3. Copy the **Connection String** (it looks like `postgresql://username:password@hostname/dbname?sslmode=require`).

---

### Step 3: Deploy Backend (FastAPI) to Render
Render natively supports Python applications and handles the installation of `requirements.txt` for you.

1. Go to [Render.com](https://render.com/) and sign in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `portfolio` repository.
4. **Configuration Details**:
   - Name: `portfolio-backend`
   - Root Directory: `backend` *(Important! Since your backend is technically inside a folder)*
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt && alembic upgrade head`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. **Environment Variables**:
   Click "Advanced" and add the following:
   - `DATABASE_URL` = *(Paste the Neon connection string here)*
   - `SECRET_KEY` = `generate-a-random-secure-string-here`
   - `FRONTEND_URL` = `*` *(We will update this to your exact Vercel URL later for tighter security)*
6. Click **Create Web Service**. Wait 3-5 minutes for it to deploy. Copy the deployed URL (e.g., `https://portfolio-backend.onrender.com`).

---

### Step 4: Deploy Frontend (Next.js) to Vercel
Vercel is optimized for Next.js and deploys in seconds.

1. Go to [Vercel.com](https://vercel.com/) and sign in.
2. Click **Add New...** -> **Project**.
3. Import your `portfolio` GitHub repository.
4. **Configuration Details**:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend` *(Important! Click edit and select frontend)*
5. **Environment Variables**:
   Add the following:
   - `NEXT_PUBLIC_API_URL` = *(Paste your Render backend URL here, e.g. `https://portfolio-backend.onrender.com`)*
6. Click **Deploy**.

---

### Step 5: Final Security Handshake
1. Once your frontend finishes deploying, Vercel will give you a domain (e.g., `https://portfolio-abc.vercel.app`).
2. Go back to **Render** -> your backend service -> **Environment**.
3. Change the `FRONTEND_URL` from `*` to your new Vercel domain (e.g., `https://portfolio-abc.vercel.app`). This locks your API down so only your frontend can communicate with it.

You're completely live! If you need help executing any of these steps (like setting up GitHub), just let me know!
