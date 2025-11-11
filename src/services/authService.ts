import { supabase } from './supabase';
import { User } from '@/types';
import { saveUserToken, saveUserId, removeUserToken, removeUserId } from '@/utils/storage';

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create profile in profiles table
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        name,
      });

      if (profileError) throw profileError;

      // Create default preferences
      const { error: prefError } = await supabase.from('user_preferences').insert({
        user_id: data.user.id,
      });

      if (prefError) throw prefError;
    }

    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await saveUserToken(data.session.access_token);
      await saveUserId(data.user.id);
    }

    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    await removeUserToken();
    await removeUserId();
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!data.user) return null;

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as User;
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'standbyapp://reset-password',
    });

    if (error) throw error;
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },
};
