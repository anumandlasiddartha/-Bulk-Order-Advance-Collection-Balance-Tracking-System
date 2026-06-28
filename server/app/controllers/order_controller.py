"""
Order Controllers mapping REST API endpoints.
"""

from flask import Blueprint, request, jsonify, send_file
import io
from app.services import OrderService, PaymentService
from app.schemas import OrderSchema
from app.utils.pdf_generator import generate_invoice_pdf

order_bp = Blueprint("orders", __name__)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)


@order_bp.route("", methods=["GET"])
def get_all():
    orders = OrderService.get_all_orders()
    return jsonify(orders_schema.dump(orders)), 200


@order_bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    order = OrderService.get_order(id)
    if not order:
        return jsonify({"success": False, "message": "Order not found."}), 404
    return jsonify(order_schema.dump(order)), 200


@order_bp.route("", methods=["POST"])
def create():
    data = request.get_json()
    if "delivery_date" in data:
        try:
            from datetime import datetime
            data["delivery_date"] = datetime.strptime(data["delivery_date"], "%Y-%m-%d").date().isoformat()
        except ValueError:
            pass

    errors = order_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400
    try:
        order = OrderService.create_order(data, user_id=1)
        return jsonify(order_schema.dump(order)), 201
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400


@order_bp.route("/<int:id>/invoice", methods=["GET"])
def download_invoice(id):
    order = OrderService.get_order(id)
    if not order:
        return jsonify({"success": False, "message": "Order not found."}), 404

    payments = PaymentService.get_order_payments(id)
    
    # Resolve customer details to inject into PDF builder
    try:
        from app.services import CustomerService
        cust = CustomerService.get_customer(order.customer_id)
        cust_name = cust.name if cust else "Walk-in Customer"
        cust_phone = cust.phone if cust else "N/A"
    except Exception:
        cust_name = "Customer"
        cust_phone = "N/A"

    order_data = {
        "invoice_number": f"INV-{order.order_number.split('-')[-1]}",
        "order_number": order.order_number,
        "customer_name": cust_name,
        "customer_phone": cust_phone,
        "cake_type": order.cake_type,
        "total_amount": float(order.order_value),
        "advance_amount": float(order.advance_amount),
    }

    payments_data = [p.to_dict() for p in payments]

    pdf_bytes = generate_invoice_pdf(order_data, payments_data)
    
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"Invoice-{order.order_number}.pdf"
    )
