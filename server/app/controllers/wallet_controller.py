"""
Wallet Controllers mapping REST API endpoints and financial aggregations.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta, timezone
from app.services import WalletService
from app.schemas import WalletSchema
from app.models.payment import Payment

wallet_bp = Blueprint("wallet", __name__)
wallet_schema = WalletSchema()


@wallet_bp.route("/customer/<int:customer_id>", methods=["GET"])
def get_by_customer(customer_id):
    wallet = WalletService.get_wallet(customer_id)
    if not wallet:
        return jsonify({"success": False, "message": "Wallet not found for this customer."}), 404
    return jsonify(wallet_schema.dump(wallet)), 200


@wallet_bp.route("/customer/<int:customer_id>/credit", methods=["POST"])
def credit(customer_id):
    data = request.get_json() or {}
    amount = float(data.get("amount", 0))
    description = data.get("description", "Wallet credit transaction")
    if amount <= 0:
        return jsonify({"success": False, "message": "Amount must be greater than zero."}), 400
    try:
        wallet = WalletService.credit_wallet(customer_id, amount, description, user_id=1)
        return jsonify(wallet_schema.dump(wallet)), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400


@wallet_bp.route("/customer/<int:customer_id>/debit", methods=["POST"])
def debit(customer_id):
    data = request.get_json() or {}
    amount = float(data.get("amount", 0))
    description = data.get("description", "Wallet debit transaction")
    if amount <= 0:
        return jsonify({"success": False, "message": "Amount must be greater than zero."}), 400
    try:
        wallet = WalletService.debit_wallet(customer_id, amount, description, user_id=1)
        return jsonify(wallet_schema.dump(wallet)), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400


@wallet_bp.route("/stats", methods=["GET"])
def get_stats():
    """
    Calculate dynamic financial collection aggregates:
    Daily collections, Weekly collections, and Monthly collections.
    """
    now = datetime.now(timezone.utc)
    today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    week_start = today_start - timedelta(days=7)
    month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

    # 1. Daily Revenue
    today_payments = Payment.query.filter(Payment.payment_date >= today_start).all()
    daily_revenue = sum(float(p.amount) for p in today_payments)

    # 2. Weekly Revenue
    weekly_payments = Payment.query.filter(Payment.payment_date >= week_start).all()
    weekly_revenue = sum(float(p.amount) for p in weekly_payments)

    # 3. Monthly Revenue
    monthly_payments = Payment.query.filter(Payment.payment_date >= month_start).all()
    monthly_revenue = sum(float(p.amount) for p in monthly_payments)

    # 4. Total Cash Flow
    all_payments = Payment.query.all()
    total_revenue = sum(float(p.amount) for p in all_payments)

    return jsonify({
      "success": True,
      "stats": {
        "daily": daily_revenue,
        "weekly": weekly_revenue,
        "monthly": monthly_revenue,
        "total": total_revenue
      }
    }), 200
