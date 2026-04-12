import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testSMTP() {
  console.log("🚀 Testing SMTP Connection...");
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  console.log(`From: ${process.env.SMTP_FROM}`);
  console.log(`To: ${process.env.SMTP_TO}`);

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Adding some debug logging
    debug: true,
    logger: true 
  });

  try {
    // Verify connection configuration
    await transporter.verify();
    console.log("✅ SMTP Server is ready to take our messages");

    // Try sending a test mail
    const targetEmail = process.env.SMTP_TO; // Change this temporarily to a different email to test!
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: targetEmail,
      subject: "Deal Floor SMTP Test (Alternative Check)",
      text: "Testing if the mail arrives at a different destination.",
    });

    console.log("✅ Message sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ SMTP Failure:");
    console.error(error);
  }
}

testSMTP();
