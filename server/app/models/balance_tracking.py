"""
Cakes and Crunches — Balance Tracking Model
"""

from datetime import datetime, timezone
from app.extensions import db


class BalanceTracking(db.Model):
    __tablename__ = "balance_tracking"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    amount_paid = db.Column(db.Numeric(10, 2), default=0.00)
    balance_due = db.Column(db.Numeric(10, 2), nullable=False)
    due_date = db.Column(db.Date, nullable=False, index=True)
    last_payment_date = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "order_id": self.order_id,
            "total_amount": float(self.total_amount),
            "amount_paid": float(self.amount_paid),
            "balance_due": float(self.balance_due),
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "last_payment_date": self.last_payment_date.isoformat() if self.last_payment_date else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
