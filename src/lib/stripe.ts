import { loadStripe, Stripe as StripeInstance } from '@stripe/stripe-js';

// Client-side publishable key check
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.warn('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Server-side stripe instance (imported only in API routes)
export const getServerStripe = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerStripe can only be called on server-side');
  }
  
  const Stripe = require('stripe');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
};

let stripePromise: Promise<StripeInstance | null>;

export const getStripe = (): Promise<StripeInstance | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) => {
  const stripe = getServerStripe();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [
      {
        price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      type: 'premium_upgrade',
    },
    payment_intent_data: {
      metadata: {
        userId,
        type: 'premium_upgrade',
      },
    },
  });

  return session;
};

export const constructWebhookEvent = (body: string, signature: string) => {
  const stripe = getServerStripe();
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
};

export const handleSuccessfulPayment = async (session: Stripe.Checkout.Session) => {
  const userId = session.client_reference_id || session.metadata?.userId;
  
  if (!userId) {
    console.error('No user ID found in successful payment session');
    return;
  }

  try {
    // Import here to avoid circular dependency
    const { supabaseAdmin } = await import('@/lib/supabase');
    
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not available');
    }
    
    // Update user to premium status
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_premium: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user to premium:', error);
      throw error;
    }

    console.log(`User ${userId} successfully upgraded to premium`);

    // TODO: Send confirmation email
    // await sendPremiumWelcomeEmail(userEmail);

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

export const formatPrice = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

export const PREMIUM_PRICE = 799; // €7.99 in cents
export const PREMIUM_CURRENCY = 'EUR';