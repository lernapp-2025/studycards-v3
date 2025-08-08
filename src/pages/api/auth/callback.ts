import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(String(code));
    
    if (error) {
      console.error('Auth callback error:', error);
      return res.redirect('/auth/login?error=callback_error');
    }
  }

  return res.redirect('/dashboard');
}