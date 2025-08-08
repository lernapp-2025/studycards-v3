import { supabase } from '@/lib/supabase';
import type { User, UserInsert } from '@/types';

export const auth = {
  async signUp(email: string, password: string, userData?: Partial<UserInsert>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          trial_ends_at: trialEndsAt.toISOString(),
          is_premium: false,
          xp: 0,
          level: 1,
          streak_count: 0,
          preferred_language: 'de',
          theme: 'light',
          onboarding_completed: false,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return { user: data.user, session: data.session };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { user: data.user, session: data.session };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return user;
  },

  async updateUser(updates: Partial<User>) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteAccount() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    // Call API route to delete user (admin operation must be done server-side)
    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete account');
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async isTrialExpired(user: User): Promise<boolean> {
    if (user.is_premium) {
      return false;
    }

    if (!user.trial_ends_at) {
      return true;
    }

    const trialEndDate = new Date(user.trial_ends_at);
    return new Date() > trialEndDate;
  },

  async updateLastActivity(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating last activity:', error);
    }
  },

  async addXP(userId: string, xpAmount: number) {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('xp, level')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const newXP = user.xp + xpAmount;
    const newLevel = calculateLevel(newXP);

    const { data, error } = await supabase
      .from('users')
      .update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { user: data, levelUp: newLevel > user.level };
  },

  async updateStreak(userId: string) {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('streak_count, last_activity')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const today = new Date();
    const lastActivity = user.last_activity ? new Date(user.last_activity) : null;
    
    let newStreak = user.streak_count;

    if (!lastActivity || !isSameDay(today, lastActivity)) {
      if (lastActivity && isConsecutiveDay(today, lastActivity)) {
        newStreak += 1;
      } else if (!lastActivity || !isYesterday(lastActivity, today)) {
        newStreak = 1;
      }

      const { error } = await supabase
        .from('users')
        .update({
          streak_count: newStreak,
          last_activity: today.toISOString(),
          updated_at: today.toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }
    }

    return newStreak;
  },
};

function calculateLevel(xp: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000, 20000, 26000, 33000, 41000, 50000];
  
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      return i + 1;
    }
  }
  
  return 1;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isConsecutiveDay(today: Date, lastActivity: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(yesterday, lastActivity);
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}