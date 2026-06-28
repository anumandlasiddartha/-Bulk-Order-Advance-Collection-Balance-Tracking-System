"""
Cakes and Crunches — Ledger Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Ledger(db.Model):
    __tablename__ = "ledgers"

    id = db.Column(db.Integer, primary_key=True)
    wallet_id = db.Column(db.Integer, db.ForeignKey("wallets.id"), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)  # credit, debit
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    running_balance = db.Column(db.Numeric(10, 2), nullable=False)
    reference_number = db.Column(db.String(50), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "wallet_id": self.wallet_id,
            "transaction_type": self.transaction_type,
            "amount": float(self.amount),
            "running_balance": float(self.running_balance),
            "reference_number": self.reference_number,
            "description": self.description,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
