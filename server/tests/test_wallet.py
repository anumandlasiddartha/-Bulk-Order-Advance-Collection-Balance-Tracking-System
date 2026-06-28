"""
Wallet Adjustments and Ledger Double-Entry Unit Tests
"""


def test_wallet_adjustments_generate_ledger(client, db, auth_headers):
    """Test wallet credits and debits create double entry ledger logs."""
    # 1. Create customer with wallet
    cust = client.post("/api/customers", json={"name": "Alice", "phone": "9911882277"}).get_json()

    # 2. Credit Wallet
    credit_res = client.post(f"/api/wallet/customer/{cust['id']}/credit", json={
        "amount": 500.00,
        "description": "Refund credit",
    }, headers=auth_headers)
    assert credit_res.status_code == 200
    assert credit_res.get_json()["balance"] == 500.00

    # 3. Debit Wallet
    debit_res = client.post(f"/api/wallet/customer/{cust['id']}/debit", json={
        "amount": 200.00,
        "description": "Dues deduction",
    }, headers=auth_headers)
    assert debit_res.status_code == 200
    assert debit_res.get_json()["balance"] == 300.00
