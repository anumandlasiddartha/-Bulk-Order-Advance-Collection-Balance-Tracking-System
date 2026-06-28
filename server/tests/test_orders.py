"""
Order Calculations and Alerts Triggers Unit Tests
"""

import json
from datetime import date, timedelta


def test_create_order_balance_calculation(client, db, auth_headers):
    """Test dynamic remaining balance calculations and alert hooks."""
    # 1. Create a Customer first
    cust_res = client.post("/api/customers", json={
        "name": "Hyatt Hotels",
        "phone": "9988776655",
        "email": "catering@hyatt.com",
    })
    assert cust_res.status_code == 201
    cust_id = cust_res.get_json()["id"]

    # 2. Place Order
    order_res = client.post("/api/orders", json={
        "customer_id": cust_id,
        "cake_type": "wedding",
        "event_type": "wedding",
        "delivery_date": (date.today() + timedelta(days=10)).isoformat(),
        "order_value": 50000.00,
        "advance_amount": 10000.00,
        "notes": "4 tiers gold frosting",
    }, headers=auth_headers)
    
    assert order_res.status_code == 201
    order_data = order_res.get_json()
    assert order_data["remaining_balance"] == 40000.00
    assert order_data["payment_status"] == "partial"
