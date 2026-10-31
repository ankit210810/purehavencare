import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  AlertCircle,
  Inbox
} from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AuthPage({ navigate }) {
  const { login, register, resendConfirmationEmail, loading } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'email_sent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('9142166210');
  const [errorMsg, setErrorMsg] = useState('');
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setUnconfirmedEmail('');

    if (mode === 'forgot') {
      addToast(`Password recovery link sent to ${email}`, 'info');
      setMode('login');
      return;
    }

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.fullName}!`, 'success');
        navigate(res.user.role === 'admin' ? 'admin' : 'profile');
      } else {
        if (res.needsEmailConfirmation) {
          setUnconfirmedEmail(res.email);
          setErrorMsg(res.error);
        } else {
          setErrorMsg(res.error || 'Invalid credentials');
        }
      }
    } else if (mode === 'register') {
      const res = await register(email, password, fullName, phone);
      if (res.success) {
        if (res.needsEmailConfirmation) {
          setUnconfirmedEmail(res.email);
          setMode('email_sent');
          addToast('Verification email dispatched! Please check your inbox.', 'success');
        } else {
          addToast('Registration successful! Welcome to PureHaven.', 'success');
          navigate('profile');
        }
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }
  };

  const handleResend = async () => {
    const targetEmail = unconfirmedEmail || email;
    if (!targetEmail) return;

    setIsResending(true);
    try {
      await resendConfirmationEmail(targetEmail);
      addToast(`Confirmation email resent to ${targetEmail}!`, 'success');
    } catch (err) {
      addToast(err.message || 'Could not resend email. Please retry in a few moments.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50/80 py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-cream-200 shadow-premium p-8 space-y-6 animate-fade-in">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h1 className="font-serif text-2xl font-bold text-forest-950">
            {mode === 'email_sent'
              ? 'Verify Your Email Address'
              : mode === 'login'
              ? 'Sign In to PureHaven'
              : mode === 'register'
              ? 'Join PureHaven Club'
              : 'Reset Password'}
          </h1>
          <p className="text-xs text-charcoal-500">
            {mode === 'email_sent'
              ? 'Check your inbox to confirm your account and activate your profile.'
              : mode === 'login'
              ? 'Access saved addresses, order tracking, and member releases.'
              : mode === 'register'
              ? 'Receive an authentic email verification link upon sign-up.'
              : 'Enter your email to receive a secure recovery link.'}
          </p>
        </div>

        {/* SCREEN 1: EMAIL CONFIRMATION SENT VIEW */}
        {mode === 'email_sent' ? (
          <div className="space-y-6 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-xs">
              <Inbox className="w-8 h-8 text-forest-700" />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-charcoal-600 leading-relaxed">
                We sent a secure confirmation email to:
              </p>
              <p className="font-serif text-base font-bold text-forest-950 bg-cream-100 py-1.5 px-3 rounded-xl border border-cream-200 break-all">
                {unconfirmedEmail || email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 text-left space-y-2 text-xs text-forest-950">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-700" />
                <span>Next steps to log in:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-charcoal-700 text-[11px] leading-relaxed pl-1">
                <li>Open your email inbox (e.g. Gmail / Outlook).</li>
                <li>Look for an email from <strong>PureHaven</strong> or <strong>Supabase</strong>.</li>
                <li>Click <strong>"Confirm your email"</strong> link.</li>
                <li>Your account is instantly verified and ready to order!</li>
              </ol>
              <p className="text-[10px] text-charcoal-500 pt-1 italic">
                Tip: Don't see it? Please check your <strong>Spam</strong> or <strong>Promotions</strong> folder.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? 'Sending Email...' : 'Resend Confirmation Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="w-full py-2.5 text-xs text-forest-900 font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* SCREEN 2: LOGIN / REGISTER / FORGOT PASSWORD */
          <>
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-cream-100 p-1 text-xs font-bold text-charcoal-700">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setUnconfirmedEmail(''); }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white text-forest-950 shadow-xs' : 'hover:text-forest-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setUnconfirmedEmail(''); }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'register' ? 'bg-white text-forest-950 shadow-xs' : 'hover:text-forest-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{errorMsg}</p>
                </div>
                {unconfirmedEmail && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 hover:underline pt-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    <span>Click here to resend verification link</span>
                  </button>
                )}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Radhika Sen"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">
                      Phone Number (For Delivery Concierge) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9142166210"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-charcoal-700">Password *</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-forest-800 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:border-forest-700"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 active:scale-98 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Sign In to Account'
                    : mode === 'register'
                    ? 'Create Account & Send Verification Email'
                    : 'Send Recovery Link'}
                </span>
                <ArrowRight className="w-4 h-4 text-butter-400" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
