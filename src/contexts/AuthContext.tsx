import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  signOut as amplifySignOut, 
  confirmSignUp as amplifyConfirmSignUp, 
  resendSignUpCode as amplifyResendSignUp, 
  resetPassword as amplifyForgotPassword, 
  confirmResetPassword as amplifyForgotPasswordSubmit, 
  getCurrentUser 
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { mockSignIn, mockGetCurrentUser, mockSignOut } from '../services/mockAuth';

interface User {
  username: string;
  email?: string;
  attributes?: {
    email?: string;
    [key: string]: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signUp: (username: string, password: string, email: string) => Promise<any>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<any>;
  resendConfirmationCode: (username: string) => Promise<any>;
  forgotPassword: (username: string) => Promise<any>;
  forgotPasswordSubmit: (username: string, code: string, newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
    
    // Listen for auth events
    const hubListener = Hub.listen('auth', ({ payload: { event } }) => {
      switch (event) {
        case 'signedIn':
          console.log('User signed in');
          checkAuthState();
          break;
        case 'signedOut':
          console.log('User signed out');
          setUser(null);
          break;
        case 'signInWithRedirect':
          console.log('User signed in with redirect');
          break;
        case 'signInWithRedirect_failure':
          console.log('Sign in with redirect failed');
          break;
        case 'tokenRefresh':
          console.log('Token refreshed');
          break;
        case 'tokenRefresh_failure':
          console.log('Token refresh failed');
          break;
        default:
          break;
      }
    });

    return () => hubListener();
  }, []);

  const checkAuthState = async () => {
    try {
      // Use mock authentication temporarily
      const currentUser = await mockGetCurrentUser();
      if (currentUser) {
        setUser({
          username: currentUser.username,
          email: currentUser.email,
          attributes: {}
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      // Use mock authentication temporarily
      const result = await mockSignIn(username, password);
      // Store user in localStorage
      localStorage.setItem('mockUser', JSON.stringify(result));
      setUser({
        username: result.username,
        email: result.email,
        attributes: {}
      });
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      const result = await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Use mock authentication temporarily
      await mockSignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const confirmSignUp = async (username: string, code: string) => {
    try {
      const result = await amplifyConfirmSignUp({ username, confirmationCode: code });
      return result;
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  };

  const resendConfirmationCode = async (username: string) => {
    try {
      const result = await amplifyResendSignUp({ username });
      return result;
    } catch (error) {
      console.error('Resend confirmation code error:', error);
      throw error;
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      const result = await amplifyForgotPassword({ username });
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const forgotPasswordSubmit = async (username: string, code: string, newPassword: string) => {
    try {
      const result = await amplifyForgotPasswordSubmit({ username, confirmationCode: code, newPassword });
      return result;
    } catch (error) {
      console.error('Forgot password submit error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    forgotPasswordSubmit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
