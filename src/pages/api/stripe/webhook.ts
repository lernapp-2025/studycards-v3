import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { constructWebhookEvent, handleSuccessfulPayment } from '@/lib/stripe-server';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'No Stripe signature found' });
    }

    const event = constructWebhookEvent(buf.toString(), signature);

    console.log('Received Stripe webhook:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          await handleSuccessfulPayment(session);
          console.log('Successfully handled completed checkout session');
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        // TODO: Handle failed payment (send email, log, etc.)
        break;

      case 'invoice.payment_succeeded':
        // Handle successful invoice payment if needed for subscriptions
        console.log('Invoice payment succeeded');
        break;

      case 'invoice.payment_failed':
        // Handle failed invoice payment if needed for subscriptions
        console.log('Invoice payment failed');
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    
    if (error.type === 'StripeSignatureVerificationError') {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    return res.status(500).json({ 
      error: 'Webhook handler failed',
      details: error.message 
    });
  }
}