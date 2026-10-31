import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../services/supabaseClient';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr_guest_demo',
  email: 'customer@purehaven.in',
  fullName: 'Arjun Mehta',
  phone: '9142166210',
  role: 'customer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  addresses: [
    {
      id: 'addr-1',
      fullName: 'Arjun Mehta',
      phone: '9142166210',
      addressLine1: 'Villa 14, Whispering Pines, Indiranagar 100ft Road',
      addressLine2: 'Near Defense Colony Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true
    }
  ]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('purehaven_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [loading, setLoading] = useState(false);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('purehaven_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('purehaven_current_user');
    }
  }, [user]);

  // Helper to load full profile from Supabase
  const loadUserProfile = async (supabaseUser) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      const { data: addresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', supabaseUser.id);

      const loggedUser = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        fullName: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        phone: profile?.phone || supabaseUser.user_metadata?.phone || '9142166210',
        role: profile?.role || (supabaseUser.email?.toLowerCase().includes('admin') ? 'admin' : 'customer'),
        avatarUrl: profile?.avatar_url,
        addresses: addresses && addresses.length > 0 ? addresses : []
      };

      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.warn('Error loading Supabase user profile:', err);
      return null;
    }
  };

  // Listen to Supabase Auth State changes (e.g. user clicks email confirmation link!)
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Check existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserProfile(session.user);
        }
      });

      // 2. Listen for sign-in / verification redirect events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => subscription?.unsubscribe();
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          // Check for unconfirmed email
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            return {
              success: false,
              needsEmailConfirmation: true,
              email: email.trim(),
              error: 'Your email address has not been confirmed yet. Please click the confirmation link sent to your inbox, or resend the verification link.'
            };
          }
          throw error;
        }

        const loggedUser = await loadUserProfile(data.user);
        return { success: true, user: loggedUser };
      } else {
        // Standalone / Mock login
        await new Promise((resolve) => setTimeout(resolve, 400));

        let role = 'customer';
        let fullName = 'PureHaven Connoisseur';

        if (email.toLowerCase().includes('admin') || password === 'admin123') {
          role = 'admin';
          fullName = 'PureHaven Admin';
        } else if (email === 'customer@purehaven.in') {
          fullName = 'Arjun Mehta';
        } else {
          fullName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        const loggedUser = {
          id: `usr_${Date.now().toString(36)}`,
          email,
          fullName,
          phone: '9142166210',
          role,
          avatarUrl: role === 'admin' 
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          addresses: DEFAULT_USER.addresses
        };

        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register handler with Confirmation Email support
  const register = async (email, password, fullName, phone = '9142166210') => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const cleanEmail = email.trim();
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone
            },
            emailRedirectTo: window.location.origin
          }
        });

        if (error) throw error;

        // Ensure row in public.profiles
        if (data.user) {
          try {
            await supabase.from('profiles').upsert([
              {
                id: data.user.id,
                email: cleanEmail,
                full_name: fullName,
                phone: phone,
                role: cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'customer'
              }
            ]);
          } catch (profileErr) {
            console.warn('Profile creation note:', profileErr);
          }
        }

        // When email confirmation is enabled in Supabase, data.session is null!
        const needsConfirmation = !data.session;

        if (needsConfirmation) {
          return {
            success: true,
            needsEmailConfirmation: true,
            email: cleanEmail,
            message: 'A confirmation link has been sent to your email address.'
          };
        }

        const loggedUser = await loadUserProfile(data.user);
        return { success: true, user: loggedUser };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
        const newUser = {
          id: `usr_${Date.now().toString(36)}`,
          email,
          fullName,
          phone,
          role,
          addresses: []
        };
        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Resend confirmation email handler
  const resendConfirmationEmail = async (emailToResend) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToResend.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return { success: true };
    }
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout warning:', err);
      }
    }
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  const addAddress = (address) => {
    setUser((prev) => {
      if (!prev) return null;
      const newAddr = {
        id: `addr_${Date.now()}`,
        isDefault: prev.addresses.length === 0,
        ...address
      };
      return {
        ...prev,
        addresses: [...prev.addresses, newAddr]
      };
    });
  };

  const deleteAddress = (addressId) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== addressId)
      };
    });
  };

  const switchRole = (newRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        resendConfirmationEmail,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
