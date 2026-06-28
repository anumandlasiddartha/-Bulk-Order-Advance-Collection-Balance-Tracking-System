"""
Cakes and Crunches — Marshmallow Schemas definitions
"""

from marshmallow import Schema, fields, validate, post_load
from app.utils.constants import ALL_ROLES, ALL_ORDER_STATUSES, ALL_PAYMENT_STATUSES, ALL_PAYMENT_METHODS, ALL_CAKE_TYPES, ALL_EVENT_TYPES, LEDGER_CREDIT, LEDGER_DEBIT, ALL_ALERT_TYPES


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    role = fields.Str(validate=validate.OneOf(ALL_ROLES))
    created_at = fields.DateTime(dump_only=True)


class CustomerSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(allow_none=True)
    phone = fields.Str(required=True, validate=validate.Length(min=10, max=15))
    address = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)


class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    order_number = fields.Str(dump_only=True)
    customer_id = fields.Int(required=True)
    cake_type = fields.Str(required=True, validate=validate.OneOf(ALL_CAKE_TYPES))
    event_type = fields.Str(required=True, validate=validate.OneOf(ALL_EVENT_TYPES))
    delivery_date = fields.Date(required=True)
    order_value = fields.Float(required=True, validate=validate.Range(min=0.01))
    advance_amount = fields.Float(default=0.00, validate=validate.Range(min=0.00))
    remaining_balance = fields.Float(dump_only=True)
    payment_status = fields.Str(validate=validate.OneOf(ALL_PAYMENT_STATUSES))
    order_status = fields.Str(validate=validate.OneOf(ALL_ORDER_STATUSES))
    notes = fields.Str(allow_none=True)
    attachment_path = fields.Str(allow_none=True)
    created_by = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class PaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    receipt_number = fields.Str(dump_only=True)
    order_id = fields.Int(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    payment_date = fields.DateTime(dump_only=True)
    payment_method = fields.Str(required=True, validate=validate.OneOf(ALL_PAYMENT_METHODS))
    reference_number = fields.Str(allow_none=True)
    recorded_by = fields.Int(dump_only=True)
    notes = fields.Str(allow_none=True)


class AdvancePaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    order_id = fields.Int(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    received_at = fields.DateTime(dump_only=True)
    payment_method = fields.Str(required=True, validate=validate.OneOf(ALL_PAYMENT_METHODS))
    is_verified = fields.Boolean(default=True)


class WalletSchema(Schema):
    id = fields.Int(dump_only=True)
    customer_id = fields.Int(required=True)
    balance = fields.Float(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class LedgerSchema(Schema):
    id = fields.Int(dump_only=True)
    wallet_id = fields.Int(required=True)
    transaction_type = fields.Str(required=True, validate=validate.OneOf([LEDGER_CREDIT, LEDGER_DEBIT]))
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    running_balance = fields.Float(dump_only=True)
    reference_number = fields.Str(dump_only=True)
    description = fields.Str(required=True)
    created_by = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)


class AlertSchema(Schema):
    id = fields.Int(dump_only=True)
    order_id = fields.Int(allow_none=True)
    type = fields.Str(required=True, validate=validate.OneOf(ALL_ALERT_TYPES))
    priority = fields.Str(default="medium")
    message = fields.Str(required=True)
    is_resolved = fields.Boolean(default=False)
    resolved_at = fields.DateTime(allow_none=True)
    created_at = fields.DateTime(dump_only=True)


class NotificationSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    type = fields.Str(default="info")
    title = fields.Str(required=True)
    message = fields.Str(required=True)
    is_read = fields.Boolean(default=False)
    created_at = fields.DateTime(dump_only=True)
