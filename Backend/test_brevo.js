import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testBrevo() {
    console.log('Testing Brevo with user:', process.env.BREVO_USER);
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_PASS },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.BREVO_USER,
            to: 'gchambang@gmail.com',
            subject: 'Test Email from Brevo (EthioCamp)',
            html: '<p>If you see this, Brevo is working.</p>'
        });
        console.log('✅ Success! MessageId:', info.messageId);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error testing Brevo:', err.message);
        process.exit(1);
    }
}

testBrevo();
