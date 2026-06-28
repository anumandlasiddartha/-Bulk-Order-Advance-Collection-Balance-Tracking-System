"""
Cakes and Crunches — Order Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    cake_type = db.Column(db.String(50), nullable=False)  # birthday, wedding, custom etc.
    event_type = db.Column(db.String(50), nullable=False)  # birthday, corporate, festival etc.
    delivery_date = db.Column(db.Date, nullable=False)
    order_value = db.Column(db.Numeric(10, 2), nullable=False)
    advance_amount = db.Column(db.Numeric(10, 2), default=0.00)
    remaining_balance = db.Column(db.Numeric(10, 2), default=0.00)
    payment_status = db.Column(db.String(20), default="pending", index=True)  # pending, partial, completed, refunded, overdue
    order_status = db.Column(db.String(20), default="pending", index=True)  # pending, confirmed, in_progress, ready, delivered, cancelled
    notes = db.Column(db.Text, nullable=True)
    attachment_path = db.Column(db.String(256), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    payments = db.relationship("Payment", backref="order", lazy=True, cascade="all, delete-orphan")
    advance_payments = db.relationship("AdvancePayment", backref="order", lazy=True, cascade="all, delete-orphan")
    balance_trackings = db.relationship("BalanceTracking", backref="order", lazy=True, cascade="all, delete-orphan")
    alerts = db.relationship("Alert", backref="order", lazy=True, cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "order_number": self.order_number,
            "customer_id": self.customer_id,
            "cake_type": self.cake_type,
            "event_type": self.event_type,
            "delivery_date": self.delivery_date.isoformat() if self.delivery_date else None,
            "order_value": float(self.order_value),
            "advance_amount": float(self.advance_amount),
            "remaining_balance": float(self.remaining_balance),
            "payment_status": self.payment_status,
            "order_status": self.order_status,
            "notes": self.notes,
            "attachment_path": self.attachment_path,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
