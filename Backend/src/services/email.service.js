import nodemailer from "nodemailer";

const getTransporter = () => {
	if (process.env.BREVO_USER && process.env.BREVO_PASS) {
		return nodemailer.createTransport({
			host: "smtp-relay.brevo.com",
			port: 587,
			secure: false,
			auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_PASS },
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

export const sendMail = async ({ to, subject, html, text }) => {
	const transporter = getTransporter();
	if (!transporter) {
		console.warn("No mail transporter configured; skipping email to", to);
		return null;
	}

	const from = process.env.EMAIL_FROM || process.env.BREVO_USER || process.env.SMTP_USER;
	const info = await transporter.sendMail({ from, to, subject, html, text });
	return info;
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

