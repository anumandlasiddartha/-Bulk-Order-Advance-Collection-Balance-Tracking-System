"""
Payment installment Dues Collection Unit Tests
"""

from datetime import date, timedelta


def test_collect_payment_recalculates_balance(client, db, auth_headers):
    """Test logging payment installments updates order balance due values."""
    # 1. Create customer
    cust = client.post("/api/customers", json={"name": "Bob", "phone": "9922883344"}).get_json()
    
    # 2. Place Order
    order = client.post("/api/orders", json={
        "customer_id": cust["id"],
        "cake_type": "birthday",
        "event_type": "birthday",
        "delivery_date": (date.today() + timedelta(days=5)).isoformat(),
        "order_value": 1000.00,
        "advance_amount": 200.00,
    }, headers=auth_headers).get_json()

    # 3. Collect installment
    collect_res = client.post("/api/payments", json={
        "order_id": order["id"],
        "amount": 500.00,
        "payment_method": "cash",
    }, headers=auth_headers)
    assert collect_res.status_code == 201

    # 4. Check order updated balance
    updated_order = client.get(f"/api/orders/{order['id']}", headers=auth_headers).get_json()
    assert updated_order["remaining_balance"] == 300.00
    assert updated_order["payment_status"] == "partial"
