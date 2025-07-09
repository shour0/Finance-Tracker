import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
// import type { User } from "firebase/auth"
import { auth, googleAuthProvider } from '@/app/firebase/config';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useRouter } from 'next/navigation';
import { MultiStepLoader } from '@/components/ui/MultiStepLoader';
import { User as UserIcon, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const loginLoadingStates = [
  { text: 'Validating credentials...' },
  { text: 'Authenticating with Firebase...' },
  { text: 'Verifying account status...' },
  { text: 'Generating auth token...' },
  { text: 'Loading user profile...' },
  { text: 'Welcome back!' },
];

const signupLoadingStates = [
  { text: 'Validating form data...' },
  { text: 'Creating Firebase account...' },
  { text: 'Setting up user profile...' },
  { text: 'Generating auth token...' },
  { text: 'Finalizing account setup...' },
  { text: 'Account created successfully!' },
];

const googleLoadingStates = [
  { text: 'Opening Google authentication...' },
  { text: 'Verifying with Google...' },
  { text: 'Generating auth token...' },
  { text: 'Creating secure session...' },
  { text: 'Welcome!' },
];

const AuthModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (password.length < 8) return { strength: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 'strong', color: 'bg-green-500', text: 'Strong' };
    }
    return { strength: 'medium', color: 'bg-yellow-500', text: 'Medium' };
  };

  // const getFirebaseToken = async (user: User) => {
  //   try {
  //     const idToken = await user.getIdToken()
  //     console.log('Firebase ID Token generated:', idToken)

  //     return idToken
  //   } catch (error) {
  //     console.error('Error getting Firebase token:', error)
  //     throw error
  //   }
  // }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setMode('login');
        setSuccess('');
      }, 3000);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error)
        switch (error.code) {
          case 'auth/user-not-found':
            setError('No account found with this email');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          default:
            setError('Failed to send reset email. Please try again');
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setCurrentLoadingStep(0);

    try {
      setCurrentLoadingStep(0);

      setCurrentLoadingStep(1);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setCurrentLoadingStep(2);
      await updateProfile(user, {
        displayName: displayName.trim(),
      });

      setCurrentLoadingStep(3);
      // const idToken = await getFirebaseToken(user)

      setCurrentLoadingStep(4);
      setCurrentLoadingStep(5);

      console.log('User created successfully:', user);
      console.log('Firebase ID Token ready for API calls');

      setEmail('');
      setPassword('');
      setDisplayName('');

      setTimeout(() => {
        onOpenChange(false);
        router.push('/dashboard');
      }, 1000);
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      setCurrentLoadingStep(0);
      if (error && typeof error === 'object' && 'code' in error)
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('Email is already registered');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/weak-password':
            setError('Password is too weak');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection');
            break;
          default:
            setError('Failed to create account. Please try again');
        }
    }
  };

  const handleLogIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setCurrentLoadingStep(0);

    try {
      setCurrentLoadingStep(0);
      setCurrentLoadingStep(1);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setCurrentLoadingStep(2);
      setCurrentLoadingStep(3);
      // const idToken = await getFirebaseToken(user)

      setCurrentLoadingStep(4);
      setCurrentLoadingStep(5);

      console.log('User logged in successfully:', user);
      console.log('Firebase ID Token ready for API calls');

      setEmail('');
      setPassword('');

      setTimeout(() => {
        onOpenChange(false);
        router.push('/dashboard');
      }, 1000);
    } catch (error: unknown) {
      console.error('Login error:', error);
      setIsLoading(false);
      setCurrentLoadingStep(0);

      if (error && typeof error === 'object' && 'code' in error)
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError('Invalid email or password');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/user-disabled':
            setError('Account has been disabled');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed attempts. Please try again later');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection');
            break;
          default:
            setError('Failed to log in. Please try again');
        }
    }
  };

  const handleGoogleLogIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    setCurrentLoadingStep(0);

    try {
      setCurrentLoadingStep(0);
      setCurrentLoadingStep(1);
      const result = await signInWithPopup(auth, googleAuthProvider);

      setCurrentLoadingStep(2);
      // const idToken = await getFirebaseToken(result.user)

      setCurrentLoadingStep(3);
      setCurrentLoadingStep(4);

      console.log('Signed in with Google', result.user);
      console.log('Firebase ID Token ready for API calls');

      setTimeout(() => {
        onOpenChange(false);
        router.push('/dashboard');
      }, 1000);
    } catch (error: unknown) {
      console.error('Google auth error:', error);
      setIsGoogleLoading(false);
      setCurrentLoadingStep(0);
      if (error && typeof error === 'object' && 'code' in error)
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            setError('Sign-in cancelled');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your connection');
            break;
          default:
            setError('Failed to sign in with Google. Please try again');
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogIn();
    } else if (mode === 'signup') {
      handleSignUp();
    } else if (mode === 'reset') {
      handlePasswordReset();
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setCurrentLoadingStep(0);
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full lg:max-w-[28rem] md:max-w-[26rem] sm:max-w-[24rem] border-0 shadow-2xl ">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold text-white">
              {mode === 'reset'
                ? 'Reset Password'
                : mode === 'login'
                ? 'Welcome Back'
                : 'Create Account'}
            </DialogTitle>
            <DialogDescription className="text-white mt-2">
              {mode === 'reset'
                ? 'Enter your email to receive a reset link'
                : mode === 'login'
                ? 'Sign in to your account to continue'
                : 'Join us today and get started'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode !== 'reset' && (
              <Button
                type="button"
                onClick={handleGoogleLogIn}
                disabled={isLoading || isGoogleLoading}
                className="w-full h-12"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </div>
                )}
              </Button>
            )}

            {mode !== 'reset' && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3  font-medium">Or continue with email</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                    Display Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      required
                      disabled={isLoading || isGoogleLoading}
                      className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading || isGoogleLoading}
                    className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading || isGoogleLoading}
                      minLength={6}
                      className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {mode === 'signup' && password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Password strength</span>
                        <span
                          className={`font-medium ${
                            passwordStrength?.strength === 'strong'
                              ? 'text-green-600'
                              : passwordStrength?.strength === 'medium'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {passwordStrength?.text}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                          style={{
                            width:
                              passwordStrength?.strength === 'strong'
                                ? '100%'
                                : passwordStrength?.strength === 'medium'
                                ? '66%'
                                : '33%',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-xl border border-green-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full h-12">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  {mode === 'reset'
                    ? 'Sending...'
                    : mode === 'login'
                    ? 'Signing in...'
                    : 'Creating account...'}
                </div>
              ) : mode === 'reset' ? (
                'Send Reset Link'
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center space-y-2">
              {mode === 'login' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    disabled={isLoading || isGoogleLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
                      onClick={() => switchMode('signup')}
                      disabled={isLoading || isGoogleLoading}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
                    onClick={() => switchMode('login')}
                    disabled={isLoading || isGoogleLoading}
                  >
                    Log in
                  </button>
                </div>
              )}

              {mode === 'reset' && (
                <div className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
                    onClick={() => switchMode('login')}
                    disabled={isLoading || isGoogleLoading}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Multi-step loader overlay */}
      <MultiStepLoader
        loadingStates={
          isGoogleLoading
            ? googleLoadingStates
            : mode === 'login'
            ? loginLoadingStates
            : signupLoadingStates
        }
        loading={isLoading || isGoogleLoading}
        currentStep={currentLoadingStep}
        duration={800}
        loop={false}
      />
    </>
  );
};

export default AuthModal;
