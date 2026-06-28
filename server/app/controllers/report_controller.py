"""
Report Controllers mapping REST API endpoints, CSV exports, and PDF generation.
"""

from flask import Blueprint, request, send_file
import io
import csv
from datetime import datetime, timezone
from app.models.order import Order
from app.models.payment import Payment
from app.models.customer import Customer
from app.utils.pdf_generator import generate_invoice_pdf

report_bp = Blueprint("reports", __name__)


@report_bp.route("/export/csv", methods=["GET"])
def export_csv():
    """
    Generate CSV file for download.
    Supports types: 'orders', 'payments', 'customers'.
    """
    report_type = request.args.get("type", "orders")
    
    output = io.StringIO()
    writer = csv.writer(output)

    if report_type == "orders":
        orders = Order.query.all()
        writer.writerow(["Order ID", "Order Number", "Customer ID", "Cake Type", "Order Value", "Advance", "Dues", "Status"])
        for o in orders:
            writer.writerow([o.id, o.order_number, o.customer_id, o.cake_type, float(o.order_value), float(o.advance_amount), float(o.remaining_balance), o.payment_status])
            
    elif report_type == "payments":
        payments = Payment.query.all()
        writer.writerow(["Payment ID", "Receipt Number", "Order ID", "Amount", "Method", "Date"])
        for p in payments:
            writer.writerow([p.id, p.receipt_number, p.order_id, float(p.amount), p.payment_method, p.payment_date.isoformat()])
            
    else:  # customers
        customers = Customer.query.all()
        writer.writerow(["Customer ID", "Name", "Email", "Phone", "Registered Date"])
        for c in customers:
            writer.writerow([c.id, c.name, c.email or "", c.phone, c.created_at.isoformat()])

    # Stream CSV response
    mem_file = io.BytesIO()
    mem_file.write(output.getvalue().encode("utf-8"))
    mem_file.seek(0)
    output.close()

    return send_file(
        mem_file,
        mimetype="text/csv",
        as_attachment=True,
        download_name=f"Report-{report_type}-{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"
    )


@report_bp.route("/export/pdf", methods=["GET"])
def export_pdf():
    """
    Generate A4 Executive Financial Summary PDF report.
    For simplicity, uses the general PDF builder mapping aggregate stats.
    """
    all_orders = Order.query.all()
    total_val = sum(float(o.order_value) for o in all_orders)
    total_adv = sum(float(o.advance_amount) for o in all_orders)
    
    order_data = {
        "invoice_number": "EXEC-SUMMARY",
        "order_number": "ALL-OPERATIONS",
        "customer_name": "Executive Management Board",
        "customer_phone": "N/A",
        "cake_type": "Bakery Financial Aggregates",
        "total_amount": total_val,
        "advance_amount": total_adv,
    }

    pdf_bytes = generate_invoice_pdf(order_data, [])
    
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"Executive-Financial-Summary-{datetime.now(timezone.utc).strftime('%Y%m%d')}.pdf"
    )
