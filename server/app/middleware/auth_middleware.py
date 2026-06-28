"""
Cakes and Crunches — Authentication Middleware

Decorators for protecting routes with JWT authentication
and role-based access control (RBAC).
"""

from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request


def auth_required(fn):
    """
    Decorator that ensures a valid JWT token is present in the request.
    Returns 401 if the token is missing or invalid.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify({
                "success": False,
                "error": "Unauthorized",
                "message": "Valid authentication token is required.",
            }), 401
        return fn(*args, **kwargs)
    return wrapper


def role_required(*allowed_roles):
    """
    Decorator that enforces role-based access control.

    Usage:
        @role_required("admin", "manager")
        def admin_endpoint():
            ...

    The JWT token must contain a 'role' claim matching one of the allowed roles.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception:
                return jsonify({
                    "success": False,
                    "error": "Unauthorized",
                    "message": "Valid authentication token is required.",
                }), 401

            claims = get_jwt()
            user_role = claims.get("role", "staff")

            if user_role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "error": "Forbidden",
                    "message": f"This action requires one of the following roles: {', '.join(allowed_roles)}.",
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator


def admin_required(fn):
    """Shortcut decorator requiring admin role."""
    return role_required("admin")(fn)


def manager_required(fn):
    """Shortcut decorator requiring admin or manager role."""
    return role_required("admin", "manager")(fn)
