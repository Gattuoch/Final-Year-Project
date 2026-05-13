import dotenv from 'dotenv';
dotenv.config();

import * as emailService from './src/services/email.service.js';

async function testEmail() {
    console.log('Testing email with user:', process.env.EMAIL_USER);
    try {
        const info = await emailService.sendMail({
            to: 'gchambang@gmail.com',
            subject: 'Test Email from EthioCamp',
            html: '<p>If you see this, the email service is working correctly.</p>'
        });
        if (info) {
            console.log('✅ Success! MessageId:', info.messageId);
        } else {
            console.log('❌ Failed! See console for details.');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Critical error testing email:', err);
        process.exit(1);
    }
}

testEmail();
