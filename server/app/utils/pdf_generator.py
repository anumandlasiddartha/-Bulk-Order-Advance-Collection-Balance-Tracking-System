"""
Cakes and Crunches — PDF Generator

Generates professional PDF invoices and receipts using ReportLab.
"""

import io
from datetime import datetime, timezone

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer


def generate_invoice_pdf(order_data: dict, payments: list) -> bytes:
    """
    Generate a professional PDF invoice for an order.

    Args:
        order_data: Dict with order details including customer info.
        payments: List of payment dicts associated with this order.

    Returns:
        PDF file content as bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=20 * mm, bottomMargin=20 * mm)
    styles = getSampleStyleSheet()
    elements = []

    # Title style
    title_style = ParagraphStyle(
        "InvoiceTitle",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=colors.HexColor("#7C3AED"),
        spaceAfter=10,
    )

    # Company header
    elements.append(Paragraph("🍰 Cakes and Crunches", title_style))
    elements.append(Paragraph("Bulk Order Invoice", styles["Heading2"]))
    elements.append(Spacer(1, 10 * mm))

    # Invoice details
    invoice_data = [
        ["Invoice Number:", order_data.get("invoice_number", "N/A")],
        ["Order Number:", order_data.get("order_number", "N/A")],
        ["Date:", datetime.now(timezone.utc).strftime("%d %B %Y")],
        ["Customer:", order_data.get("customer_name", "N/A")],
        ["Phone:", order_data.get("customer_phone", "N/A")],
    ]

    invoice_table = Table(invoice_data, colWidths=[120, 300])
    invoice_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(invoice_table)
    elements.append(Spacer(1, 10 * mm))

    # Order items table
    items_header = ["#", "Description", "Quantity", "Unit Price", "Total"]
    items_data = [items_header]

    items = order_data.get("items", [{"description": order_data.get("cake_type", "Custom Cake"), "quantity": 1, "unit_price": order_data.get("total_amount", 0)}])
    for i, item in enumerate(items, 1):
        total = item.get("quantity", 1) * item.get("unit_price", 0)
        items_data.append([
            str(i),
            item.get("description", ""),
            str(item.get("quantity", 1)),
            f"₹{item.get('unit_price', 0):,.2f}",
            f"₹{total:,.2f}",
        ])

    items_table = Table(items_data, colWidths=[30, 200, 60, 80, 80])
    items_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7C3AED")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("ALIGN", (2, 0), (-1, -1), "CENTER"),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 8 * mm))

    # Summary
    total_amount = order_data.get("total_amount", 0)
    advance_paid = order_data.get("advance_amount", 0)
    balance_due = total_amount - advance_paid

    summary_data = [
        ["", "", "Total Amount:", f"₹{total_amount:,.2f}"],
        ["", "", "Advance Paid:", f"₹{advance_paid:,.2f}"],
        ["", "", "Balance Due:", f"₹{balance_due:,.2f}"],
    ]

    summary_table = Table(summary_data, colWidths=[150, 100, 100, 100])
    summary_table.setStyle(TableStyle([
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("LINEABOVE", (2, -1), (-1, -1), 1, colors.HexColor("#7C3AED")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 15 * mm))

    # Footer
    elements.append(Paragraph(
        "Thank you for choosing Cakes and Crunches!",
        ParagraphStyle("Footer", parent=styles["Normal"], textColor=colors.grey, fontSize=9),
    ))

    doc.build(elements)
    return buffer.getvalue()
