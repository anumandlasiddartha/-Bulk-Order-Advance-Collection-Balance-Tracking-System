"""
Cakes and Crunches — Database Seed Data Implementation
"""

from datetime import date, datetime, timedelta, timezone
from app.extensions import db
from app.models.user import User
from app.models.customer import Customer
from app.models.order import Order
from app.models.payment import Payment
from app.models.advance_payment import AdvancePayment
from app.models.balance_tracking import BalanceTracking
from app.models.wallet import Wallet
from app.models.ledger import Ledger
from app.models.setting import Setting
from app.models.alert import Alert
from app.models.notification import Notification
from app.utils.helpers import generate_order_number, generate_receipt_number, generate_reference_number


def seed_all():
    """Seed all tables with sample data."""
    print("Seeding database...")

    # 1. Clean existing records (optional, but good for reset seed)
    db.drop_all()
    db.create_all()

    # 2. Add Users
    admin = User(username="admin", email="admin@cakesandcrunches.com", full_name="Elite Admin", role="admin")
    admin.set_password("AdminPass123!")

    manager = User(username="manager", email="manager@cakesandcrunches.com", full_name="Sales Manager", role="manager")
    manager.set_password("ManagerPass123!")

    staff = User(username="staff", email="staff@cakesandcrunches.com", full_name="Baker Staff", role="staff")
    staff.set_password("StaffPass123!")

    db.session.add_all([admin, manager, staff])
    db.session.commit()

    # 3. Add Customers
    cust1 = Customer(name="Aria Grand Hotels", email="events@ariagrand.com", phone="9876543210", address="Aria Towers, Mumbai")
    cust2 = Customer(name="TechSolutions India", email="hr@techsolutions.in", phone="9812345678", address="TechPark, Pune")
    cust3 = Customer(name="Ananya Sharma", email="ananya.sharma@gmail.com", phone="7890123456", address="Bandra West, Mumbai")

    db.session.add_all([cust1, cust2, cust3])
    db.session.commit()

    # 4. Add Wallets per Customer
    w1 = Wallet(customer_id=cust1.id, balance=0.00)
    w2 = Wallet(customer_id=cust2.id, balance=1500.00)  # Customer has deposit/credit
    w3 = Wallet(customer_id=cust3.id, balance=0.00)

    db.session.add_all([w1, w2, w3])
    db.session.commit()

    # 5. Ledger record for cust2 wallet credits
    l_entry = Ledger(
        wallet_id=w2.id,
        transaction_type="credit",
        amount=1500.00,
        running_balance=1500.00,
        reference_number=generate_reference_number("TXN"),
        description="Advance refund credited to wallet",
        created_by=admin.id,
    )
    db.session.add(l_entry)
    db.session.commit()

    # 6. Add Orders
    # Order 1: Aria Grand - Confirmed, Partially Paid
    ord_val1 = 60000.00
    adv_val1 = 20000.00
    o1 = Order(
        order_number=generate_order_number(),
        customer_id=cust1.id,
        cake_type="wedding",
        event_type="wedding",
        delivery_date=date.today() + timedelta(days=15),
        order_value=ord_val1,
        advance_amount=adv_val1,
        remaining_balance=ord_val1 - adv_val1,
        payment_status="partial",
        order_status="confirmed",
        notes="5 Tier fondant wedding cake with white orchid decorations.",
        created_by=manager.id,
    )

    # Order 2: TechSolutions - Pending, Overdue (Delivery past, balance unpaid)
    ord_val2 = 12000.00
    adv_val2 = 2000.00
    o2 = Order(
        order_number=generate_order_number(),
        customer_id=cust2.id,
        cake_type="cupcakes",
        event_type="corporate",
        delivery_date=date.today() - timedelta(days=2),
        order_value=ord_val2,
        advance_amount=adv_val2,
        remaining_balance=ord_val2 - adv_val2,
        payment_status="overdue",
        order_status="delivered",
        notes="200 Corporate branded cupcakes for anniversary.",
        created_by=staff.id,
    )

    # Order 3: Ananya - Pending, Low Advance (Needs attention)
    ord_val3 = 8000.00
    adv_val3 = 500.00  # Less than 20%
    o3 = Order(
        order_number=generate_order_number(),
        customer_id=cust3.id,
        cake_type="birthday",
        event_type="birthday",
        delivery_date=date.today() + timedelta(days=5),
        order_value=ord_val3,
        advance_amount=adv_val3,
        remaining_balance=ord_val3 - adv_val3,
        payment_status="pending",
        order_status="pending",
        notes="Chocolate truffle cake with gold leaf toppings.",
        created_by=manager.id,
    )

    db.session.add_all([o1, o2, o3])
    db.session.commit()

    # 7. Add Payments & AdvancePayments records
    # Order 1 Payment
    rec1 = generate_receipt_number()
    p1 = Payment(receipt_number=rec1, order_id=o1.id, amount=adv_val1, payment_method="bank_transfer", reference_number="TXN12938472", recorded_by=manager.id, notes="Initial booking advance payment")
    ap1 = AdvancePayment(order_id=o1.id, amount=adv_val1, payment_method="bank_transfer", is_verified=True)

    # Order 2 Payment
    rec2 = generate_receipt_number()
    p2 = Payment(receipt_number=rec2, order_id=o2.id, amount=adv_val2, payment_method="upi", reference_number="UPI-99238472-OK", recorded_by=staff.id, notes="Booking deposit")
    ap2 = AdvancePayment(order_id=o2.id, amount=adv_val2, payment_method="upi", is_verified=True)

    # Order 3 Payment
    rec3 = generate_receipt_number()
    p3 = Payment(receipt_number=rec3, order_id=o3.id, amount=adv_val3, payment_method="cash", recorded_by=manager.id, notes="Small cash advance deposit")
    ap3 = AdvancePayment(order_id=o3.id, amount=adv_val3, payment_method="cash", is_verified=True)

    db.session.add_all([p1, ap1, p2, ap2, p3, ap3])
    db.session.commit()

    # 8. Balance Tracking records
    bt1 = BalanceTracking(order_id=o1.id, total_amount=ord_val1, amount_paid=adv_val1, balance_due=ord_val1 - adv_val1, due_date=date.today() + timedelta(days=12), last_payment_date=datetime.now(timezone.utc))
    bt2 = BalanceTracking(order_id=o2.id, total_amount=ord_val2, amount_paid=adv_val2, balance_due=ord_val2 - adv_val2, due_date=date.today() - timedelta(days=5), last_payment_date=datetime.now(timezone.utc))
    bt3 = BalanceTracking(order_id=o3.id, total_amount=ord_val3, amount_paid=adv_val3, balance_due=ord_val3 - adv_val3, due_date=date.today() + timedelta(days=3), last_payment_date=datetime.now(timezone.utc))

    db.session.add_all([bt1, bt2, bt3])
    db.session.commit()

    # 9. Alerts
    a1 = Alert(order_id=o2.id, type="overdue", priority="high", message=f"Order {o2.order_number} for customer {cust2.name} is overdue by Rs. 10,000.00.")
    a2 = Alert(order_id=o3.id, type="low_advance", priority="medium", message=f"Order {o3.order_number} has an advance of only {float(adv_val3)/float(ord_val3)*100:.1f}%, which is below the 20% limit.")
    db.session.add_all([a1, a2])
    db.session.commit()

    # 10. Settings
    s1 = Setting(key="low_advance_limit_percent", value="20", description="Minimum advance percentage required for bulk orders")
    s2 = Setting(key="overdue_grace_days", value="3", description="Grace days allowed after due date before alerting")
    s3 = Setting(key="large_order_limit", value="50000", description="Threshold above which an order is marked as large order")
    db.session.add_all([s1, s2, s3])
    db.session.commit()

    # 11. Initial Notification
    n1 = Notification(user_id=admin.id, type="warning", title="System Startup", message="Database successfully re-seeded with demo records.")
    db.session.add(n1)
    db.session.commit()

    print("Seeding complete.")
