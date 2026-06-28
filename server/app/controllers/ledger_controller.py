"""
Ledger Controllers mapping REST API endpoints.
"""

from flask import Blueprint, request, jsonify
from app.repositories import LedgerRepository
from app.schemas import LedgerSchema

ledger_bp = Blueprint("ledger", __name__)
ledger_schema = LedgerSchema()
ledgers_schema = LedgerSchema(many=True)


@ledger_bp.route("", methods=["GET"])
def get_all():
    """
    Retrieve all ledger double-entry transactions.
    Supports filtering by transaction_type (credit/debit).
    """
    tx_type = request.args.get("transaction_type")
    
    query = LedgerRepository.model.query
    if tx_type in ["credit", "debit"]:
        query = query.filter_by(transaction_type=tx_type)
        
    ledgers = query.order_by(LedgerRepository.model.created_at.desc()).all()
    return jsonify(ledgers_schema.dump(ledgers)), 200
