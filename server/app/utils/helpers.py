"""
Cakes and Crunches — Helper Utilities

Common helper functions used across services and controllers.
"""

import uuid
from datetime import datetime, timezone


def generate_reference_number(prefix: str = "TXN") -> str:
    """
    Generate a unique reference number for transactions and orders.

    Format: PREFIX-YYYYMMDD-XXXXXXXX
    Example: TXN-20260628-A1B2C3D4
    """
    date_part = datetime.now(timezone.utc).strftime("%Y%m%d")
    unique_part = uuid.uuid4().hex[:8].upper()
    return f"{prefix}-{date_part}-{unique_part}"


def generate_order_number() -> str:
    """Generate a unique order number. Format: ORD-YYYYMMDD-XXXXXXXX"""
    return generate_reference_number("ORD")


def generate_invoice_number() -> str:
    """Generate a unique invoice number. Format: INV-YYYYMMDD-XXXXXXXX"""
    return generate_reference_number("INV")


def generate_receipt_number() -> str:
    """Generate a unique receipt number. Format: REC-YYYYMMDD-XXXXXXXX"""
    return generate_reference_number("REC")


def utc_now() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


def format_currency(amount: float) -> str:
    """Format a number as Indian Rupees. Example: ₹1,25,000.00"""
    if amount < 0:
        return f"-₹{abs(amount):,.2f}"
    return f"₹{amount:,.2f}"


def calculate_percentage(part: float, whole: float) -> float:
    """Calculate percentage safely, returning 0 if whole is 0."""
    if whole == 0:
        return 0.0
    return round((part / whole) * 100, 2)


def paginate_args(args: dict) -> dict:
    """
    Extract and validate pagination arguments from request query params.

    Returns:
        Dict with 'page', 'per_page', 'sort_by', 'sort_order'.
    """
    return {
        "page": max(1, int(args.get("page", 1))),
        "per_page": min(100, max(1, int(args.get("per_page", 20)))),
        "sort_by": args.get("sort_by", "created_at"),
        "sort_order": args.get("sort_order", "desc"),
    }
