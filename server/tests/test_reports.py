"""
Reports and Exports Stream Formatting Unit Tests
"""


def test_csv_export_format(client, db, auth_headers):
    """Test CSV report generation returns correct text headers."""
    res = client.get("/api/reports/export/csv?type=orders", headers=auth_headers)
    assert res.status_code == 200
    assert res.mimetype == "text/csv"
    assert b"Order Number" in res.data


def test_pdf_export_format(client, db, auth_headers):
    """Test PDF executive summary download stream is application/pdf."""
    res = client.get("/api/reports/export/pdf", headers=auth_headers)
    assert res.status_code == 200
    assert res.mimetype == "application/pdf"
