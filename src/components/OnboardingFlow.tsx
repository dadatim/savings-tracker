import { useState } from 'react';
import type { FormEvent } from 'react';
import type { PaceMode } from '../types';
import { formatMoney, getPeriodsLeft, PACE_UNIT, todayISO } from '../utils/goals';
import ProgressBar from './ProgressBar';

interface OnboardingFlowProps {
  onComplete: (data: {
    userName: string;
    goal: {
      name: string;
      targetAmount: number;
      startingAmount: number;
      deadline: string | null;
    };
  }) => void;
  onCancel: () => void;
  paceMode?: PaceMode;
}

const PRESET_GOALS = [
  { label: '💻 New Laptop', name: 'MacBook Pro Fund', amount: 650000 },
  { label: '🛡️ Emergency Fund', name: 'Emergency Safety Net', amount: 300000 },
  { label: '✈️ Vacation Trip', name: 'Tokyo Trip', amount: 1200000 },
  { label: '🚗 Vehicle Downpayment', name: 'Car Savings', amount: 2000000 },
  { label: '🎓 Professional Course', name: 'Cloud Certification', amount: 150000 },
];

export default function OnboardingFlow({
  onComplete,
  onCancel,
  paceMode = 'monthly',
}: OnboardingFlowProps) {
  const today = todayISO();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form values
  const [userName, setUserName] = useState('');
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('500000');
  const [startingAmount, setStartingAmount] = useState('50000');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  // Calculations for live preview
  const numTarget = Number(targetAmount) || 0;
  const numStarting = Number(startingAmount) || 0;
  const progressRatio = numTarget > 0 ? Math.min(numStarting / numTarget, 1) : 0;
  const remaining = Math.max(numTarget - numStarting, 0);

  let pace: number | null = null;
  if (deadline && numTarget > 0) {
    const end = new Date(deadline).getTime();
    const now = new Date().getTime();
    const daysLeft = (end - now) / (1000 * 60 * 60 * 24);
    if (daysLeft > 0) {
      pace = Math.ceil(remaining / getPeriodsLeft(daysLeft, paceMode));
    }
  }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!userName.trim()) {
        setError('Please enter your name or nickname.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!goalName.trim()) {
        setError('Please choose or enter a goal name.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (numTarget <= 0) {
        setError('Target amount must be greater than 0.');
        return;
      }
      if (numStarting < 0) {
        setError('Starting amount cannot be negative.');
        return;
      }
      if (numStarting > numTarget) {
        setError('Starting amount cannot exceed target.');
        return;
      }

      onComplete({
        userName: userName.trim(),
        goal: {
          name: goalName.trim(),
          targetAmount: numTarget,
          startingAmount: numStarting,
          deadline: deadline || null,
        },
      });
    }
  }

  function handleSelectPreset(preset: typeof PRESET_GOALS[0]) {
    setGoalName(preset.name);
    setTargetAmount(String(preset.amount));
  }

  return (
    <div className="onboard-wrap">
      {/* Dynamic ambient mesh aurora background */}
      <div className="onboard-bg" aria-hidden="true">
        <div className="onboard-aurora onboard-aurora--1" />
        <div className="onboard-aurora onboard-aurora--2" />
        <div className="onboard-aurora onboard-aurora--3" />
        <div className="onboard-grid-pattern" />
      </div>

      <div className="onboard-card">
        {/* Left Side: Step Form */}
        <div className="onboard-panel onboard-panel--form">
          <div className="onboard-nav-row">
            <div className="auth-brand">
              <div className="auth-logo" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="auth-brand-name">Timex</span>
            </div>

            <button type="button" className="auth-back-btn" onClick={onCancel}>
              Exit onboarding
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="onboard-stepper" aria-label="Onboarding steps">
            <div className={`onboard-step-pill ${step >= 1 ? 'onboard-step-pill--active' : ''}`}>
              <span>1</span> Your Name
            </div>
            <div className={`onboard-step-pill ${step >= 2 ? 'onboard-step-pill--active' : ''}`}>
              <span>2</span> Your Goal
            </div>
            <div className={`onboard-step-pill ${step >= 3 ? 'onboard-step-pill--active' : ''}`}>
              <span>3</span> Target & Date
            </div>
          </div>

          <form className="onboard-form" onSubmit={handleNext} noValidate>
            {error && <div className="auth-error-banner">{error}</div>}

            {/* STEP 1: Name */}
            {step === 1 && (
              <div className="onboard-step-content">
                <span className="auth-badge">Step 1 of 3</span>
                <h1 className="onboard-title">Welcome to Timex!<br />What should we call you?</h1>
                <p className="onboard-sub">
                  Personalize your dashboard so you can track your savings with pride.
                </p>

                <div className="field">
                  <label htmlFor="onboard-name">Your Full Name or Nickname</label>
                  <input
                    id="onboard-name"
                    type="text"
                    placeholder="e.g. Timothy Dada"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    autoFocus
                    maxLength={50}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: First Goal Name */}
            {step === 2 && (
              <div className="onboard-step-content">
                <span className="auth-badge">Step 2 of 3</span>
                <h1 className="onboard-title">Hi {userName}!<br />What are you saving for?</h1>
                <p className="onboard-sub">
                  Choose a popular milestone target below or type your own custom goal name.
                </p>

                <div className="onboard-preset-group">
                  {PRESET_GOALS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`onboard-preset-chip ${goalName === preset.name ? 'onboard-preset-chip--selected' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="field">
                  <label htmlFor="onboard-goal-name">Goal Name</label>
                  <input
                    id="onboard-goal-name"
                    type="text"
                    placeholder="e.g. MacBook Pro M3 Fund"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    autoFocus
                    maxLength={60}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Target & Timeline */}
            {step === 3 && (
              <div className="onboard-step-content">
                <span className="auth-badge">Step 3 of 3</span>
                <h1 className="onboard-title">Define your target & pace</h1>
                <p className="onboard-sub">
                  Set how much you need for <strong>{goalName}</strong> and your desired deadline.
                </p>

                <div className="field">
                  <label htmlFor="onboard-target">Target Amount (₦)</label>
                  <input
                    id="onboard-target"
                    type="number"
                    min="1"
                    step="1000"
                    placeholder="500000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="field">
                  <label htmlFor="onboard-starting">Already Saved (Optional starting balance)</label>
                  <input
                    id="onboard-starting"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="onboard-deadline">Deadline (Optional)</label>
                  <input
                    id="onboard-deadline"
                    type="date"
                    min={today}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="onboard-actions">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setStep((step - 1) as 1 | 2);
                    setError('');
                  }}
                >
                  ← Back
                </button>
              )}
              <button type="submit" className="btn btn--primary onboard-submit-btn">
                {step < 3 ? 'Continue →' : 'Launch My Dashboard 🚀'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Live Real-Time Goal Card Preview */}
        <div className="onboard-panel onboard-panel--preview">
          <div className="onboard-preview-wrap">
            <div className="onboard-preview-header">
              <span className="auth-badge">Live Goal Card Preview</span>
              <span className="onboard-preview-user">
                {userName ? `Owner: ${userName}` : 'Owner: You'}
              </span>
            </div>

            <article className="card onboard-preview-card">
              <header className="card__head">
                <h2 className="card__name">{goalName || 'Your First Goal'}</h2>
                <span className="badge badge--on-track">On track</span>
              </header>

              <p className="card__amount">
                <span className="card__saved">{formatMoney(numStarting)}</span>
                <span className="card__target">of {formatMoney(numTarget || 500000)}</span>
                <span className="card__pct">{Math.round(progressRatio * 100)}%</span>
              </p>

              <ProgressBar
                value={progressRatio}
                status="on-track"
                label="Onboarding goal preview"
              />

              <footer className="card__foot">
                {pace ? (
                  <span>Save {formatMoney(pace)} a {PACE_UNIT[paceMode]} to finish on time.</span>
                ) : (
                  <span>{formatMoney(remaining)} to go.</span>
                )}
                {deadline ? <span>By {deadline}</span> : <span>No deadline</span>}
              </footer>

              <div className="card__actions">
                <div className="card__btn-add" style={{ pointerEvents: 'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add</span>
                </div>
                <div className="card__actions-group" style={{ pointerEvents: 'none' }}>
                  <div className="card__icon-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div className="card__icon-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                  </div>
                </div>
              </div>
            </article>

            <div className="onboard-tip-card">
              <span className="onboard-tip-icon">💡</span>
              <p className="onboard-tip-text">
                Your goal updates dynamically on the dashboard. You can add money, log withdrawals, or edit details at any time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
