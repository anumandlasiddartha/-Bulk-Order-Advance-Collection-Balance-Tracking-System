"""
Cakes and Crunches — Audit Logger Middleware

Automatically logs sensitive operations (create, update, delete)
to the AuditLogs table for compliance and traceability.
"""

from datetime import datetime, timezone
from functools import wraps

from flask import request
from flask_jwt_extended import get_jwt_identity


def audit_log(action: str, entity_type: str):
    """
    Decorator that logs an action to the AuditLogs table after
    the wrapped function executes successfully.

    Args:
        action: The action being performed ('CREATE', 'UPDATE', 'DELETE').
        entity_type: The type of entity being acted upon ('Order', 'Payment', etc.).

    Usage:
        @audit_log("CREATE", "Order")
        def create_order():
            ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            result = fn(*args, **kwargs)

            try:
                # Lazy import to avoid circular dependencies
                from app.models.audit_log import AuditLog
                from app.extensions import db

                user_id = get_jwt_identity()
                log_entry = AuditLog(
                    user_id=user_id,
                    action=action,
                    entity_type=entity_type,
                    entity_id=kwargs.get("id") or kwargs.get("entity_id"),
                    ip_address=request.remote_addr,
                    user_agent=request.headers.get("User-Agent", ""),
                    details=f"{action} {entity_type} via {request.method} {request.path}",
                    created_at=datetime.now(timezone.utc),
                )
                db.session.add(log_entry)
                db.session.commit()
            except Exception:
                # Audit logging should never break the main operation
                pass

            return result
        return wrapper
    return decorator
