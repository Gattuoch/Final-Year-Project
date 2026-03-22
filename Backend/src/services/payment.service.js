import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (booking) => {
	const amount = Math.round((booking.totalPrice || 0) * 100);
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency: process.env.STRIPE_CURRENCY || "usd",
		metadata: { bookingId: booking._id.toString() },
		automatic_payment_methods: { enabled: true },
	});
	return paymentIntent;
};

export const createStripeCheckoutSession = async (booking, successUrl, cancelUrl) => {
	const amount = Math.round((booking.totalPrice || 0) * 100);
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: process.env.STRIPE_CURRENCY || "usd",
					product_data: { name: booking.tentId.name || "EthioCamp Booking" },
					unit_amount: amount,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata: { bookingId: booking._id.toString() },
	});
	return session;
};

export const constructStripeEvent = (rawBody, sig) => {
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
	return stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
};
