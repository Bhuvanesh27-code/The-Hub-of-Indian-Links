import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: { displayName: string | null; uid?: string } | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authError: string | null;
  authSuccess: string | null;
  clearAuthError: () => void;
  sessionToken: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginWithGoogle: async () => ({ success: false }),
  logout: async () => {},
  authError: null,
  authSuccess: null,
  clearAuthError: () => {},
  sessionToken: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{
    displayName: string | null;
    uid?: string;
  } | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('hub_admin_sess');
    } catch {
      return null;
    }
  });

  // Verify server-side session on mount
  useEffect(() => {
    async function verifySession() {
      const stored = sessionStorage.getItem('hub_admin_sess');
      if (stored) {
        try {
          const res = await fetch('/api/admin/check-session', {
            headers: { Authorization: `Bearer ${stored}` }
          });
          const data = await res.json();
          if (data.isAdmin) {
            setIsAdmin(true);
            setUser({ displayName: 'Administrator' });
          } else {
            sessionStorage.removeItem('hub_admin_sess');
            setSessionToken(null);
            setIsAdmin(false);
          }
        } catch {
          // offline or server unavailable
        }
      }
      setLoading(false);
    }

    verifySession();
  }, []);

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        // Send email to backend for strict validation against server-side ADMIN_EMAIL
        try {
          const res = await fetch('/api/admin/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
          });
          const data = await res.json();

          if (data.authorized && data.sessionToken) {
            sessionStorage.setItem('hub_admin_sess', data.sessionToken);
            setSessionToken(data.sessionToken);
            setIsAdmin(true);
            setUser({ displayName: 'Administrator', uid: currentUser.uid });
            setAuthSuccess('Administrator Access Granted');
            setAuthError(null);
          } else {
            // Not authorized: log them out immediately
            await signOut(auth);
            sessionStorage.removeItem('hub_admin_sess');
            setSessionToken(null);
            setIsAdmin(false);
            setUser(null);
            setAuthError('Access Denied — This Google account is not authorised.');
          }
        } catch (err) {
          setIsAdmin(false);
          setUser(null);
        }
      } else if (!sessionToken) {
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sessionToken]);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.email) {
        const res = await fetch('/api/admin/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: result.user.email })
        });
        const data = await res.json();

        if (data.authorized && data.sessionToken) {
          sessionStorage.setItem('hub_admin_sess', data.sessionToken);
          setSessionToken(data.sessionToken);
          setIsAdmin(true);
          setUser({ displayName: 'Administrator', uid: result.user.uid });
          setAuthSuccess('Administrator Access Granted');
          return { success: true };
        } else {
          // Immediately log out unauthorized user
          await signOut(auth);
          sessionStorage.removeItem('hub_admin_sess');
          setSessionToken(null);
          setIsAdmin(false);
          setUser(null);
          const deniedMsg = 'Access Denied — This Google account is not authorised.';
          setAuthError(deniedMsg);
          return { success: false, error: deniedMsg };
        }
      }
      return { success: false, error: 'Google sign-in did not provide account verification.' };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in window was closed.' };
      }
      const err = 'Verification failed. Please try again.';
      setAuthError(err);
      return { success: false, error: err };
    }
  };

  const logout = async () => {
    try {
      const stored = sessionStorage.getItem('hub_admin_sess');
      if (stored) {
        fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${stored}` }
        }).catch(() => {});
      }
      sessionStorage.removeItem('hub_admin_sess');
      setSessionToken(null);
      setUser(null);
      setIsAdmin(false);
      setAuthError(null);
      setAuthSuccess(null);
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
    setAuthSuccess(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
        authError,
        authSuccess,
        clearAuthError,
        sessionToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
