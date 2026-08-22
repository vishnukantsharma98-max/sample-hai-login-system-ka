import React, { useState } from 'react';
import { MailCheck, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface VerificationScreenProps {
  email: string;
  onLoginClick: () => void;
  onResendEmail?: () => Promise<void>;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  email,
  onLoginClick,
  onResendEmail,
}) => {
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!onResendEmail) return;
    setResendStatus('loading');
    setResendError(null);
    try {
      await onResendEmail();
      setResendStatus('success');
      setTimeout(() => setResendStatus('idle'), 5000);
    } catch (err: any) {
      setResendStatus('error');
      setResendError(err?.message || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans antialiased">
      {/* Minimal Top Brand Bar */}
      <header className="w-full bg-white border-b border-slate-100 py-4 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-xs">
            <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-indigo-900">
            Assignment Hub
          </span>
        </div>
        <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Email Verification
        </span>
      </header>

      {/* Main Verification Card */}
      <main className="grow flex items-center justify-center p-4 sm:p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center"
        >
          {/* Email Icon */}
          <div className="inline-flex w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl items-center justify-center mb-4 shadow-2xs">
            <MailCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Verify Your Email
          </h1>

          {/* Exact Required Message */}
          <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed text-center">
            <p className="font-medium">
              We have sent you a verification email to{' '}
              <span className="font-bold text-indigo-700 break-all">{email}</span>. Please verify it and log in.
            </p>
          </div>

          {resendStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>A new verification link has been sent to your inbox.</span>
            </motion.div>
          )}

          {resendStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{resendError}</span>
            </motion.div>
          )}

          {/* Primary Action: Login Button */}
          <div className="space-y-3 mt-6">
            <button
              type="button"
              id="verify-login-btn"
              onClick={onLoginClick}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-200/60 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onResendEmail && (
              <button
                type="button"
                id="resend-verification-btn"
                onClick={handleResend}
                disabled={resendStatus === 'loading'}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendStatus === 'loading' ? 'animate-spin' : ''}`} />
                <span>{resendStatus === 'loading' ? 'Sending email...' : 'Resend Verification Email'}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Tip: Be sure to check your spam/junk folder if the link does not arrive within a few minutes.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white py-4 px-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
        <div>&copy; 2026 University Student Portal. All rights reserved.</div>
        <div className="flex items-center gap-4 font-medium text-slate-400">
          <span>Firebase Email Verification</span>
        </div>
      </footer>
    </div>
  );
};
