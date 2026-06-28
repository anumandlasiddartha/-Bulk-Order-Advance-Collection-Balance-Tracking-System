"""
Cakes and Crunches — Alert Service Scan Implementation
"""

from datetime import date, datetime, timezone
from app.extensions import db
from app.models.order import Order
from app.models.balance_tracking import BalanceTracking
from app.models.alert import Alert


class AlertService:
    @staticmethod
    def get_all_alerts():
        return Alert.query.order_by(Alert.created_at.desc()).all()

    @staticmethod
    def resolve_alert(alert_id: int):
        alert = Alert.query.get(alert_id)
        if not alert:
            raise ValueError("Alert not found.")
        alert.is_resolved = True
        alert.resolved_at = datetime.now(timezone.utc)
        db.session.commit()
        return alert

    @staticmethod
    def scan_outstanding_balances():
        """
        Scan all active balance tracks:
        - If past due date and remaining balance > 0 -> mark 'overdue' status & log Critical Alert.
        - If due date is within 3 days -> log warning 'upcoming_due' Alert.
        """
        print("Scanning outstanding balances for alerts...")
        today = date.today()
        upcoming_threshold = today + timedelta(days=3) if 'timedelta' in globals() else today

        try:
            from datetime import timedelta
            upcoming_threshold = today + timedelta(days=3)
        except ImportError:
            pass

        # Fetch active tracks with balance due
        due_tracks = BalanceTracking.query.filter(BalanceTracking.balance_due > 0).all()
        alerts_created = 0

        for track in due_tracks:
            order = Order.query.get(track.order_id)
            if not order:
                continue

            # 1. Check Overdue Dues
            if track.due_date < today:
                # Update order status to overdue
                order.payment_status = "overdue"
                
                # Check duplicate alert
                exists = Alert.query.filter_by(order_id=order.id, type="overdue", is_resolved=False).first()
                if not exists:
                    alert = Alert(
                        order_id=order.id,
                        type="overdue",
                        priority="high",
                        message=f"Order {order.order_number} delivery target has passed but has remaining unpaid balance of Rs. {track.balance_due:,.2f}.",
                    )
                    db.session.add(alert)
                    alerts_created += 1

            # 2. Check Upcoming Dues (within 3 days)
            elif track.due_date <= upcoming_threshold:
                exists = Alert.query.filter_by(order_id=order.id, type="upcoming_due", is_resolved=False).first()
                if not exists:
                    alert = Alert(
                        order_id=order.id,
                        type="upcoming_due",
                        priority="medium",
                        message=f"Order {order.order_number} delivery date is approaching on {track.due_date} with balance due of Rs. {track.balance_due:,.2f}.",
                    )
                    db.session.add(alert)
                    alerts_created += 1

        db.session.commit()
        return alerts_created
print("Loaded alert_service.")
