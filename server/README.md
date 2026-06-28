# Cakes and Crunches — Backend Server

Flask REST API backend for the Bulk Order Advance Collection & Balance Tracking System.

## Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python run.py
```

## API Health Check

```
GET http://localhost:5000/api/auth/health
GET http://localhost:5000/api/orders/health
GET http://localhost:5000/api/payments/health
GET http://localhost:5000/api/wallet/health
```
