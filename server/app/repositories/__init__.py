"""
Cakes and Crunches — Repositories Implementation
"""

from typing import Optional
from app.repositories.base_repository import BaseRepository
from app.models.user import User
from app.models.customer import Customer
from app.models.order import Order
from app.models.payment import Payment
from app.models.advance_payment import AdvancePayment
from app.models.balance_tracking import BalanceTracking
from app.models.wallet import Wallet
from app.models.ledger import Ledger
from app.models.alert import Alert
from app.models.notification import Notification


class UserRepository(BaseRepository):
    model = User

    @classmethod
    def get_by_email(cls, email: str) -> Optional[User]:
        return cls.model.query.filter_by(email=email).first()

    @classmethod
    def get_by_username(cls, username: str) -> Optional[User]:
        return cls.model.query.filter_by(username=username).first()


class CustomerRepository(BaseRepository):
    model = Customer

    @classmethod
    def get_by_phone(cls, phone: str) -> Optional[Customer]:
        return cls.model.query.filter_by(phone=phone).first()

    @classmethod
    def get_by_email(cls, email: str) -> Optional[Customer]:
        return cls.model.query.filter_by(email=email).first()


class OrderRepository(BaseRepository):
    model = Order

    @classmethod
    def get_by_order_number(cls, order_number: str) -> Optional[Order]:
        return cls.model.query.filter_by(order_number=order_number).first()

    @classmethod
    def get_by_customer_id(cls, customer_id: int) -> list[Order]:
        return cls.model.query.filter_by(customer_id=customer_id).all()


class PaymentRepository(BaseRepository):
    model = Payment

    @classmethod
    def get_by_receipt_number(cls, receipt_number: str) -> Optional[Payment]:
        return cls.model.query.filter_by(receipt_number=receipt_number).first()

    @classmethod
    def get_by_order_id(cls, order_id: int) -> list[Payment]:
        return cls.model.query.filter_by(order_id=order_id).all()


class AdvancePaymentRepository(BaseRepository):
    model = AdvancePayment

    @classmethod
    def get_by_order_id(cls, order_id: int) -> list[AdvancePayment]:
        return cls.model.query.filter_by(order_id=order_id).all()


class BalanceTrackingRepository(BaseRepository):
    model = BalanceTracking

    @classmethod
    def get_by_order_id(cls, order_id: int) -> Optional[BalanceTracking]:
        return cls.model.query.filter_by(order_id=order_id).first()


class WalletRepository(BaseRepository):
    model = Wallet

    @classmethod
    def get_by_customer_id(cls, customer_id: int) -> Optional[Wallet]:
        return cls.model.query.filter_by(customer_id=customer_id).first()


class LedgerRepository(BaseRepository):
    model = Ledger

    @classmethod
    def get_by_wallet_id(cls, wallet_id: int) -> list[Ledger]:
        return cls.model.query.filter_by(wallet_id=wallet_id).all()


class AlertRepository(BaseRepository):
    model = Alert

    @classmethod
    def get_unresolved(cls) -> list[Alert]:
        return cls.model.query.filter_by(is_resolved=False).all()


class NotificationRepository(BaseRepository):
    model = Notification

    @classmethod
    def get_unread_by_user(cls, user_id: int) -> list[Notification]:
        return cls.model.query.filter_by(user_id=user_id, is_read=False).all()
