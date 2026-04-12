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

  // Regex validation for email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    // Determine port and secure flag dynamically
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const isSecure = port === 465;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email Options
    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`, // typically your own authenticated sender
        replyTo: email,
        to: process.env.SMTP_TO, // where you want to receive it
        subject: `[Deal Floor Contact] - ${subject}`,
        html: `
          <div style="font-family: sans-serif; background: #f9f9f9; padding: 20px;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea;">
                <h2 style="margin-top: 0; color: #333;">New Contact Request</h2>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email (Reply-To):</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${details}</div>
            </div>
          </div>
        `,
    };

    // Send Mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Support request transmitted successfully.' });
  } catch (error) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to transmit message. Please confirm SMTP configurations.' });
  }
}
