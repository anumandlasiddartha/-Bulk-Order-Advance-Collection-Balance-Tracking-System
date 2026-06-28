/**
 * Cakes and Crunches — Export Reports Center
 */

import { useState } from "react";
import { RiFileExcelLine, RiFilePdfLine, RiDownloadLine } from "react-icons/ri";
import toast from "react-hot-toast";

import { reportsApi } from "../../api/reports.api";

export default function ReportsPage() {
  const [csvType, setCsvType] = useState("orders");
  const [downloading, setDownloading] = useState(false);

  const handleCsvDownload = async () => {
    try {
      setDownloading(true);
      const data = await reportsApi.exportCsv(csvType);
      
      // Create download link element in browser DOM
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Report-${csvType}-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("CSV report downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate CSV download.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePdfDownload = async () => {
    try {
      setDownloading(true);
      const data = await reportsApi.exportPdf();
      
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Executive-Financial-Summary-${new Date().toISOString().split("T")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Executive PDF summary downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF download.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary">Reports Center</h1>
        <p className="text-text-secondary text-sm">Download accounting reports, orders registries, and executive summaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV box */}
        <div className="glass-card p-6 flex flex-col gap-6 text-left">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <RiFileExcelLine className="w-6 h-6 text-success" /> CSV Spreadsheet Export
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Download raw database table records (Orders, Payments history, Customer details) compiled into standard CSV files suitable for MS Excel or Google Sheets.
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-muted">Select Dataset</label>
            <select
              value={csvType}
              onChange={(e) => setCsvType(e.target.value)}
              className="input"
            >
              <option value="orders">Orders Registry</option>
              <option value="payments">Collections Registry</option>
              <option value="customers">Customers Registry</option>
            </select>
          </div>

          <button
            onClick={handleCsvDownload}
            disabled={downloading}
            className="btn-primary flex items-center gap-2 cursor-pointer justify-center"
          >
            <RiDownloadLine className="w-5 h-5" /> {downloading ? "Downloading..." : "Export CSV"}
          </button>
        </div>

        {/* PDF box */}
        <div className="glass-card p-6 flex flex-col gap-6 text-left justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <RiFilePdfLine className="w-6 h-6 text-danger" /> PDF Summary Reports
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Compile a complete financial operations executive summary showing total dues, advance ratios, overdue invoice tracks, and active collections aggregates formatted into a formatted print-ready PDF.
            </p>
          </div>

          <button
            onClick={handlePdfDownload}
            disabled={downloading}
            className="btn-primary flex items-center gap-2 cursor-pointer justify-center"
          >
            <RiDownloadLine className="w-5 h-5" /> {downloading ? "Downloading..." : "Export PDF Summary"}
          </button>
        </div>
      </div>
    </div>
  );
}
