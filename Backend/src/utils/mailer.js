// Replace with SendGrid/Mailgun/Twilio etc.
// Keep functions async so you can plug real providers easily.

export  async function sendEmail(to, subject, text, html = null) {
  console.log(`[mailer] sendEmail -> to=${to}, subject=${subject}, text=${text}`);
  // TODO: integrate with real email provider
}

export  async function sendSMS(phone, text) {
  console.log(`[sms] sendSMS -> to=${phone}, text=${text}`);
  // TODO: integrate with Twilio or other SMS provider
}
