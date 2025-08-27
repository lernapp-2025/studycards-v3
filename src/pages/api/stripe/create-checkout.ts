import { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/stripe-server';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For testing: Use your admin email directly
    const testEmail = 'tizian.schorr@outlook.de';
    
    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'Test user not found' });
    }

    // Check if user is already premium (user is now the full user data)
    if (user.is_premium) {
      return res.status(400).json({ error: 'User is already premium' });
    }


    // Create checkout session
    const session = await createCheckoutSession(
      user.id,
      user.email!,
      `${process.env.NEXT_PUBLIC_APP_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_APP_URL}/premium/cancel`
    );

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}