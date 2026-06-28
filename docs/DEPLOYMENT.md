# Cakes and Crunches — Deployment & Operations Guide

Deployment configuration guidelines for local building and containerizing Cakes & Crunches.

---

## 💻 Local Setup

### 1. Backend Server Setup
Ensure Python 3.11+ is installed.

```bash
cd server
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Initialize database schema and seed data:
```bash
python -c "from app import create_app; from app.seeds.seed_data import seed_all; app = create_app(); ctx = app.app_context(); ctx.push(); seed_all()"
```

Run development server:
```bash
python run.py
```

---

### 2. Frontend Client Setup
Ensure Node.js 20+ is installed.

```bash
cd client
npm install
npm run dev
```

---

## 🐳 Docker Deployment

To launch the entire platform in production containerized mode using Nginx and SQLite, execute:

```bash
docker-compose up --build -d
```

* **Frontend portal**: `http://localhost` (Nginx static build proxy)
* **Backend Flask API**: `http://localhost:5000`
