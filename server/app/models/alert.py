"""
Cakes and Crunches — Alert Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)
    type = db.Column(db.String(30), nullable=False, index=True)  # balance_due, upcoming_due, overdue, low_advance, etc.
    priority = db.Column(db.String(15), default="medium", index=True)  # low, medium, high, critical
    message = db.Column(db.Text, nullable=False)
    is_resolved = db.Column(db.Boolean, default=False, index=True)
    resolved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "order_id": self.order_id,
            "type": self.type,
            "priority": self.priority,
            "message": self.message,
            "is_resolved": self.is_resolved,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
