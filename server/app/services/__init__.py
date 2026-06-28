"""
Cakes and Crunches — Core Services Layer Implementation
"""

from datetime import datetime, timezone, date
from app.extensions import db
from app.repositories import (
    UserRepository,
    CustomerRepository,
    OrderRepository,
    PaymentRepository,
    AdvancePaymentRepository,
    BalanceTrackingRepository,
    WalletRepository,
    LedgerRepository,
    AlertRepository,
    NotificationRepository,
)
from app.models.wallet import Wallet
from app.models.balance_tracking import BalanceTracking
from app.models.ledger import Ledger
from app.models.advance_payment import AdvancePayment
from app.models.alert import Alert
from app.models.notification import Notification
from app.utils.helpers import (
    generate_order_number,
    generate_receipt_number,
    generate_reference_number,
)
from app.utils.constants import (
    LOW_ADVANCE_THRESHOLD_PERCENT,
    LARGE_ORDER_THRESHOLD,
    PAYMENT_STATUS_COMPLETED,
    PAYMENT_STATUS_PARTIAL,
    PAYMENT_STATUS_PENDING,
)


class CustomerService:
    @staticmethod
    def get_all_customers():
        return CustomerRepository.get_all()

    @staticmethod
    def get_customer(customer_id: int):
        return CustomerRepository.get_by_id(customer_id)

    @staticmethod
    def create_customer(data: dict):
        existing_phone = CustomerRepository.get_by_phone(data.get("phone"))
        if existing_phone:
            raise ValueError("Customer with this phone number already exists.")
        
        # Create customer and auto-initiate empty Wallet
        customer = CustomerRepository.create(data)
        wallet = Wallet(customer_id=customer.id, balance=0.00)
        db.session.add(wallet)
        db.session.commit()
        return customer


class OrderService:
    @staticmethod
    def get_all_orders(filters=None):
        return OrderRepository.get_all() if not filters else OrderRepository.get_paginated(filters=filters)

    @staticmethod
    def get_order(order_id: int):
        return OrderRepository.get_by_id(order_id)

    @staticmethod
    def create_order(data: dict, user_id: int):
        data["order_number"] = generate_order_number()
        data["created_by"] = user_id
        
        if isinstance(data.get("delivery_date"), str):
            try:
                data["delivery_date"] = datetime.strptime(data["delivery_date"].split("T")[0], "%Y-%m-%d").date()
            except ValueError:
                pass

        order_val = float(data.get("order_value"))
        adv_val = float(data.get("advance_amount", 0.00))

        if adv_val > order_val:
            raise ValueError("Advance cannot exceed order value.")

        data["remaining_balance"] = order_val - adv_val

        # Setup payment status
        if adv_val == order_val:
            data["payment_status"] = PAYMENT_STATUS_COMPLETED
        elif adv_val > 0:
            data["payment_status"] = PAYMENT_STATUS_PARTIAL
        else:
            data["payment_status"] = PAYMENT_STATUS_PENDING

        order = OrderRepository.create(data)

        # 1. Create Balance Tracking Row
        bt = BalanceTracking(
            order_id=order.id,
            total_amount=order_val,
            amount_paid=adv_val,
            balance_due=order_val - adv_val,
            due_date=order.delivery_date,  # default due date is delivery date
            last_payment_date=datetime.now(timezone.utc) if adv_val > 0 else None,
        )
        db.session.add(bt)

        # 2. Add to Advance Payments table if advance is paid
        if adv_val > 0:
            ap = AdvancePayment(
                order_id=order.id,
                amount=adv_val,
                payment_method="cash",  # Default placeholder
                is_verified=True,
            )
            db.session.add(ap)

        # 3. Check for Alerts
        # Low Advance Alert
        adv_percent = (adv_val / order_val) * 100 if order_val > 0 else 0
        if adv_percent < LOW_ADVANCE_THRESHOLD_PERCENT and order_val > 0:
            alert = Alert(
                order_id=order.id,
                type="low_advance",
                priority="medium",
                message=f"Order {order.order_number} advance of {adv_percent:.1f}% is below the {LOW_ADVANCE_THRESHOLD_PERCENT}% threshold.",
            )
            db.session.add(alert)

        # Large Order Alert
        if order_val >= LARGE_ORDER_THRESHOLD:
            alert = Alert(
                order_id=order.id,
                type="large_order",
                priority="high",
                message=f"Large order {order.order_number} value Rs. {order_val:,.2f} placed.",
            )
            db.session.add(alert)

        db.session.commit()
        return order


class PaymentService:
    @staticmethod
    def get_order_payments(order_id: int):
        return PaymentRepository.get_by_order_id(order_id)

    @staticmethod
    def collect_payment(data: dict, user_id: int):
        order = OrderRepository.get_by_id(data.get("order_id"))
        if not order:
            raise ValueError("Order not found.")

        collect_amount = float(data.get("amount"))
        if collect_amount <= 0:
            raise ValueError("Payment amount must be greater than zero.")

        if collect_amount > float(order.remaining_balance):
            raise ValueError("Payment exceeds remaining due balance.")

        data["receipt_number"] = generate_receipt_number()
        data["recorded_by"] = user_id
        
        payment = PaymentRepository.create(data)

        # Update order balance details
        order.advance_amount = float(order.advance_amount) + collect_amount
        order.remaining_balance = float(order.remaining_balance) - collect_amount

        if float(order.remaining_balance) == 0:
            order.payment_status = PAYMENT_STATUS_COMPLETED
            
            # Auto resolve balance due alerts for this order
            alerts = Alert.query.filter_by(order_id=order.id, type="balance_due", is_resolved=False).all()
            for al in alerts:
                al.is_resolved = True
                al.resolved_at = datetime.now(timezone.utc)
        else:
            order.payment_status = PAYMENT_STATUS_PARTIAL

        # Update Balance Tracking
        bt = BalanceTrackingRepository.get_by_order_id(order.id)
        if bt:
            bt.amount_paid = float(bt.amount_paid) + collect_amount
            bt.balance_due = float(bt.balance_due) - collect_amount
            bt.last_payment_date = datetime.now(timezone.utc)

        db.session.commit()
        return payment


class WalletService:
    @staticmethod
    def get_wallet(customer_id: int):
        return WalletRepository.get_by_customer_id(customer_id)

    @staticmethod
    def credit_wallet(customer_id: int, amount: float, description: str, user_id: int):
        wallet = WalletRepository.get_by_customer_id(customer_id)
        if not wallet:
            raise ValueError("Wallet not found.")

        wallet.balance = float(wallet.balance) + amount
        
        ledger = Ledger(
            wallet_id=wallet.id,
            transaction_type="credit",
            amount=amount,
            running_balance=wallet.balance,
            reference_number=generate_reference_number("TXN"),
            description=description,
            created_by=user_id,
        )
        db.session.add(ledger)
        db.session.commit()
        return wallet

    @staticmethod
    def debit_wallet(customer_id: int, amount: float, description: str, user_id: int):
        wallet = WalletRepository.get_by_customer_id(customer_id)
        if not wallet:
            raise ValueError("Wallet not found.")

        if float(wallet.balance) < amount:
            raise ValueError("Insufficient wallet balance.")

        wallet.balance = float(wallet.balance) - amount
        
        ledger = Ledger(
            wallet_id=wallet.id,
            transaction_type="debit",
            amount=amount,
            running_balance=wallet.balance,
            reference_number=generate_reference_number("TXN"),
            description=description,
            created_by=user_id,
        )
        db.session.add(ledger)
        db.session.commit()
        return wallet
