import { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the user from the Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if user is already premium
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_premium')
      .eq('id', user.id)
      .single();

    if (userError) {
      return res.status(500).json({ error: 'Error fetching user data' });
    }

    if (userData?.is_premium) {
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