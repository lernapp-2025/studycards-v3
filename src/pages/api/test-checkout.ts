import { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/stripe-server';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test user email
    const testEmail = 'tizian.schorr@outlook.de';
    
    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Test user not found', details: userError });
    }

    // Check if user is already premium
    if (user.is_premium) {
      return res.status(400).json({ error: 'User is already premium' });
    }

    const { successUrl, cancelUrl } = req.body;

    // Create checkout session
    const session = await createCheckoutSession(
      user.id,
      user.email,
      successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    return res.status(200).json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}