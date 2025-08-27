// CLIENT-SIDE ONLY Stripe utilities
import { loadStripe, Stripe as StripeInstance } from '@stripe/stripe-js';

let stripePromise: Promise<StripeInstance | null>;

export const getStripe = (): Promise<StripeInstance | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export const formatPrice = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

export const PREMIUM_PRICE = 799; // €7.99 in cents
export const PREMIUM_CURRENCY = 'EUR';