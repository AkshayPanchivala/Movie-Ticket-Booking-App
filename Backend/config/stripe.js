const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

module.exports = stripe;
