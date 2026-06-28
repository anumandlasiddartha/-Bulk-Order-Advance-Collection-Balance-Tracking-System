"""
Cakes and Crunches — Input Validators

Server-side validation functions that supplement Marshmallow schema validation.
Used for complex business rule validation that doesn't fit neatly into schemas.
"""

import re
from datetime import date, datetime


def validate_phone(phone: str) -> bool:
    """Validate Indian phone number format (10 digits, optionally prefixed with +91)."""
    pattern = r"^(\+91)?[6-9]\d{9}$"
    return bool(re.match(pattern, phone.strip()))


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email.strip()))


def validate_password_strength(password: str) -> dict:
    """
    Validate password meets enterprise security requirements.

    Returns:
        Dict with 'valid' (bool) and 'errors' (list of strings).
    """
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter.")
    if not re.search(r"\d", password):
        errors.append("Password must contain at least one digit.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors.append("Password must contain at least one special character.")

    return {"valid": len(errors) == 0, "errors": errors}


def validate_advance_amount(advance: float, total: float) -> dict:
    """
    Validate that the advance amount is reasonable.

    Rules:
        - Advance must be >= 0
        - Advance must not exceed total order value
    """
    errors = []

    if advance < 0:
        errors.append("Advance amount cannot be negative.")
    if advance > total:
        errors.append("Advance amount cannot exceed the total order value.")

    return {"valid": len(errors) == 0, "errors": errors}


def validate_delivery_date(delivery_date: date) -> dict:
    """
    Validate that the delivery date is in the future.
    """
    errors = []
    today = date.today()

    if delivery_date < today:
        errors.append("Delivery date cannot be in the past.")

    return {"valid": len(errors) == 0, "errors": errors}


def sanitize_string(value: str) -> str:
    """Sanitize a string input — strip whitespace and remove potential XSS patterns."""
    if not isinstance(value, str):
        return value
    # Strip whitespace
    value = value.strip()
    # Remove script tags (basic XSS prevention — defense in depth with templating)
    value = re.sub(r"<script[^>]*>.*?</script>", "", value, flags=re.IGNORECASE | re.DOTALL)
    value = re.sub(r"<[^>]+>", "", value)
    return value
