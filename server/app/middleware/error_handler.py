"""
Cakes and Crunches — Global Error Handlers

Standardized JSON error responses for all HTTP error codes.
Registered in the app factory via register_error_handler().
"""

from flask import jsonify


def _error_response(status_code: int, error: str, message: str):
    """Build a consistent error JSON response."""
    response = jsonify({
        "success": False,
        "error": error,
        "message": message,
        "status_code": status_code,
    })
    response.status_code = status_code
    return response


def handle_400(e):
    """Bad Request — malformed input or validation failure."""
    return _error_response(400, "Bad Request", str(e.description) if hasattr(e, "description") else "Invalid request data.")


def handle_401(e):
    """Unauthorized — missing or invalid authentication."""
    return _error_response(401, "Unauthorized", "Authentication is required to access this resource.")


def handle_403(e):
    """Forbidden — authenticated but insufficient permissions."""
    return _error_response(403, "Forbidden", "You do not have permission to perform this action.")


def handle_404(e):
    """Not Found — resource does not exist."""
    return _error_response(404, "Not Found", "The requested resource was not found.")


def handle_422(e):
    """Unprocessable Entity — semantically invalid data."""
    return _error_response(422, "Unprocessable Entity", str(e.description) if hasattr(e, "description") else "The submitted data could not be processed.")


def handle_429(e):
    """Too Many Requests — rate limit exceeded."""
    return _error_response(429, "Too Many Requests", "Rate limit exceeded. Please try again later.")


def handle_500(e):
    """Internal Server Error — unexpected failure."""
    return _error_response(500, "Internal Server Error", "An unexpected error occurred. Please try again later.")
