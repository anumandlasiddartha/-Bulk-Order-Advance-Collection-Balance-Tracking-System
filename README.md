# 🍰 Cakes and Crunches — Bulk Order Advance Collection & Balance Tracking System

An enterprise-grade financial management system built for **Cakes and Crunches** bakery. Tracks bulk orders, advance payments, remaining balances, and provides a complete wallet engine with transaction ledger, automated alerts, and interactive analytics.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, TailwindCSS, Framer Motion, Three.js (R3F), Chart.js, TanStack Query |
| **Backend** | Python Flask, SQLAlchemy, Marshmallow, JWT Authentication |
| **Database** | SQLite |
| **Architecture** | MVC + Repository Pattern + Service Layer |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- npm 10+

### Backend Setup

```bash
cd server
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
flask db upgrade
python run.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Project Structure

```
cakes-and-crunches/
├── client/          # React 19 + Vite frontend
├── server/          # Flask REST API backend
└── docs/            # Project documentation
```

---

## License

Proprietary — Cakes and Crunches © 2026
