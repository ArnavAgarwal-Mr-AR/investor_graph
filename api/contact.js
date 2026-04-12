import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, details } = req.body;

  // Basic validation
  if (!name || !email || !subject || !details) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  console.log(`📩 Incoming support request from: ${name} (${email})`);

  try {
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    // Email Options
    // NOTE: Use SMTP_FROM exactly as the sender. 
    // We put the user's name in the "Name" part of the from field, 
    // but the email MUST be your authenticated one.
    const mailOptions = {
        from: `${name} <${process.env.SMTP_FROM}>`, 
        replyTo: email, 
        to: process.env.SMTP_TO,
        subject: `[Deal Floor Support] ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">New Message Received</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${details}</div>
          </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);

    return res.status(200).json({ message: 'Support request transmitted successfully.' });
  } catch (error) {
    console.error('❌ SMTP Transmission Error:', error);
    return res.status(500).json({ 
      error: 'Failed to transmit message.',
      diag: error.message 
    });
  }
}
