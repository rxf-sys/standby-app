import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import { User } from '@/types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setLoading, login, logout } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = await authService.getCurrentUser();
        login(user!);
      } else if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      authService.signUp(email, password, name),
  });
};

export const useSignIn = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: async () => {
      const user = await authService.getCurrentUser();
      if (user) login(user);
    },
  });
};

export const useSignOut = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      logout();
    },
  });
};

export const useUpdateProfile = () => {
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: (updates: Partial<User>) => {
      if (!user) throw new Error('No user logged in');
      return authService.updateProfile(user.id, updates);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (newPassword: string) => authService.updatePassword(newPassword),
  });
};
