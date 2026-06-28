"""
Payment Controllers mapping REST API endpoints.
"""

from flask import Blueprint, request, jsonify
from app.services import PaymentService
from app.schemas import PaymentSchema

payment_bp = Blueprint("payments", __name__)
payment_schema = PaymentSchema()
payments_schema = PaymentSchema(many=True)


@payment_bp.route("/order/<int:order_id>", methods=["GET"])
def get_by_order(order_id):
    payments = PaymentService.get_order_payments(order_id)
    return jsonify(payments_schema.dump(payments)), 200


@payment_bp.route("", methods=["POST"])
def collect():
    data = request.get_json()
    errors = payment_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400
    try:
        # Mock creator ID (user_id=1) for bootstrapping
        payment = PaymentService.collect_payment(data, user_id=1)
        return jsonify(payment_schema.dump(payment)), 201
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400
