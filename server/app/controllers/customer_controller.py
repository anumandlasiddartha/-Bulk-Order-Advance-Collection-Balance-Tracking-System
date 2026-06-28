"""
Customer Controllers mapping REST API endpoints.
"""

from flask import Blueprint, request, jsonify
from app.services import CustomerService
from app.schemas import CustomerSchema

customer_bp = Blueprint("customers", __name__)
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)


@customer_bp.route("", methods=["GET"])
def get_all():
    customers = CustomerService.get_all_customers()
    return jsonify(customers_schema.dump(customers)), 200


@customer_bp.route("/<int:id>", methods=["GET"])
def get_by_id(id):
    customer = CustomerService.get_customer(id)
    if not customer:
        return jsonify({"success": False, "message": "Customer not found."}), 404
    return jsonify(customer_schema.dump(customer)), 200


@customer_bp.route("", methods=["POST"])
def create():
    data = request.get_json()
    errors = customer_schema.validate(data)
    if errors:
        return jsonify({"success": False, "errors": errors}), 400
    try:
        customer = CustomerService.create_customer(data)
        return jsonify(customer_schema.dump(customer)), 201
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400
