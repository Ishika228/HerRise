import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

interface ReceiptEmailParams {
  toEmail: string;
  customerName: string;
  businessName?: string;
  orderId: string;
  transactionId: string;
  packageName: string;
  packagePrice: number;
  addOns?: string[];
  amountPaid: number;
  monthlyAmount?: number;
  paymentMethod: string;
  paidAt: string;
}

/**
 * Build or reuse an SMTP transporter
 */
async function getTransporter() {
  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  }

  // Check for direct Gmail shorthand
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  // Create an automatic test transporter using Ethereal if no custom credentials are provided
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.warn('[EmailService] Could not generate test account. Falling back to json transport:', err);
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }
}

/**
 * Send Payment Confirmation & Tax Invoice Receipt Email
 */
export async function sendReceiptEmail(params: ReceiptEmailParams): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || '"HerRise Digital Market" <orders@herrise.org>';

    const gstAmount = Math.round(params.amountPaid / 11);
    const subtotal = params.amountPaid - gstAmount;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt - HerRise Digital Market</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5fa; margin: 0; padding: 20px; color: #1e1e24; }
        .receipt-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(74, 21, 75, 0.08); border: 1px solid #f0e6f0; }
        .header { background: linear-gradient(135deg, #4A154B 0%, #350c36 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; font-size: 13px; color: #e9d5eb; }
        .badge { display: inline-block; padding: 5px 14px; background: rgba(255,255,255,0.2); border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .content { padding: 30px; }
        .order-badge { background: #faf4fa; border: 1px solid #ebd9ea; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; display: flex; justify-content: space-between; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 20px; font-size: 13px; }
        .table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #f0e6f0; color: #666; font-size: 11px; text-transform: uppercase; }
        .table td { padding: 12px 0; border-bottom: 1px solid #f7f1f7; }
        .table td.amount { text-align: right; font-weight: 700; color: #4A154B; }
        .total-row { font-size: 16px; font-weight: 800; color: #4A154B; border-top: 2px solid #4A154B !important; }
        .footer { background: #faf9fd; padding: 20px 30px; text-align: center; font-size: 11px; color: #7a7582; border-top: 1px solid #f0e6f0; }
        .next-steps { background: #fdfaf7; border-left: 4px solid #4A154B; padding: 14px; border-radius: 0 10px 10px 0; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <div class="badge">Official Tax Invoice & Receipt</div>
          <h1>Payment Confirmed! 🌸</h1>
          <p>Thank you for partnering with HerRise Digital Services</p>
        </div>

        <div class="content">
          <p style="font-size: 14px; margin-top: 0;">Hi <strong>${params.customerName}</strong>,</p>
          <p style="font-size: 13px; color: #555; line-height: 1.5;">
            Your payment for <strong>${params.packageName}</strong> has been successfully processed and verified. Below is your official tax receipt for your business records.
          </p>

          <table class="table">
            <tr>
              <td><strong>Invoice / Order ID:</strong></td>
              <td style="text-align: right; font-family: monospace;">${params.orderId}</td>
            </tr>
            <tr>
              <td><strong>Transaction Reference:</strong></td>
              <td style="text-align: right; font-family: monospace;">${params.transactionId}</td>
            </tr>
            <tr>
              <td><strong>Payment Method:</strong></td>
              <td style="text-align: right;">${params.paymentMethod}</td>
            </tr>
            <tr>
              <td><strong>Date & Time:</strong></td>
              <td style="text-align: right;">${params.paidAt}</td>
            </tr>
            ${params.businessName ? `<tr><td><strong>Business Storefront:</strong></td><td style="text-align: right;">${params.businessName}</td></tr>` : ''}
          </table>

          <table class="table">
            <thead>
              <tr>
                <th>Service Item</th>
                <th style="text-align: right;">Amount (AUD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${params.packageName}</strong><br><span style="font-size: 11px; color: #777;">Digital Architecture & Storefront Build</span></td>
                <td class="amount">A$${params.packagePrice.toLocaleString()}</td>
              </tr>
              ${(params.addOns || []).map((addon) => `
                <tr>
                  <td>• ${addon}</td>
                  <td class="amount">Included</td>
                </tr>
              `).join('')}
              <tr>
                <td style="color: #666;">Subtotal (excl. GST):</td>
                <td style="text-align: right; color: #666;">A$${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #666;">Includes 10% Australian GST:</td>
                <td style="text-align: right; color: #666;">A$${gstAmount.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td style="padding-top: 14px;">Total Paid (AUD):</td>
                <td style="text-align: right; padding-top: 14px; font-size: 18px; color: #4A154B;">A$${params.amountPaid.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="next-steps">
            <strong>🚀 What happens next?</strong><br>
            Our dedicated project manager is reviewing your requirements. You can track all updates, request assets, and view milestone delivery under your <strong>HerMarket &gt; My Services</strong> portal.
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px 0;">HerRise Platform • ABN 84 923 104 592 • Sydney, NSW Australia</p>
          <p style="margin: 0;">Questions? Reply directly to this email or reach us on WhatsApp Support.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: params.toEmail,
      subject: `🌸 Payment Receipt: ${params.packageName} [Invoice #${params.orderId}]`,
      html: htmlContent
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.log(`[EmailService] Receipt sent to ${params.toEmail}. Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[EmailService] Preview in Ethereal: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl
    };
  } catch (error: any) {
    console.error('[EmailService Error]:', error);
    return {
      success: false,
      error: error.message || 'Failed to dispatch receipt email'
    };
  }
}
