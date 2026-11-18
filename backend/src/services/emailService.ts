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
  const cleanPass = smtpPass ? smtpPass.replace(/\s+/g, '') : '';

  if (smtpUser && cleanPass) {
    if (smtpHost === 'smtp.gmail.com' || smtpUser.includes('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: cleanPass
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000
      });
    }

    return nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: cleanPass
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000
    });
  }

  // Check for direct Gmail shorthand
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '')
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000
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
 * Dispatch email via Brevo (Sendinblue) HTTP API (HTTPS Port 443 - Works on Render Free Tier)
 */
async function sendViaBrevoHttp(
  params: ReceiptEmailParams,
  apiKey: string,
  senderEmail: string,
  htmlContent: string,
  textContent: string,
  subject: string
) {
  const cleanKey = apiKey.trim();
  const fromEmail = senderEmail.includes('@') ? senderEmail.trim() : 'orders@herrise.org';

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': cleanKey
    },
    body: JSON.stringify({
      sender: {
        name: 'HerRise Marketplace',
        email: fromEmail
      },
      to: [
        {
          email: params.toEmail.trim(),
          name: params.customerName || 'Valued Customer'
        }
      ],
      subject,
      htmlContent,
      textContent
    })
  });

  const body: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || body?.error || `Brevo HTTP error ${res.status}`);
  }

  return {
    success: true,
    messageId: body.messageId || `brevo_${Date.now()}`
  };
}

/**
 * Dispatch email via Resend HTTP API (HTTPS Port 443 - Works on Render Free Tier)
 */
async function sendViaResendHttp(
  params: ReceiptEmailParams,
  apiKey: string,
  senderEmail: string,
  htmlContent: string,
  textContent: string,
  subject: string
) {
  const cleanKey = apiKey.trim();
  const from = process.env.RESEND_FROM || 'HerRise Marketplace <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cleanKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [params.toEmail.trim()],
      subject,
      html: htmlContent,
      text: textContent
    })
  });

  const body: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || body?.error || `Resend HTTP error ${res.status}`);
  }

  return {
    success: true,
    messageId: body.id || `resend_${Date.now()}`
  };
}

/**
 * Dispatch email via SendGrid HTTP API (HTTPS Port 443 - Works on Render Free Tier)
 */
async function sendViaSendGridHttp(
  params: ReceiptEmailParams,
  apiKey: string,
  senderEmail: string,
  htmlContent: string,
  textContent: string,
  subject: string
) {
  const cleanKey = apiKey.trim();
  const fromEmail = senderEmail.includes('@') ? senderEmail.trim() : 'orders@herrise.org';

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cleanKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: params.toEmail.trim(), name: params.customerName || 'Valued Customer' }]
        }
      ],
      from: {
        email: fromEmail,
        name: 'HerRise Marketplace'
      },
      subject,
      content: [
        { type: 'text/plain', value: textContent },
        { type: 'text/html', value: htmlContent }
      ]
    })
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`SendGrid HTTP error ${res.status}: ${errorText}`);
  }

  return {
    success: true,
    messageId: `sendgrid_${Date.now()}`
  };
}

/**
 * Send Payment Confirmation & Tax Invoice Receipt Email
 */
export async function sendReceiptEmail(params: ReceiptEmailParams): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
  try {
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || 'ishiiiii43@gmail.com';
    const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    const subject = `🌸 Thank You for Your Order! Receipt for ${params.packageName} [#${params.orderId}]`;
    const gstAmount = Math.round(params.amountPaid / 11);
    const subtotal = params.amountPaid - gstAmount;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt & Thank You - HerRise</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5fa; margin: 0; padding: 20px; color: #1e1e24; }
        .receipt-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(74, 21, 75, 0.08); border: 1px solid #f0e6f0; }
        .header { background: linear-gradient(135deg, #4A154B 0%, #350c36 100%); padding: 36px 28px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0 0; font-size: 14px; color: #e9d5eb; }
        .badge { display: inline-block; padding: 6px 16px; background: rgba(255,255,255,0.2); border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .content { padding: 32px; }
        .thank-you-box { background: #faf4fa; border: 1px solid #ebd9ea; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; }
        .thank-you-box h2 { margin: 0 0 6px 0; font-size: 16px; color: #4A154B; font-weight: 800; }
        .thank-you-box p { margin: 0; font-size: 13px; color: #555; line-height: 1.5; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 20px; font-size: 13px; }
        .table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #f0e6f0; color: #666; font-size: 11px; text-transform: uppercase; }
        .table td { padding: 12px 0; border-bottom: 1px solid #f7f1f7; }
        .table td.amount { text-align: right; font-weight: 700; color: #4A154B; }
        .total-row { font-size: 16px; font-weight: 800; color: #4A154B; border-top: 2px solid #4A154B !important; }
        .footer { background: #faf9fd; padding: 24px 30px; text-align: center; font-size: 11px; color: #7a7582; border-top: 1px solid #f0e6f0; }
        .next-steps { background: #fdfaf7; border-left: 4px solid #4A154B; padding: 16px; border-radius: 0 12px 12px 0; margin-top: 24px; font-size: 12px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <div class="badge">Official Purchase Receipt</div>
          <h1>Thank You for Your Order! 🌸</h1>
          <p>Your payment has been successfully confirmed and processed.</p>
        </div>

        <div class="content">
          <div class="thank-you-box">
            <h2>🎉 Thank You, ${params.customerName}!</h2>
            <p>
              We truly appreciate your purchase and your partnership with <strong>HerRise</strong>. Your order for <strong>${params.packageName}</strong> is now confirmed. Below is your official itemized receipt and invoice for your business records.
            </p>
          </div>

          <table class="table">
            <tr>
              <td><strong>Invoice / Order ID:</strong></td>
              <td style="text-align: right; font-family: monospace; font-weight: bold; color: #4A154B;">${params.orderId}</td>
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
            <tr>
              <td><strong>Payment Status:</strong></td>
              <td style="text-align: right; color: #059669; font-weight: bold;">✔ Verified & Paid</td>
            </tr>
            ${params.businessName ? `<tr><td><strong>Business Storefront:</strong></td><td style="text-align: right;">${params.businessName}</td></tr>` : ''}
          </table>

          <table class="table">
            <thead>
              <tr>
                <th>Item / Service</th>
                <th style="text-align: right;">Amount</th>
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
                <td style="color: #666;">Subtotal:</td>
                <td style="text-align: right; color: #666;">A$${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #666;">Includes GST / Tax:</td>
                <td style="text-align: right; color: #666;">A$${gstAmount.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td style="padding-top: 14px;">Total Paid:</td>
                <td style="text-align: right; padding-top: 14px; font-size: 18px; color: #4A154B;">A$${params.amountPaid.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="next-steps">
            <strong>🚀 What happens next?</strong><br>
            Our dedicated project manager is reviewing your requirements. You can track all updates, download your invoices, and request assets anytime under your <strong>HerMarket &gt; My Services</strong> portal.
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px 0;"><strong>HerRise Digital Services</strong> • Empowering Women Entrepreneurs</p>
          <p style="margin: 0;">Have any questions about this receipt? Reply directly to this email for instant support.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const textContent = `
Thank You for Your Order! 🌸

Hi ${params.customerName},

Thank you for your purchase with HerRise! We are thrilled to confirm that your payment for ${params.packageName} has been received and verified.

OFFICIAL PURCHASE RECEIPT
-------------------------------------------
Order ID: ${params.orderId}
Transaction ID: ${params.transactionId}
Payment Method: ${params.paymentMethod}
Date: ${params.paidAt}
Status: Verified & Paid

ORDER SUMMARY
-------------------------------------------
Item: ${params.packageName}
Total Paid: A$${params.amountPaid.toLocaleString()}
${params.businessName ? `Business: ${params.businessName}\n` : ''}

You can track all updates and download your tax invoices anytime under HerMarket > My Services.

Warm regards,
The HerRise Team
`;

    // 1. Try Brevo HTTP API (Port 443 HTTPS - Works on Render Free Tier)
    if (brevoApiKey) {
      console.log('[EmailService] Dispatching receipt via Brevo HTTP API (Port 443)...');
      return await sendViaBrevoHttp(params, brevoApiKey, smtpUser, htmlContent, textContent, subject);
    }

    // 2. Try Resend HTTP API (Port 443 HTTPS - Works on Render Free Tier)
    if (resendApiKey) {
      console.log('[EmailService] Dispatching receipt via Resend HTTP API (Port 443)...');
      return await sendViaResendHttp(params, resendApiKey, smtpUser, htmlContent, textContent, subject);
    }

    // 3. Try SendGrid HTTP API (Port 443 HTTPS)
    if (sendgridApiKey) {
      console.log('[EmailService] Dispatching receipt via SendGrid HTTP API (Port 443)...');
      return await sendViaSendGridHttp(params, sendgridApiKey, smtpUser, htmlContent, textContent, subject);
    }

    // 4. Fallback to standard SMTP via Nodemailer
    const fromAddress = smtpUser
      ? `"HerRise Marketplace" <${smtpUser}>`
      : (process.env.SMTP_FROM || process.env.EMAIL_FROM || '"HerRise Marketplace" <orders@herrise.org>');

    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: fromAddress,
      to: params.toEmail,
      subject,
      text: textContent,
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
    const errorMsg = error?.message || 'Failed to dispatch receipt email';
    console.error('[EmailService Error]:', errorMsg);

    const isConnectionTimeout = errorMsg.toLowerCase().includes('timeout') || errorMsg.includes('ETIMEDOUT') || errorMsg.includes('ECONNREFUSED');
    const isRenderEnv = Boolean(process.env.RENDER || process.env.IS_RENDER || process.env.RENDER_SERVICE_ID);

    if (isConnectionTimeout && isRenderEnv) {
      const guidance = 'Render Free Tier blocks outbound SMTP ports 25, 465, and 587. Please add BREVO_API_KEY (from free brevo.com) or RESEND_API_KEY in your Render Environment Variables to send emails over HTTPS Port 443.';
      console.warn(`[EmailService Warning]: ${guidance}`);
      return {
        success: false,
        error: guidance
      };
    }

    return {
      success: false,
      error: errorMsg
    };
  }
}
