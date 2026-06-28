"""Search Controller — Global search and advanced filter routes."""
from flask import Blueprint
search_bp = Blueprint("search", __name__)


@search_bp.route("/health", methods=["GET"])
def health():
    return {"success": True, "message": "Search service is running."}, 200
