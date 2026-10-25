/**
 * NextStep AI — Secure Email Delivery Service
 * Manages transactional email delivery for email verification and password resets.
 * Supports production SMTP relays and development preview fallback with Ethereal/console logging.
 */

const nodemailer = require('nodemailer');

let transporter = null;
let devEmailLog = []; // In-memory development verification link cache for testing & inspection

/**
 * Initializes and returns a cached nodemailer transporter
 */
async function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // 1. Production / Configured SMTP Relay
  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass }
    });
    console.log(`[EmailService] Configured with live SMTP server: ${host}`);
    return transporter;
  }

  // 2. Development / Fallback Mode (No live SMTP configured in .env yet)
  console.log('[EmailService] SMTP credentials not configured in .env. Initializing development email preview logger...');
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'windows',
    buffer: true
  });

  return transporter;
}

/**
 * Sends a cryptographically secure email verification message
 */
async function sendVerificationEmail({ name, email, token }) {
  const mailer = await getTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const fromEmail = process.env.FROM_EMAIL || '"NextStep AI" <no-reply@nextstep.ai>';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your NextStep AI Account</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 24px; font-weight: 800; color: #0f172a; text-decoration: none; }
    .brand-accent { color: #2563eb; }
    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; }
    .message { font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 8px; }
    .btn:hover { background-color: #1d4ed8; }
    .fallback-url { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 12px; color: #475569; word-break: break-all; margin-top: 16px; }
    .notice { font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="brand">NextStep <span class="brand-accent">AI</span></span>
    </div>
    <h2 class="title">Confirm Your Email Address</h2>
    <p class="message">
      Hello ${escapeHtml(name || 'there')},<br><br>
      Thank you for creating an account on <strong>NextStep AI</strong>. To access your candidate dashboard, AI mock interviews, resume analyzer, and technical screening rooms, please verify that you control this email address.
    </p>

    <div class="btn-container">
      <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
    </div>

    <p class="message" style="font-size: 13px; color: #64748b;">
      This verification link is single-use and will expire in <strong>24 hours</strong>. If the button above does not work, copy and paste this URL into your browser:
    </p>
    <div class="fallback-url">
      ${verificationUrl}
    </div>

    <div class="notice">
      <strong>Important Security Notice:</strong> Email verification confirms that you have access to this email address. NextStep AI will never ask for your password via email. If you did not register for NextStep AI, you can safely ignore this message.
    </div>
  </div>
</body>
</html>
`;

  const textContent = `
Hello ${name || 'there'},

Thank you for registering on NextStep AI!

To complete your registration and activate your account, please verify your email address by opening the following link in your browser:

${verificationUrl}

This link is valid for 24 hours.

If you did not register for an account on NextStep AI, you can safely disregard this message.

— NextStep AI Security Team
`;

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'Action Required: Verify your NextStep AI account',
    text: textContent,
    html: htmlContent
  };

  try {
    const info = await mailer.sendMail(mailOptions);
    console.log(`[EmailService] Verification email dispatched to: ${email}`);

    // Store in dev memory log for inspection / automated testing
    devEmailLog.push({
      to: email,
      type: 'verification',
      token,
      verificationUrl,
      timestamp: new Date().toISOString()
    });

    if (devEmailLog.length > 50) devEmailLog.shift();

    return {
      success: true,
      verificationUrl, // provided in dev mode
      messageId: info.messageId
    };
  } catch (err) {
    console.error(`[EmailService] Failed to send verification email to ${email}:`, err.message);
    throw new Error('Unable to send verification email. Please check server logs or SMTP configuration.');
  }
}

/**
 * Retrieves the latest recorded development verification link for a specific email
 * (Useful for testing the flow on localhost without third-party email configuration)
 */
function getLatestDevVerificationLink(email) {
  const norm = (email || '').toLowerCase().trim();
  for (let i = devEmailLog.length - 1; i >= 0; i--) {
    if (devEmailLog[i].to.toLowerCase().trim() === norm) {
      return devEmailLog[i];
    }
  }
  return null;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  sendVerificationEmail,
  getLatestDevVerificationLink,
  getTransporter
};
