import React, { useState } from 'react';
import jsPDF from 'jspdf';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  X,
  Eye,
  ShoppingBag,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Printer,
  Download,
  CreditCard
} from 'lucide-react';
import {
  ServiceRequestItem,
  formatINR,
  formatAUD
} from '../data/herMarketData';

interface MyServicesViewProps {
  requests: ServiceRequestItem[];
  onOpenNewRequest: () => void;
}

export const MyServicesView: React.FC<MyServicesViewProps> = ({
  requests,
  onOpenNewRequest
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'Pending' | 'In Progress' | 'Completed'>('all');
  const [selectedReqDetails, setSelectedReqDetails] = useState<ServiceRequestItem | null>(null);

  const filtered = requests.filter((req) => {
    if (filterTab === 'all') return true;
    return req.status === filterTab;
  });

  const handleDownloadReqPdf = (req: ServiceRequestItem) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const orderRef = req.id || `ORD-${Date.now()}`;
      const clientName = req.customerName || 'Valued Client';
      const clientEmail = req.email || '';
      const orderDate = req.paymentDetails?.paidAt || req.requestDate || new Date().toISOString().split('T')[0];
      const amountPaid = req.paymentDetails?.amountPaid || req.oneTimeTotal || 0;
      const gstAmount = Math.round(amountPaid / 11);
      const subtotal = amountPaid - gstAmount;

      // Color Palette
      const purplePrimary = [74, 21, 75];
      const textDark = [30, 30, 36];
      const textMuted = [110, 110, 120];

      // Top Header Banner
      doc.setFillColor(74, 21, 75);
      doc.rect(0, 0, 210, 38, 'F');

      // Title & Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('HerRise', 18, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('DIGITAL SERVICES MARKETPLACE · TAX INVOICE & RECEIPT', 18, 28);

      // Status Pill
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(155, 14, 38, 11, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PAID IN FULL', 160, 21);

      // Business & Supplier Info
      let y = 50;
      doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('ISSUED BY:', 18, y);

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('HerRise Technologies Pty Ltd', 18, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFontSize(9);
      doc.text('ABN: 84 923 104 592', 18, y + 11);
      doc.text('Sydney, NSW 2000, Australia', 18, y + 16);
      doc.text('orders@herrise.org · https://herrise.org', 18, y + 21);

      // Invoice / Bill To details
      doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('INVOICE DETAILS:', 125, y);

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Tax Invoice #: ${orderRef}`, 125, y + 6);
      doc.text(`Date & Time: ${orderDate}`, 125, y + 11);
      doc.text(`Payment Method: ${req.paymentDetails?.method || 'Card'}`, 125, y + 16);
      doc.text(`Transaction ID: ${req.paymentDetails?.transactionId || orderRef}`, 125, y + 21);

      // Billed To
      y = 80;
      doc.setDrawColor(230, 220, 235);
      doc.setLineWidth(0.5);
      doc.line(18, y, 192, y);

      y += 8;
      doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('BILLED TO (CLIENT):', 18, y);

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(clientName, 18, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      if (req.businessName) {
        doc.text(`Business: ${req.businessName}`, 18, y + 11);
        doc.text(`Email: ${clientEmail}`, 18, y + 16);
        doc.text(`Phone / Location: ${req.phone || 'N/A'} · ${req.location || 'Australia'}`, 18, y + 21);
      } else {
        doc.text(`Email: ${clientEmail}`, 18, y + 11);
        doc.text(`Phone / Location: ${req.phone || 'N/A'} · ${req.location || 'Australia'}`, 18, y + 16);
      }

      // Line Items Table Header
      y += 32;
      doc.setFillColor(245, 240, 247);
      doc.rect(18, y, 174, 9, 'F');
      doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('DESCRIPTION / ITEM', 22, y + 6);
      doc.text('QTY', 125, y + 6);
      doc.text('RATE (AUD)', 145, y + 6);
      doc.text('TOTAL (AUD)', 170, y + 6);

      // Main Package Row
      y += 15;
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(req.selectedPackageName || 'Digital Package', 22, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('Custom Digital Storefront & Brand Identity', 22, y + 5);

      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFontSize(9);
      doc.text('1', 128, y);
      doc.text(`A$${(req.selectedPackagePrice || amountPaid).toLocaleString('en-AU')}`, 145, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`A$${(req.selectedPackagePrice || amountPaid).toLocaleString('en-AU')}`, 170, y);

      // Add-ons
      (req.selectedAddOns || []).forEach((addon) => {
        y += 11;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text(`+ ${addon}`, 22, y);
        doc.text('1', 128, y);
        doc.text('Included', 145, y);
        doc.setFont('helvetica', 'bold');
        doc.text('Included', 170, y);
      });

      // Divider
      y += 10;
      doc.setDrawColor(220, 220, 225);
      doc.line(18, y, 192, y);

      // Totals Box
      y += 8;
      const summaryLeft = 120;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('Subtotal (excl. GST):', summaryLeft, y);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`A$${subtotal.toLocaleString('en-AU')}`, 170, y);

      y += 6;
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('Includes 10% Australian GST:', summaryLeft, y);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(`A$${gstAmount.toLocaleString('en-AU')}`, 170, y);

      y += 8;
      doc.setFillColor(245, 240, 247);
      doc.rect(summaryLeft - 5, y - 5, 77, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(purplePrimary[0], purplePrimary[1], purplePrimary[2]);
      doc.text('Total Paid (AUD):', summaryLeft, y + 3);
      doc.text(`A$${amountPaid.toLocaleString('en-AU')}`, 168, y + 3);

      // Footer
      y = 265;
      doc.setDrawColor(230, 220, 235);
      doc.line(18, y, 192, y);

      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text('Thank you for partnering with HerRise! Official tax invoice compliant with Australian ATO requirements.', 18, y);
      doc.text('HerRise Platform · Dedicated Female Entrepreneur Digital Ecosystem · Sydney NSW Australia', 18, y + 4);

      doc.save(`Tax_Invoice_${orderRef}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF invoice:', err);
    }
  };

  const handlePrintReqReceipt = (req: ServiceRequestItem) => {
    const orderRef = req.id || `ORD-${Date.now()}`;
    const clientName = req.customerName || 'Valued Client';
    const clientEmail = req.email || '';
    const orderDate = req.paymentDetails?.paidAt || req.requestDate || new Date().toISOString().split('T')[0];
    const amountPaid = req.paymentDetails?.amountPaid || req.oneTimeTotal || 0;
    const gstAmount = Math.round(amountPaid / 11);
    const subtotal = amountPaid - gstAmount;

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) {
      alert('Please allow popups to print receipt.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tax Invoice Receipt - ${orderRef}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e1e24;
            background: #fff;
            margin: 0;
            padding: 24px;
          }
          .container {
            max-width: 720px;
            margin: 0 auto;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
          }
          .header {
            background: #4A154B;
            color: #fff;
            padding: 28px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 4px 0 0 0; font-size: 11px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; }
          .badge {
            background: #22c55e;
            color: #fff;
            padding: 6px 14px;
            border-radius: 99px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .body { padding: 32px; }
          .grid { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 20px; font-size: 12px; }
          .grid h4 { margin: 0 0 6px 0; color: #4A154B; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          .grid p { margin: 2px 0; color: #4b5563; }
          .client-box { margin-bottom: 24px; font-size: 12px; background: #faf5fa; padding: 14px 18px; border-radius: 10px; border: 1px solid #ebd9ea; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; font-size: 12px; }
          th { text-align: left; background: #faf5fa; padding: 10px 12px; border-bottom: 2px solid #e9d5eb; color: #4A154B; font-weight: 700; }
          td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
          .text-right { text-align: right; }
          .summary { display: flex; justify-content: flex-end; margin-top: 10px; }
          .summary-table { width: 300px; font-size: 12px; }
          .summary-table td { padding: 6px 0; border: none; }
          .total-row { font-size: 17px; font-weight: 800; color: #4A154B; border-top: 2px solid #e9d5eb; padding-top: 10px; }
          .footer {
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
          }
          @media print {
            body { padding: 0; }
            .container { border: none; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 18px; text-align: right;">
          <button onclick="window.print()" style="background:#4A154B;color:#fff;border:none;padding:10px 22px;border-radius:10px;font-weight:bold;cursor:pointer;font-size:13px;">
            🖨️ Print Tax Invoice / Save as PDF
          </button>
        </div>
        <div class="container">
          <div class="header">
            <div>
              <h1>HerRise</h1>
              <p>TAX INVOICE & OFFICIAL PAYMENT RECEIPT</p>
            </div>
            <div class="badge">PAID IN FULL</div>
          </div>
          <div class="body">
            <div class="grid">
              <div>
                <h4>Issued By</h4>
                <p><strong>HerRise Technologies Pty Ltd</strong></p>
                <p>ABN: 84 923 104 592</p>
                <p>Sydney, NSW Australia</p>
                <p>orders@herrise.org</p>
              </div>
              <div style="text-align: right;">
                <h4>Invoice Details</h4>
                <p><strong>Tax Invoice #:</strong> ${orderRef}</p>
                <p><strong>Date & Time:</strong> ${orderDate}</p>
                <p><strong>Payment Method:</strong> ${req.paymentDetails?.method || 'Card'}</p>
                <p><strong>Transaction Ref:</strong> ${req.paymentDetails?.transactionId || orderRef}</p>
              </div>
            </div>

            <div class="client-box">
              <h4 style="margin: 0 0 6px 0; color: #4A154B; font-size: 11px;">Billed To (Client)</h4>
              <p style="margin: 2px 0;"><strong>${clientName}</strong> ${req.businessName ? `· ${req.businessName}` : ''}</p>
              <p style="margin: 2px 0; color: #6b7280;">Email: ${clientEmail} · Phone: ${req.phone || 'N/A'} · ${req.location || 'Australia'}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="width: 50px; text-align: center;">Qty</th>
                  <th class="text-right" style="width: 110px;">Price (AUD)</th>
                  <th class="text-right" style="width: 110px;">Total (AUD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${req.selectedPackageName || 'Digital Package'}</strong><br>
                    <span style="font-size: 11px; color: #6b7280;">Complete Digital Storefront & Service Onboarding</span>
                  </td>
                  <td style="text-align: center;">1</td>
                  <td class="text-right">A$${(req.selectedPackagePrice || amountPaid).toLocaleString('en-AU')}</td>
                  <td class="text-right"><strong>A$${(req.selectedPackagePrice || amountPaid).toLocaleString('en-AU')}</strong></td>
                </tr>
                ${(req.selectedAddOns || [])
                  .map(
                    (a) => `
                  <tr>
                    <td>+ ${a}</td>
                    <td style="text-align: center;">1</td>
                    <td class="text-right">Included</td>
                    <td class="text-right"><strong>Included</strong></td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>

            <div class="summary">
              <table class="summary-table">
                <tr>
                  <td style="color: #6b7280;">Subtotal (excl. GST):</td>
                  <td class="text-right">A$${subtotal.toLocaleString('en-AU')}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280;">Includes 10% Australian GST:</td>
                  <td class="text-right">A$${gstAmount.toLocaleString('en-AU')}</td>
                </tr>
                <tr class="total-row">
                  <td>Total Paid:</td>
                  <td class="text-right">A$${amountPaid.toLocaleString('en-AU')}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>Thank you for partnering with HerRise. Official Tax Invoice compliant with Australian Taxation Office (ATO) requirements.</p>
              <p>HerRise • ABN 84 923 104 592 • Sydney, NSW Australia • orders@herrise.org</p>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
  };

  const getStatusBadge = (status: ServiceRequestItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-[#4A154B]">
            <Clock className="w-3 h-3 text-[#4A154B]" />
            In Progress
          </span>
        );
      case 'Quotation Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
            <FileText className="w-3 h-3 text-blue-600" />
            Quotation Sent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#4A154B] mb-1.5">
            <Sparkles className="w-3 h-3 text-[#4A154B]" />
            Client Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            My Purchased & Requested Services
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track project deliverables, scope quotations, and status of your digital engagements.
          </p>
        </div>

        <button
          onClick={onOpenNewRequest}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#4A154B] hover:bg-[#350c36] shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          + Request New Service
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-100 pb-3">
        {(['all', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => {
          const count =
            tab === 'all'
              ? requests.length
              : requests.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterTab === tab
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-white border border-purple-100 text-gray-600 hover:bg-purple-50'
              }`}
            >
              <span>{tab === 'all' ? 'All Engagements' : tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#4A154B] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No services found in this category</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You don't have any {filterTab === 'all' ? '' : filterTab.toLowerCase()} service requests yet.
          </p>
          <button
            onClick={onOpenNewRequest}
            className="text-xs font-bold text-[#4A154B] hover:underline cursor-pointer"
          >
            Explore Available Packages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-purple-100/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-purple-50">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400">ID: {req.id}</span>
                    <h3 className="text-sm font-extrabold text-gray-900 mt-0.5 line-clamp-1">
                      {req.businessName}
                    </h3>
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                <div className="mt-3.5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                      Package
                    </span>
                    <span className="font-bold text-[#4A154B]">
                      {req.selectedPackageName || 'Custom Service Bundle'}
                    </span>
                  </div>

                  {req.servicesRequired.length > 0 && (
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                        Included Deliverables
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {req.servicesRequired.map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-purple-50 text-[#4A154B] px-2 py-0.5 rounded-md"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px] pt-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Requested on: {req.requestDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-purple-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400">Estimated Scope</span>
                  <div className="text-sm font-black text-[#4A154B]">
                    {formatINR(req.oneTimeTotal)}
                    {req.monthlyTotal > 0 && (
                      <span className="text-[10px] text-amber-800 ml-1">
                        +{formatINR(req.monthlyTotal)}/mo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {req.paymentDetails?.status === 'Paid' && (
                    <button
                      type="button"
                      onClick={() => handleDownloadReqPdf(req)}
                      title="Download Tax Invoice PDF"
                      className="p-1.5 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {req.paymentDetails?.status === 'Paid' && (
                    <button
                      type="button"
                      onClick={() => handlePrintReqReceipt(req)}
                      title="Print Tax Invoice"
                      className="p-1.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedReqDetails(req)}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold text-gray-700 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedReqDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedReqDetails(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-gray-400">
                  Request Ref: {selectedReqDetails.id}
                </span>
                <h3 className="text-base font-black text-gray-900 mt-0.5">
                  {selectedReqDetails.businessName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReqDetails(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/70">
                <span className="font-bold text-gray-700">Current Status:</span>
                {getStatusBadge(selectedReqDetails.status)}
              </div>

              {selectedReqDetails.paymentDetails?.status === 'Paid' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      Official Tax Invoice & Receipt
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">
                      {selectedReqDetails.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-950 font-bold">
                    <span>Total Paid (AUD):</span>
                    <span className="text-sm text-[#4A154B]">{formatAUD(selectedReqDetails.paymentDetails.amountPaid || selectedReqDetails.oneTimeTotal)}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadReqPdf(selectedReqDetails)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#4A154B] text-white font-bold text-[11px] hover:bg-[#350c36] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrintReqReceipt(selectedReqDetails)}
                      className="flex-1 py-2 px-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-[11px] hover:bg-gray-100 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-50 text-gray-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Contact</span>
                  <strong>{selectedReqDetails.customerName}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Phone</span>
                  <span>{selectedReqDetails.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Category</span>
                  <span>{selectedReqDetails.category}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Location</span>
                  <span>{selectedReqDetails.location}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-800 block mb-1">Selected Package & Services</span>
                <div className="p-3 rounded-xl border border-purple-100 space-y-1">
                  <div className="font-bold text-[#4A154B]">
                    {selectedReqDetails.selectedPackageName || 'Custom Package'}
                  </div>
                  {selectedReqDetails.servicesRequired.length > 0 && (
                    <p className="text-gray-600 text-[11px]">
                      Services: {selectedReqDetails.servicesRequired.join(', ')}
                    </p>
                  )}
                  {selectedReqDetails.selectedAddOns.length > 0 && (
                    <p className="text-amber-800 text-[11px]">
                      Add-ons: {selectedReqDetails.selectedAddOns.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {selectedReqDetails.businessDescription && (
                <div>
                  <span className="font-bold text-gray-800 block mb-1">Project Description</span>
                  <p className="p-3 rounded-xl bg-gray-50 text-gray-600 leading-relaxed text-[11px]">
                    {selectedReqDetails.businessDescription}
                  </p>
                </div>
              )}

              {selectedReqDetails.additionalRequirements && (
                <div>
                  <span className="font-bold text-gray-800 block mb-1">Special Notes / References</span>
                  <p className="p-3 rounded-xl bg-gray-50 text-gray-600 leading-relaxed text-[11px]">
                    {selectedReqDetails.additionalRequirements}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-purple-100 flex justify-end">
              <button
                onClick={() => setSelectedReqDetails(null)}
                className="py-2 px-5 rounded-xl text-xs font-bold bg-[#4A154B] text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
