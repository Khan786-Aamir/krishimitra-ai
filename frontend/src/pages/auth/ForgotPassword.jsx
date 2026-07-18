import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSent(true);
    showToast(`Verification code sent to ${data.email}`, 'success');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background-dark">
      <div className="w-full max-w-md">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
            <span className="h-7 w-7 bg-primary rounded-xl flex items-center justify-center text-white font-sans text-sm font-bold">
              KM
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display">
            Reset password
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Enter your email address and we'll send you a recovery link
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-card-dark border border-border-dark p-8 rounded-2xl shadow-xl">
          {isSent ? (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center h-12 w-12 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-2 animate-bounce">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white font-display">Check your inbox</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We have emailed a password reset link to you. Please follow the instructions to secure your account.
              </p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full pl-11 pr-4 py-3 bg-background-dark border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                      errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border-dark'
                    }`}
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 shadow-lg shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
