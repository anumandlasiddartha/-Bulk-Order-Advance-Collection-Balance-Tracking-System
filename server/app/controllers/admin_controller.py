"""
Admin Controllers mapping REST API endpoints, logs, and settings configurations.
"""

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from app.models.audit_log import AuditLog
from app.models.activity_log import ActivityLog
from app.models.setting import Setting
from app.middleware.auth_middleware import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    """Retrieve all user identities."""
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.route("/audit-logs", methods=["GET"])
@admin_required
def get_audit_logs():
    """Retrieve all operational audits logs."""
    logs = AuditLog.query.order_by(AuditLog.created_at.desc()).all()
    return jsonify([l.to_dict() for l in logs]), 200


@admin_bp.route("/system-logs", methods=["GET"])
@admin_required
def get_system_logs():
    """Retrieve personal activity logs as proxy for debug logs."""
    logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).all()
    return jsonify([l.to_dict() for l in logs]), 200


@admin_bp.route("/settings", methods=["GET"])
def get_settings():
    """Get all settings configurations."""
    settings = Setting.query.all()
    return jsonify([s.to_dict() for s in settings]), 200


@admin_bp.route("/settings/<string:key>", methods=["POST"])
@admin_required
def update_setting(key):
    """Update setting value by key."""
    data = request.get_json() or {}
    val = data.get("value")
    
    setting = Setting.query.filter_by(key=key).first()
    if not setting:
        return jsonify({"success": False, "message": "Setting not found."}), 404
        
    setting.value = str(val)
    db.session.commit()
    return jsonify({"success": True, "setting": setting.to_dict()}), 200
print("Loaded admin_controller.")
