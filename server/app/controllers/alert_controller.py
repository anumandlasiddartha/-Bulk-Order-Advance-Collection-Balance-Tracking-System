"""
Alert Controllers mapping REST API endpoints and database scanning.
"""

from flask import Blueprint, request, jsonify
from app.services.alert_service import AlertService
from app.schemas import AlertSchema

alert_bp = Blueprint("alerts", __name__)
alert_schema = AlertSchema()
alerts_schema = AlertSchema(many=True)


@alert_bp.route("", methods=["GET"])
def get_all():
    alerts = AlertService.get_all_alerts()
    return jsonify(alerts_schema.dump(alerts)), 200


@alert_bp.route("/<int:id>/resolve", methods=["POST"])
def resolve(id):
    try:
        alert = AlertService.resolve_alert(id)
        return jsonify(alert_schema.dump(alert)), 200
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400


@alert_bp.route("/scan", methods=["POST"])
def run_scan():
    """Manual trigger to scan database for overdue/upcoming balances."""
    alerts_created = AlertService.scan_outstanding_balances()
    return jsonify({
        "success": True,
        "message": f"Scan completed. Generated {alerts_created} new system alerts.",
    }), 200
