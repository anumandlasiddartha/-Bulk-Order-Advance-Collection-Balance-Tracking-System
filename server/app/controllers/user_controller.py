"""User Controller — User management routes."""
from flask import Blueprint
user_bp = Blueprint("users", __name__)


@user_bp.route("/health", methods=["GET"])
def health():
    return {"success": True, "message": "User service is running."}, 200
