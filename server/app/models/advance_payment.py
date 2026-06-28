"""
Cakes and Crunches — Advance Payment Model
"""

from datetime import datetime, timezone
from app.extensions import db


class AdvancePayment(db.Model):
    __tablename__ = "advance_payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    received_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    payment_method = db.Column(db.String(20), nullable=False)
    is_verified = db.Column(db.Boolean, default=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "order_id": self.order_id,
            "amount": float(self.amount),
            "received_at": self.received_at.isoformat() if self.received_at else None,
            "payment_method": self.payment_method,
            "is_verified": self.is_verified,
        }
