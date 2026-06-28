"""
Cakes and Crunches — Application Constants

Centralized constants used across the application.
Prevents magic strings and numbers throughout the codebase.
"""

# ──────────────────────────────────────────────
# User Roles
# ──────────────────────────────────────────────
ROLE_ADMIN = "admin"
ROLE_MANAGER = "manager"
ROLE_STAFF = "staff"

ALL_ROLES = [ROLE_ADMIN, ROLE_MANAGER, ROLE_STAFF]

# ──────────────────────────────────────────────
# Order Statuses
# ──────────────────────────────────────────────
ORDER_STATUS_PENDING = "pending"
ORDER_STATUS_CONFIRMED = "confirmed"
ORDER_STATUS_IN_PROGRESS = "in_progress"
ORDER_STATUS_READY = "ready"
ORDER_STATUS_DELIVERED = "delivered"
ORDER_STATUS_CANCELLED = "cancelled"

ALL_ORDER_STATUSES = [
    ORDER_STATUS_PENDING,
    ORDER_STATUS_CONFIRMED,
    ORDER_STATUS_IN_PROGRESS,
    ORDER_STATUS_READY,
    ORDER_STATUS_DELIVERED,
    ORDER_STATUS_CANCELLED,
]

# ──────────────────────────────────────────────
# Payment Statuses
# ──────────────────────────────────────────────
PAYMENT_STATUS_PENDING = "pending"
PAYMENT_STATUS_PARTIAL = "partial"
PAYMENT_STATUS_COMPLETED = "completed"
PAYMENT_STATUS_REFUNDED = "refunded"
PAYMENT_STATUS_OVERDUE = "overdue"

ALL_PAYMENT_STATUSES = [
    PAYMENT_STATUS_PENDING,
    PAYMENT_STATUS_PARTIAL,
    PAYMENT_STATUS_COMPLETED,
    PAYMENT_STATUS_REFUNDED,
    PAYMENT_STATUS_OVERDUE,
]

# ──────────────────────────────────────────────
# Payment Methods
# ──────────────────────────────────────────────
PAYMENT_METHOD_CASH = "cash"
PAYMENT_METHOD_UPI = "upi"
PAYMENT_METHOD_CARD = "card"
PAYMENT_METHOD_BANK_TRANSFER = "bank_transfer"
PAYMENT_METHOD_CHEQUE = "cheque"

ALL_PAYMENT_METHODS = [
    PAYMENT_METHOD_CASH,
    PAYMENT_METHOD_UPI,
    PAYMENT_METHOD_CARD,
    PAYMENT_METHOD_BANK_TRANSFER,
    PAYMENT_METHOD_CHEQUE,
]

# ──────────────────────────────────────────────
# Cake Types
# ──────────────────────────────────────────────
CAKE_TYPE_BIRTHDAY = "birthday"
CAKE_TYPE_WEDDING = "wedding"
CAKE_TYPE_ANNIVERSARY = "anniversary"
CAKE_TYPE_CUSTOM = "custom"
CAKE_TYPE_CUPCAKES = "cupcakes"
CAKE_TYPE_PASTRIES = "pastries"
CAKE_TYPE_COOKIES = "cookies"
CAKE_TYPE_BROWNIES = "brownies"

ALL_CAKE_TYPES = [
    CAKE_TYPE_BIRTHDAY,
    CAKE_TYPE_WEDDING,
    CAKE_TYPE_ANNIVERSARY,
    CAKE_TYPE_CUSTOM,
    CAKE_TYPE_CUPCAKES,
    CAKE_TYPE_PASTRIES,
    CAKE_TYPE_COOKIES,
    CAKE_TYPE_BROWNIES,
]

# ──────────────────────────────────────────────
# Event Types
# ──────────────────────────────────────────────
EVENT_TYPE_BIRTHDAY = "birthday"
EVENT_TYPE_WEDDING = "wedding"
EVENT_TYPE_CORPORATE = "corporate"
EVENT_TYPE_FESTIVAL = "festival"
EVENT_TYPE_PARTY = "party"
EVENT_TYPE_OTHER = "other"

ALL_EVENT_TYPES = [
    EVENT_TYPE_BIRTHDAY,
    EVENT_TYPE_WEDDING,
    EVENT_TYPE_CORPORATE,
    EVENT_TYPE_FESTIVAL,
    EVENT_TYPE_PARTY,
    EVENT_TYPE_OTHER,
]

# ──────────────────────────────────────────────
# Ledger Transaction Types
# ──────────────────────────────────────────────
LEDGER_CREDIT = "credit"
LEDGER_DEBIT = "debit"

# ──────────────────────────────────────────────
# Alert Types
# ──────────────────────────────────────────────
ALERT_BALANCE_DUE = "balance_due"
ALERT_UPCOMING_DUE = "upcoming_due"
ALERT_OVERDUE = "overdue"
ALERT_LOW_ADVANCE = "low_advance"
ALERT_PAYMENT_COMPLETED = "payment_completed"
ALERT_LARGE_ORDER = "large_order"
ALERT_REMINDER = "reminder"

ALL_ALERT_TYPES = [
    ALERT_BALANCE_DUE,
    ALERT_UPCOMING_DUE,
    ALERT_OVERDUE,
    ALERT_LOW_ADVANCE,
    ALERT_PAYMENT_COMPLETED,
    ALERT_LARGE_ORDER,
    ALERT_REMINDER,
]

# ──────────────────────────────────────────────
# Alert Priorities
# ──────────────────────────────────────────────
PRIORITY_LOW = "low"
PRIORITY_MEDIUM = "medium"
PRIORITY_HIGH = "high"
PRIORITY_CRITICAL = "critical"

# ──────────────────────────────────────────────
# Notification Types
# ──────────────────────────────────────────────
NOTIFICATION_INFO = "info"
NOTIFICATION_SUCCESS = "success"
NOTIFICATION_WARNING = "warning"
NOTIFICATION_ERROR = "error"

# ──────────────────────────────────────────────
# Pagination Defaults
# ──────────────────────────────────────────────
DEFAULT_PAGE = 1
DEFAULT_PER_PAGE = 20
MAX_PER_PAGE = 100

# ──────────────────────────────────────────────
# Thresholds
# ──────────────────────────────────────────────
LOW_ADVANCE_THRESHOLD_PERCENT = 20  # Alert if advance < 20% of order value
LARGE_ORDER_THRESHOLD = 50000       # Alert for orders above ₹50,000
OVERDUE_GRACE_DAYS = 3              # Days after due date before marking overdue
