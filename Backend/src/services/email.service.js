import nodemailer from "nodemailer";

const getTransporter = () => {
	const emailUser = process.env.EMAIL_USER;
	const emailPass = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

	// Try Brevo first as it's often more reliable for transactional emails and was verified to work
	if (process.env.BREVO_USER && process.env.BREVO_PASS) {
		return nodemailer.createTransport({
			host: "smtp-relay.brevo.com",
			port: 587,
			secure: false,
			auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_PASS },
		});
	}

	if (emailUser && emailPass) {
		return nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: { user: emailUser, pass: emailPass },
		});
	}

	if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
		return nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || "587", 10),
			secure: process.env.SMTP_SECURE === "true",
			auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
		});
	}

	return null;
};

export const sendMail = async ({ to, subject, html, text, attachments }) => {
	const transporter = getTransporter();
	if (!transporter) {
		console.warn("❌ No mail transporter configured; skipping email to", to);
		return null; // Don't throw, just log
	}

	// Determine the best 'from' address based on the provider
	let from = "EthioCamp <no-reply@ethiocamp.com>";
	
	if (transporter.options.host?.includes("brevo")) {
		from = process.env.EMAIL_FROM || process.env.BREVO_USER;
	} else if (process.env.EMAIL_USER) {
		from = process.env.EMAIL_USER;
	}
	
	try {
		const info = await transporter.sendMail({ from, to, subject, html, text, attachments });
		console.log(`✅ Email sent to ${to}: ${info.messageId}`);
		return info;
	} catch (err) {
		console.error(`❌ Failed to send email to ${to}:`, err.message);
		return null;
	}
};

export const sendVerificationEmail = async (to, code) => {
	const subject = "EthioCamp - Verify your account";
	const html = `<p>Your EthioCamp verification code is <strong>${code}</strong>.</p>`;
	return sendMail({ to, subject, html });
};

export const sendAccountCreated = async (to, tempPassword) => {
	const subject = "Your EthioCamp account was created";
	const html = `<p>Your account has been created. Temporary password: <strong>${tempPassword}</strong></p><p>Please login and change your password.</p>`;
	return sendMail({ to, subject, html });
};

export const sendBookingCreated = async (booking) => {
	try {
		const to = booking.camperId?.email || booking.camperEmail;
		if (!to) return null;
		const subject = `Booking Received - ${booking._id}`;
		const html = `<p>Hi ${booking.camperId?.fullName || ''},</p>
			<p>Your booking for <strong>${booking.tentId?.name || 'a tent'}</strong> from <strong>${new Date(booking.startDate).toLocaleDateString()}</strong> to <strong>${new Date(booking.endDate).toLocaleDateString()}</strong> has been received.</p>
			<p>Total: <strong>${booking.totalPrice}</strong></p>
			<p>Payment option: <strong>${booking.paymentOption}</strong></p>`;
		return sendMail({ to, subject, html });
	} catch (err) {
		console.error("sendBookingCreated error:", err);
		return null;
	}
};

export const sendBookingConfirmed = async (booking) => {
	try {
		const to = booking.camperId?.email || booking.camperEmail;
		if (!to) return null;
		const subject = `Booking Confirmed - ${booking._id}`;
		const html = `<p>Your booking for <strong>${booking.tentId?.name || 'a tent'}</strong> is confirmed. Enjoy your stay!</p>`;
		return sendMail({ to, subject, html });
	} catch (err) {
		console.error("sendBookingConfirmed error:", err);
		return null;
	}
};

export const sendPaymentSuccess = async (booking) => {
	try {
		const to = booking.camperId?.email || booking.camperEmail;
		if (!to) return null;
		const subject = `Payment Received - ${booking._id}`;
		const html = `<p>We have received your payment for booking <strong>${booking._id}</strong>. Thank you!</p>`;
		return sendMail({ to, subject, html });
	} catch (err) {
		console.error("sendPaymentSuccess error:", err);
		return null;
	}
};

