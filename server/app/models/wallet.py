"""
Cakes and Crunches — Wallet Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Wallet(db.Model):
    __tablename__ = "wallets"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), unique=True, nullable=False)
    balance = db.Column(db.Numeric(10, 2), default=0.00)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    ledgers = db.relationship("Ledger", backref="wallet", lazy=True, cascade="all, delete-orphan")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "balance": float(self.balance),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
