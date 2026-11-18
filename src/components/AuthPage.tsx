import { useState } from 'react';
import type { FormEvent } from 'react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onSubmit: (user: { name: string; email: string }) => void;
  onBackToHome: () => void;
}

export default function AuthPage({
  initialMode = 'signup',
  onSubmit,
  onBackToHome,
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    const displayName = mode === 'signup' ? name.trim() || trimmedEmail.split('@')[0] : trimmedEmail.split('@')[0];
    onSubmit({ name: displayName, email: trimmedEmail });
  }

  function handleSocialLogin(provider: string) {
    // Quick demo login
    onSubmit({
      name: `User via ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
    });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {/* Left Side: Form Panel */}
        <div className="auth-panel auth-panel--form">
          <div className="auth-header">
            <div className="auth-brand" onClick={onBackToHome} role="button" tabIndex={0}>
              <div className="auth-logo" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="auth-brand-name">Timex</span>
            </div>

            <div className="auth-title-group">
              <span className="auth-badge">
                {mode === 'signup' ? 'Create your profile' : 'Welcome back'}
              </span>
              <h1 className="auth-title">
                {mode === 'signup' ? 'Sign up account' : 'Log in to Timex'}
              </h1>
              <p className="auth-sub">
                {mode === 'signup'
                  ? 'Enter your personal data to create your savings account'
                  : 'Enter your credentials to access your financial dashboard'}
              </p>
            </div>
          </div>

          {/* Social Logins */}
          <div className="auth-socials">
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin('Google')}
              aria-label="Continue with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="auth-social-btn"
              onClick={() => handleSocialLogin('Apple')}
              aria-label="Continue with Apple"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24Z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <div className="auth-error-banner">{error}</div>}

            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Timothy Dada"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="auth-label-row">
                <label htmlFor="auth-password">Password</label>
                {mode === 'login' && (
                  <button type="button" className="auth-link-btn" onClick={() => alert('Password reset link sent to your email.')}>
                    Forgot?
                  </button>
                )}
              </div>
              <div className="auth-password-wrap">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn--primary auth-submit-btn">
              {mode === 'signup' ? 'Create Account →' : 'Sign In →'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="auth-footer-links">
            <p className="auth-switch-text">
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => {
                  setMode(mode === 'signup' ? 'login' : 'signup');
                  setError('');
                }}
              >
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>

            <button type="button" className="auth-back-btn" onClick={onBackToHome}>
              ← Return to Home
            </button>
          </div>
        </div>

        {/* Right Side: Visual Landscape & Inspiration Panel (Inspired by uploaded images) */}
        <div className="auth-panel auth-panel--visual">
          <div className="auth-visual-scenery">
            {/* Artistic serene light-mode landscape graphic */}
            <div className="auth-landscape">
              <div className="auth-sun" />
              <div className="auth-hill auth-hill--back" />
              <div className="auth-hill auth-hill--mid" />
              <div className="auth-hill auth-hill--front" />
              <div className="auth-flower auth-flower--1" />
              <div className="auth-flower auth-flower--2" />
              <div className="auth-flower auth-flower--3" />
            </div>

            {/* Floating feature & milestone cards */}
            <div className="auth-glass-card auth-glass-card--top">
              <div className="auth-glass-card__icon">🎯</div>
              <div>
                <strong>Laptop Fund</strong>
                <span>₦550,000 of ₦650,000 (85%)</span>
              </div>
            </div>

            <div className="auth-glass-card auth-glass-card--bottom">
              <div className="auth-glass-badge">Maximum Consistency</div>
              <p className="auth-glass-quote">
                “Small deliberate savings compound into life-changing freedom.”
              </p>
              <div className="auth-glass-stat">
                <span className="auth-glass-stat__num">₦1.4M+</span>
                <span className="auth-glass-stat__label">Saved on schedule</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
