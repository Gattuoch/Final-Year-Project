import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

import * as emailService from '../Backend/src/services/email.service.js';

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
            console.log('❌ Failed! No info returned.');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Error testing email:', err);
        process.exit(1);
    }
}

testEmail();
