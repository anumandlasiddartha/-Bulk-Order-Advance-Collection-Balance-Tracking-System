"""
Notification Controllers mapping REST API endpoints.
"""

from flask import Blueprint, jsonify
from app.extensions import db
from app.repositories import NotificationRepository
from app.schemas import NotificationSchema

notification_bp = Blueprint("notifications", __name__)
notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)


@notification_bp.route("", methods=["GET"])
def get_all():
    """
    Get all notifications logs.
    For simplicity, queries all notifications in database.
    """
    notifications = NotificationRepository.model.query.order_by(NotificationRepository.model.created_at.desc()).all()
    return jsonify(notifications_schema.dump(notifications)), 200


@notification_bp.route("/mark-read", methods=["POST"])
def mark_all_read():
    """Mark all active unread notifications as read."""
    unread_logs = NotificationRepository.model.query.filter_by(is_read=False).all()
    for n in unread_logs:
        n.is_read = True
    db.session.commit()
    return jsonify({"success": True, "message": "All notifications marked as read."}), 200
print("Loaded notification_controller.")
