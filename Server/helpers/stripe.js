// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// async function createPaymentIntent(amount, currency = 'usd') {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // Amount in cents
//       currency: currency,
//       // Optionally, you can add more options like `payment_method_types`
//     });
//     return paymentIntent; // Return the created payment intent
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     throw error; // Rethrow the error for handling in the calling function
//   }
// }

// module.exports = { stripe, createPaymentIntent }; // Export the client and createPaymentIntent function
