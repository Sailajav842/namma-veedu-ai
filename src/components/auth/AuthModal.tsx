import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  HardHat, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginWithEmail, signupWithRole, loginWithGoogle, resetPassword, isLoading } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [organization, setOrganization] = useState('');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'login') {
      const res = await loginWithEmail(email || 'sarah.jenkins@example.com', password);
      if (res.success) {
        onClose();
      } else {
        setMessage({ type: 'error', text: res.message || 'Login failed.' });
      }
    } else if (mode === 'signup') {
      if (!email || !name) {
        setMessage({ type: 'error', text: 'Please fill in required fields.' });
        return;
      }
      const res = await signupWithRole({
        email,
        name,
        role,
        licenseNumber: role === 'engineer' ? licenseNumber : undefined,
        organization,
      });
      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Account created successfully!' });
        setTimeout(() => onClose(), 800);
      }
    } else if (mode === 'forgot') {
      if (!email) {
        setMessage({ type: 'error', text: 'Please enter your email address.' });
        return;
      }
      const res = await resetPassword(email);
      setMessage({ type: 'success', text: res.message });
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-xl">BuildAI Account</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'login' && 'Sign in to access your building planner'}
                {mode === 'signup' && 'Create a new account and select your platform role'}
                {mode === 'forgot' && 'Reset your password via email link'}
              </p>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`px-6 py-3 text-xs flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-b border-rose-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Robert Vance"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah.jenkins@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>
          </div>

          {/* Password (if not forgot) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>
            </div>
          )}

          {/* Role Selection for Signup */}
          {mode === 'signup' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Platform Role *</label>
              <div className="grid grid-cols-3 gap-2">
                
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    role === 'customer'
                      ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Building2 className={`w-4 h-4 mb-1 ${role === 'customer' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-semibold">Customer</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Build Planner</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('engineer')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    role === 'engineer'
                      ? 'bg-amber-50 dark:bg-amber-600/20 border-amber-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <HardHat className={`w-4 h-4 mb-1 ${role === 'engineer' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-semibold">PE Engineer</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Review & Stamp</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    role === 'admin'
                      ? 'bg-rose-50 dark:bg-rose-600/20 border-rose-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 mb-1 ${role === 'admin' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`} />
                  <p className="text-xs font-semibold">Admin</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Platform Mgr</p>
                </button>

              </div>

              {role === 'engineer' && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Engineer (PE) License #</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. PE-CA-49281-CIVIL"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Dashboard'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Password Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Google OAuth Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500">Or Continue With</span>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Single Sign-On</span>
          </button>

          {/* Toggle between modes */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Sign Up Here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Sign In Here
                </button>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
