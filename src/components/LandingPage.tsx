import { useState, useEffect } from 'react';
import { formatMoney } from '../utils/goals';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreDashboard: () => void;
}

export default function LandingPage({
  onGetStarted,
  onSignIn,
  onExploreDashboard,
}: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  const [scrolled, setScrolled] = useState(false);

  // Interactive Live Pacing Demo in "Why it works" Bento
  const presetGoals = [
    { id: 'tech', label: '💻 MacBook Pro', target: 650000, desc: 'High-performance gear' },
    { id: 'car', label: '🚗 Car Down Payment', target: 2400000, desc: 'Commute with freedom' },
    { id: 'emergency', label: '🛡️ Emergency Buffer', target: 900000, desc: '6 months living expenses' },
    { id: 'vacation', label: '✈️ Zanzibar Holiday', target: 450000, desc: 'Year-end tropical break' },
  ];
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [demoMonths, setDemoMonths] = useState<number>(10);
  const [guiltFreeActive, setGuiltFreeActive] = useState<boolean>(false);

  const currentPreset = presetGoals[selectedPresetIndex];
  const demoTarget = currentPreset.target;
  const demoPace = Math.round(demoTarget / demoMonths);
  const demoWeekly = Math.round(demoPace / 4.33);
  const demoDaily = Math.round(demoPace / 30);

  // Interactive Hobbes-style Stage in "3 Simple Steps"
  const [activeStep, setActiveStep] = useState<number>(1);
  const [step1Category, setStep1Category] = useState<'laptop' | 'travel' | 'rainy' | 'rent'>('laptop');
  const [step2Months, setStep2Months] = useState<number>(12);
  const [step3Deposited, setStep3Deposited] = useState<boolean>(false);

  const step1Presets = {
    laptop: { title: 'MacBook Pro 16" M3', target: 650000, category: 'Tech & Work', icon: '💻', note: 'Essential creator upgrade' },
    travel: { title: 'Trip to Tokyo & Kyoto', target: 1400000, category: 'Adventure', icon: '✈️', note: '2 weeks cherry blossom tour' },
    rainy: { title: 'Peace-of-Mind Buffer', target: 800000, category: 'Safety Net', icon: '🛡️', note: 'Unforeseen car / health buffer' },
    rent: { title: 'Next Year Flat Deposit', target: 2100000, category: 'Housing', icon: '🏡', note: 'Annual upfront lease' },
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      category: 'general',
      q: 'How does Timex calculate my monthly savings?',
      a: 'Just set your target amount and a deadline date. Timex automatically divides the remaining amount by the months left, updating every day so you always know your exact monthly number.',
    },
    {
      category: 'privacy',
      q: 'Is my money data safe and private?',
      a: '100% yes. Timex works local-first. Your financial goals and records stay strictly inside your browser on your own device. We never sell your numbers or spam you with ads.',
    },
    {
      category: 'tracking',
      q: 'Can I save without setting a deadline?',
      a: 'Yes! Deadlines are totally optional. If you just want an open-ended piggy bank for something down the line, Timex tracks your total progress and percentage at your own pace.',
    },
    {
      category: 'tracking',
      q: 'What if I need to take money out for an emergency?',
      a: 'You can log both deposits and withdrawals anytime. Timex keeps a clean history of every change and updates your running balance and monthly pace automatically.',
    },
    {
      category: 'general',
      q: 'Is Timex free to use?',
      a: 'Yes, Timex is completely free forever. No subscriptions, no hidden fees, and no credit card required.',
    },
  ];

  const filteredFaqs =
    activeFaqCategory === 'all'
      ? faqs
      : faqs.filter((f) => f.category === activeFaqCategory);

  return (
    <div className="landing">
      {/* Hand-drawn pencil-line scribbles along the white page margins only */}
      <div className="landing-side-scribbles" aria-hidden="true">
        {/* Left margin pencil lines */}
        <div className="side-scribbles side-scribbles--left">
          {/* Continuous organic pencil margin stroke 1 */}
          <svg className="pencil-scribble pencil-scribble--1" width="40" height="280" viewBox="0 0 40 280" fill="none">
            <path d="M22 6C16 48 30 76 18 116C7 154 28 192 14 232C6 254 20 274 15 278" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2 12 3 6 4" opacity="0.32"/>
            <path d="M25 24C19 62 31 92 20 134C11 172 26 210 17 248" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" opacity="0.22"/>
          </svg>

          {/* Pencil loop / curly scribble */}
          <svg className="pencil-scribble pencil-scribble--2" width="48" height="180" viewBox="0 0 48 180" fill="none">
            <path d="M20 10C35 25 38 42 22 50C6 58 8 36 26 30C40 26 44 68 28 85C12 102 8 82 24 74C40 66 42 110 26 128C10 146 12 165 24 175" stroke="#2563eb" strokeWidth="1.1" strokeLinecap="round" opacity="0.28"/>
          </svg>

          {/* Pencil tick marks & measurement hashes */}
          <svg className="pencil-scribble pencil-scribble--3" width="32" height="220" viewBox="0 0 32 220" fill="none">
            <line x1="6" y1="18" x2="26" y2="15" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
            <line x1="10" y1="38" x2="24" y2="36" stroke="#3b82f6" strokeWidth="0.9" strokeLinecap="round" opacity="0.25"/>
            <line x1="8" y1="58" x2="28" y2="54" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
            <line x1="12" y1="78" x2="22" y2="76" stroke="#3b82f6" strokeWidth="0.9" strokeLinecap="round" opacity="0.25"/>
            <line x1="6" y1="98" x2="26" y2="95" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
            <line x1="10" y1="118" x2="25" y2="116" stroke="#3b82f6" strokeWidth="0.9" strokeLinecap="round" opacity="0.25"/>
            <line x1="7" y1="138" x2="27" y2="135" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
            <line x1="11" y1="158" x2="23" y2="156" stroke="#3b82f6" strokeWidth="0.9" strokeLinecap="round" opacity="0.25"/>
            <line x1="8" y1="178" x2="28" y2="175" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
            <line x1="6" y1="198" x2="24" y2="195" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
          </svg>

          {/* Pencil zigzag coil */}
          <svg className="pencil-scribble pencil-scribble--4" width="36" height="240" viewBox="0 0 36 240" fill="none">
            <path d="M12 10L24 35L8 60L26 88L10 118L24 148L8 178L26 208L12 232" stroke="#2563eb" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.26"/>
          </svg>
        </div>

        {/* Right margin pencil lines */}
        <div className="side-scribbles side-scribbles--right">
          {/* Continuous organic wavy pencil line */}
          <svg className="pencil-scribble pencil-scribble--5" width="40" height="300" viewBox="0 0 40 300" fill="none">
            <path d="M18 10C26 50 12 85 24 125C34 165 14 205 26 245C34 270 20 290 22 295" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 2 10 3" opacity="0.3"/>
            <path d="M14 28C22 68 10 102 20 142C30 180 12 218 22 258" stroke="#60a5fa" strokeWidth="0.8" strokeLinecap="round" opacity="0.2"/>
          </svg>

          {/* Pencil looped spring */}
          <svg className="pencil-scribble pencil-scribble--6" width="44" height="200" viewBox="0 0 44 200" fill="none">
            <path d="M22 10C10 24 8 40 22 48C36 54 34 35 18 30C6 26 6 66 20 80C34 94 32 76 18 70C6 64 6 104 20 120C34 136 32 154 18 168C8 178 12 192 20 195" stroke="#2563eb" strokeWidth="1.1" strokeLinecap="round" opacity="0.28"/>
          </svg>

          {/* Pencil cross-hatch marks */}
          <svg className="pencil-scribble pencil-scribble--7" width="36" height="220" viewBox="0 0 36 220" fill="none">
            <line x1="8" y1="20" x2="28" y2="17" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
            <line x1="26" y1="20" x2="10" y2="17" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" opacity="0.2"/>
            <line x1="10" y1="60" x2="26" y2="57" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" opacity="0.32"/>
            <line x1="8" y1="100" x2="28" y2="97" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
            <line x1="27" y1="100" x2="9" y2="97" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" opacity="0.2"/>
            <line x1="10" y1="140" x2="26" y2="137" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" opacity="0.32"/>
            <line x1="8" y1="180" x2="28" y2="177" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
            <line x1="26" y1="180" x2="10" y2="177" stroke="#3b82f6" strokeWidth="0.8" strokeLinecap="round" opacity="0.2"/>
          </svg>

          {/* Pencil spiral gesture */}
          <svg className="pencil-scribble pencil-scribble--8" width="46" height="220" viewBox="0 0 46 220" fill="none">
            <path d="M26 15C12 30 10 55 24 70C38 85 40 108 26 125C12 142 14 165 28 180C38 192 36 210 24 215" stroke="#2563eb" strokeWidth="1.1" strokeLinecap="round" opacity="0.26"/>
          </svg>
        </div>
      </div>
      {/* Sticky Navigation Bar with dynamic transparency at top */}
      <header className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : 'landing-nav--top'}`}>
        <div className="landing-nav__inner">
          <div className="landing-nav__brand" onClick={onExploreDashboard} role="button" tabIndex={0}>
            <div className="landing-nav__logo" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="landing-nav__title">Timex</span>
          </div>

          <nav className="landing-nav__links">
            <a href="#features">Features</a>
            <a href="#workflow">How It Works</a>
            <a href="#stories">Stories</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="landing-nav__actions">
            <button type="button" className="btn btn--ghost btn--small landing-nav__login-btn" onClick={onSignIn}>
              Log in
            </button>
            <button type="button" className="btn btn--primary btn--small" onClick={onGetStarted}>
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Immersive Hero Section */}
      <section className="landing-hero">
        {/* Hero Background Image with Overlay */}
        <div className="landing-hero__bg" aria-hidden="true">
          <div className="landing-hero__img-overlay" />
        </div>

        {/* Hero Content */}
        <div className="landing-hero__container">
          <div className="landing-hero__text-block">
            <h1 className="landing-hero__title">
              Save for what you love.<br />
              Without the stress.
            </h1>

            <p className="landing-hero__subtitle">
              Timex tells you the exact amount to put aside every month to reach your goals on time.
              No messy budgets, no annoying ads, and no confusing spreadsheets.
            </p>

            <div className="landing-hero__cta-group">
              <button type="button" className="btn btn--primary landing-btn-hero" onClick={onGetStarted}>
                <span>Start Saving in 60 Seconds</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button type="button" className="btn btn--ghost landing-btn-hero" onClick={onExploreDashboard}>
                Explore Live Demo
              </button>
            </div>
          </div>

          {/* Realistic App Window Mockup inside Hero */}
          <div className="landing-mockup-frame">
            <div className="landing-mockup-header">
              <div className="landing-mockup-dots" aria-hidden="true">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
              </div>
              <div className="landing-mockup-url">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>timex.app/dashboard</span>
              </div>
              <div className="landing-mockup-status">● Live</div>
            </div>

            <div className="landing-mockup-screen">
              <div className="landing-mockup-stats">
                <div className="landing-mockup-stat">
                  <span className="landing-mockup-stat__label">Total Saved</span>
                  <div className="landing-mockup-stat__val-row">
                    <span className="landing-mockup-stat__num">₦1,070,000</span>
                    <span className="landing-mockup-tag">75%</span>
                  </div>
                </div>

                <div className="landing-mockup-stat">
                  <span className="landing-mockup-stat__label">All Goals Target</span>
                  <div className="landing-mockup-stat__val-row">
                    <span className="landing-mockup-stat__num">₦1,420,000</span>
                  </div>
                </div>

                <div className="landing-mockup-stat">
                  <span className="landing-mockup-stat__label">Goals Status</span>
                  <div className="landing-mockup-stat__val-row">
                    <span className="landing-mockup-stat__num">3 Active</span>
                    <span className="badge badge--on-track">On Track</span>
                  </div>
                </div>
              </div>

              <div className="landing-mockup-cards">
                <div className="landing-mockup-card">
                  <div className="landing-mockup-card__head">
                    <strong className="landing-mockup-card__title">MacBook Pro 16" Fund</strong>
                    <span className="badge badge--on-track">On track</span>
                  </div>
                  <div className="landing-mockup-card__amounts">
                    <strong>₦550,000</strong>
                    <span>of ₦650,000</span>
                    <span className="card__pct">85%</span>
                  </div>
                  <div className="bar bar--on-track">
                    <div className="bar__fill" style={{ width: '85%' }} />
                    <span className="bar__tick" style={{ left: '25%' }} />
                    <span className="bar__tick" style={{ left: '50%' }} />
                    <span className="bar__tick" style={{ left: '75%' }} />
                  </div>
                  <div className="landing-mockup-card__foot">
                    <span>Save ₦50,000 a month to finish on time.</span>
                    <span>By Mar 31, 2027</span>
                  </div>
                </div>

                <div className="landing-mockup-card">
                  <div className="landing-mockup-card__head">
                    <strong className="landing-mockup-card__title">Emergency Buffer</strong>
                    <span className="badge badge--completed">Goal reached</span>
                  </div>
                  <div className="landing-mockup-card__amounts">
                    <strong>₦300,000</strong>
                    <span>of ₦300,000</span>
                    <span className="card__pct" style={{ color: 'var(--green)' }}>100%</span>
                  </div>
                  <div className="bar bar--completed">
                    <div className="bar__fill" style={{ width: '100%' }} />
                    <span className="bar__tick" style={{ left: '25%' }} />
                    <span className="bar__tick" style={{ left: '50%' }} />
                    <span className="bar__tick" style={{ left: '75%' }} />
                  </div>
                  <div className="landing-mockup-card__foot">
                    <span>Target reached! Milestone completed.</span>
                    <span>100% safe</span>
                  </div>
                </div>
              </div>

              <div className="landing-mockup-toast">
                <span className="landing-mockup-toast__icon">🎉</span>
                <div className="landing-mockup-toast__text">
                  <strong>Deposited ₦50,000 to MacBook Fund</strong>
                  <span>2 minutes ago · Running balance updated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="landing-proof">
        <p className="landing-proof__label">Trusted by over 12,000 people who save with purpose</p>
        <div className="landing-proof__metrics">
          <div className="landing-proof__item">
            <span className="landing-proof__stat">₦45,000,000+</span>
            <span className="landing-proof__desc">Saved towards real dreams</span>
          </div>
          <div className="landing-proof__divider" />
          <div className="landing-proof__item">
            <span className="landing-proof__stat">94%</span>
            <span className="landing-proof__desc">Finish goals on schedule</span>
          </div>
          <div className="landing-proof__divider" />
          <div className="landing-proof__item">
            <span className="landing-proof__stat">0%</span>
            <span className="landing-proof__desc">Ads, spam or locked features</span>
          </div>
        </div>
      </section>

      {/* Philosophy / Simple Manifesto */}
      <section className="landing-manifesto">
        <div className="landing-container">
          <span className="landing-section-tag">THE TIMEX WAY</span>
          <h2 className="landing-manifesto__heading">
            Most savings apps fail because they make you feel bad.
          </h2>
          <p className="landing-manifesto__text">
            They drown you in 40 spending categories, alert you every time you buy coffee, and show red warnings everywhere.
            Timex is different. We don't judge your spending. We simply help you set aside money for the things you care about most, and cheer you on as you cross the finish line.
          </p>
        </div>
      </section>

      {/* =====================================================================
          ENHANCED "WHY IT WORKS" (Bento Showcase with Interactive Simulator)
          ===================================================================== */}
      <section id="features" className="landing-features">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">WHY IT WORKS</span>
            <h2 className="landing-section-title">The science of effortless, guilt-free saving</h2>
            <p className="landing-section-sub">
              Big financial dreams feel overwhelming until they are split into gentle, predictable daily habits.
            </p>
          </div>

          <div className="landing-bento-grid">
            {/* Flagship Card: Interactive Monthly Pacing Engine */}
            <article className="landing-bento-card landing-bento-card--flagship">
              <div className="landing-bento-card__main-info">
                <div className="landing-bento-card__badge-icon landing-bento-card__badge-icon--blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="landing-bento-card__title">Dynamic Target & Pace Engine</h3>
                <p className="landing-bento-card__desc">
                  Never guess if you're saving enough. Pick any goal and deadline, and Timex calculates your exact monthly, weekly, and daily pace — recalibrating calmly every sunrise.
                </p>

                {/* Preset Goals Selector */}
                <div className="landing-bento-presets">
                  <span className="landing-bento-presets__label">Test with real targets:</span>
                  <div className="landing-bento-presets__list">
                    {presetGoals.map((g, idx) => (
                      <button
                        key={g.id}
                        type="button"
                        className={`landing-preset-btn ${selectedPresetIndex === idx ? 'active' : ''}`}
                        onClick={() => setSelectedPresetIndex(idx)}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Calculator UI Widget inside the Card */}
              <div className="landing-bento-interactive-calc">
                <div className="landing-bento-calc__head">
                  <div>
                    <span className="landing-bento-calc__label">Target for {currentPreset.label}</span>
                    <strong className="landing-bento-calc__target">{formatMoney(demoTarget)}</strong>
                  </div>
                  <span className="landing-bento-calc__hint">Interactive Demo 👇</span>
                </div>

                <div className="landing-bento-calc__selector">
                  <span className="landing-bento-calc__pick-label">Select timeline:</span>
                  <div className="landing-bento-calc__pills">
                    {[3, 6, 10, 12].map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`landing-calc-pill ${demoMonths === m ? 'active' : ''}`}
                        onClick={() => setDemoMonths(m)}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-Tier Dynamic Pace Breakdown */}
                <div className="landing-bento-pace-metrics">
                  <div className="landing-pace-metric-item landing-pace-metric-item--primary">
                    <span className="landing-pace-metric-item__icon">📅</span>
                    <div className="landing-pace-metric-item__info">
                      <span className="landing-pace-metric-item__label">Monthly Pace</span>
                      <strong className="landing-pace-metric-item__val">{formatMoney(demoPace)}</strong>
                      <span className="landing-pace-metric-item__sub">per month</span>
                    </div>
                  </div>
                  <div className="landing-pace-metric-item">
                    <span className="landing-pace-metric-item__icon">📆</span>
                    <div className="landing-pace-metric-item__info">
                      <span className="landing-pace-metric-item__label">Weekly Pace</span>
                      <strong className="landing-pace-metric-item__val">{formatMoney(demoWeekly)}</strong>
                      <span className="landing-pace-metric-item__sub">per week</span>
                    </div>
                  </div>
                  <div className="landing-pace-metric-item">
                    <span className="landing-pace-metric-item__icon">☕</span>
                    <div className="landing-pace-metric-item__info">
                      <span className="landing-pace-metric-item__label">Daily Habit</span>
                      <strong className="landing-pace-metric-item__val">{formatMoney(demoDaily)}</strong>
                      <span className="landing-pace-metric-item__sub">less than a coffee</span>
                    </div>
                  </div>
                </div>

                {/* Milestone Progression Track */}
                <div className="landing-bento-milestone-preview">
                  <div className="landing-bento-milestone-track">
                    <div className="milestone-chip reached">
                      <span>✓ 25%</span>
                    </div>
                    <div className="milestone-chip reached">
                      <span>✓ 50%</span>
                    </div>
                    <div className="milestone-chip active">
                      <span>● 75%</span>
                    </div>
                    <div className="milestone-chip">
                      <span>🏆 100%</span>
                    </div>
                  </div>
                  <div className="bar bar--on-track">
                    <div className="bar__fill" style={{ width: '75%' }} />
                    <span className="bar__tick" style={{ left: '25%' }} />
                    <span className="bar__tick" style={{ left: '50%' }} />
                    <span className="bar__tick" style={{ left: '75%' }} />
                  </div>
                  <div className="landing-bento-calc__foot">
                    <span className="badge badge--on-track">✓ Smoothly achievable on this schedule</span>
                    <span className="landing-bento-calc__recal-text">Updated daily</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Feature 2: Gentle Zero-Guilt Recalibration */}
            <article className="landing-bento-card">
              <div className="landing-bento-card__badge-icon landing-bento-card__badge-icon--green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
              <h3 className="landing-bento-card__title">Zero-guilt recalibration</h3>
              <p className="landing-bento-card__desc">
                Life happens. If you miss a deposit or have an unexpected bill, Timex never penalizes or shames you. It quietly spreads the difference across your remaining time.
              </p>

              {/* Interactive Guilt-Free Simulator */}
              <div className="landing-bento-guilt-simulator">
                <div className="landing-guilt-simulator__head">
                  <span className="landing-guilt-simulator__label">Test unexpected expenses:</span>
                  <button
                    type="button"
                    className={`landing-guilt-toggle ${guiltFreeActive ? 'active' : ''}`}
                    onClick={() => setGuiltFreeActive(!guiltFreeActive)}
                  >
                    {guiltFreeActive ? 'Simulating: Missed month' : 'Simulate: Missed month'}
                  </button>
                </div>

                <div className="landing-guilt-simulator__body">
                  <div className="landing-guilt-row">
                    <span className="landing-guilt-row__label">Standard pace:</span>
                    <strong>₦50,000 / mo</strong>
                  </div>
                  <div className="landing-guilt-row landing-guilt-row--result">
                    <span className="landing-guilt-row__label">Calmly adjusted pace:</span>
                    <strong>{guiltFreeActive ? '₦55,500 / mo' : '₦50,000 / mo'}</strong>
                  </div>
                </div>

                <div className="landing-guilt-simulator__tag">
                  <span className="pulse-green" />
                  <span>{guiltFreeActive ? 'Zero red alerts. Re-paced smoothly.' : 'No penalties, no shame.'}</span>
                </div>
              </div>
            </article>

            {/* Feature 3: Hardware-Grade Privacy (Zero Cloud Telemetry) */}
            <article className="landing-bento-card">
              <div className="landing-bento-card__badge-icon landing-bento-card__badge-icon--amber">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="landing-bento-card__title">100% on-device local vault</h3>
              <p className="landing-bento-card__desc">
                Your money is strictly your business. Timex stores your data directly in your browser. No bank logins required, no cloud tracking, and works completely offline.
              </p>

              {/* Vault Security Checklist Widget */}
              <div className="landing-bento-preview landing-bento-preview--vault">
                <div className="landing-vault-box">
                  <div className="landing-vault-status">
                    <span className="pulse-green" />
                    <strong>Local Encrypted Sandbox</strong>
                  </div>
                  <span className="landing-vault-tag">0 External Cookies</span>
                </div>
                <div className="landing-vault-checklist">
                  <div className="landing-vault-check-item">
                    <span className="check-mark">✓</span>
                    <span>Zero bank passwords or API credentials</span>
                  </div>
                  <div className="landing-vault-check-item">
                    <span className="check-mark">✓</span>
                    <span>Instant offline mode with zero server lag</span>
                  </div>
                  <div className="landing-vault-check-item">
                    <span className="check-mark">✓</span>
                    <span>Zero telemetry, ads, or data resale</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ENHANCED "3 SIMPLE STEPS" (Interactive Hobbes-Inspired Simulation Theater)
          ===================================================================== */}
      <section id="workflow" className="landing-workflow">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">THE 3-STEP JOURNEY</span>
            <h2 className="landing-section-title">From wish to reality in 3 simple steps</h2>
            <p className="landing-section-sub">
              No complex accounting or confusing spreadsheets. Click each step below to test drive the process.
            </p>
          </div>

          {/* Hobbes-Style Stepper Navigation Bar */}
          <div className="landing-stepper-nav" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 1}
              className={`landing-stepper-tab ${activeStep === 1 ? 'landing-stepper-tab--active' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              <div className="landing-stepper-tab__num">01</div>
              <div className="landing-stepper-tab__content">
                <strong className="landing-stepper-tab__title">1. Name Your Dream</strong>
                <span className="landing-stepper-tab__sub">Define your target & purpose</span>
              </div>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 2}
              className={`landing-stepper-tab ${activeStep === 2 ? 'landing-stepper-tab--active' : ''}`}
              onClick={() => setActiveStep(2)}
            >
              <div className="landing-stepper-tab__num">02</div>
              <div className="landing-stepper-tab__content">
                <strong className="landing-stepper-tab__title">2. Get Your Calm Pace</strong>
                <span className="landing-stepper-tab__sub">Auto-split into easy monthly chunks</span>
              </div>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 3}
              className={`landing-stepper-tab ${activeStep === 3 ? 'landing-stepper-tab--active' : ''}`}
              onClick={() => setActiveStep(3)}
            >
              <div className="landing-stepper-tab__num">03</div>
              <div className="landing-stepper-tab__content">
                <strong className="landing-stepper-tab__title">3. Deposit & Celebrate</strong>
                <span className="landing-stepper-tab__sub">Fill your bar and cross the finish line</span>
              </div>
            </button>
          </div>

          {/* Interactive Dynamic Simulation Theater Canvas */}
          <div className="landing-step-stage">
            <div className="landing-step-stage__header">
              <div className="landing-step-stage__dots" aria-hidden="true">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
              </div>
              <div className="landing-step-stage__label">
                <span>Interactive Simulation</span> · Step {activeStep} of 3
              </div>
              <div className="landing-step-stage__nav-btns">
                <button
                  type="button"
                  className="landing-stage-nav-btn"
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  title="Previous Step"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="landing-stage-nav-btn"
                  disabled={activeStep === 3}
                  onClick={() => setActiveStep((prev) => Math.min(3, prev + 1))}
                  title="Next Step"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Stage Body - Changes Dynamically Per Step */}
            <div className="landing-step-stage__body">
              {/* STEP 1: Name Your Dream */}
              {activeStep === 1 && (
                <div className="landing-stage-content landing-stage-content--step1">
                  <div className="landing-stage-info">
                    <span className="landing-stage-tag">Step 1 — Clarity</span>
                    <h3 className="landing-stage-heading">Give your dream an inspiring identity</h3>
                    <p className="landing-stage-text">
                      Saving is emotional, not just mathematical. When your money has a name, purpose, and visual icon, resisting impulsive spending becomes effortless.
                    </p>

                    <div className="landing-stage-picker">
                      <span className="landing-stage-picker__title">Choose a sample goal to test:</span>
                      <div className="landing-stage-chips">
                        {(['laptop', 'travel', 'rainy', 'rent'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            className={`stage-chip ${step1Category === cat ? 'active' : ''}`}
                            onClick={() => setStep1Category(cat)}
                          >
                            <span>{step1Presets[cat].icon}</span>
                            <span>{step1Presets[cat].title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Rendered Goal Card Preview */}
                  <div className="landing-stage-preview-card">
                    <div className="landing-stage-card-badge-row">
                      <span className="badge badge--open">{step1Presets[step1Category].category}</span>
                      <span className="badge badge--on-track">● Created just now</span>
                    </div>

                    <div className="landing-stage-card-title-row">
                      <span className="landing-stage-card-icon">{step1Presets[step1Category].icon}</span>
                      <div>
                        <h4 className="landing-stage-card-title">{step1Presets[step1Category].title}</h4>
                        <span className="landing-stage-card-sub">{step1Presets[step1Category].note}</span>
                      </div>
                    </div>

                    <div className="landing-stage-card-amounts">
                      <strong>₦0</strong>
                      <span>of {formatMoney(step1Presets[step1Category].target)}</span>
                      <span className="card__pct">0%</span>
                    </div>

                    <div className="bar bar--open">
                      <div className="bar__fill" style={{ width: '0%' }} />
                      <span className="bar__tick" style={{ left: '25%' }} />
                      <span className="bar__tick" style={{ left: '50%' }} />
                      <span className="bar__tick" style={{ left: '75%' }} />
                    </div>

                    <div className="landing-stage-card-foot">
                      <span>✓ Ready for pace calculation</span>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => setActiveStep(2)}
                      >
                        Proceed to Step 2 →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Let Timex Pace It */}
              {activeStep === 2 && (
                <div className="landing-stage-content landing-stage-content--step2">
                  <div className="landing-stage-info">
                    <span className="landing-stage-tag">Step 2 — Pace Calculation</span>
                    <h3 className="landing-stage-heading">Divide the mountain into peaceful months</h3>
                    <p className="landing-stage-text">
                      Pick your deadline date. Timex handles the math, accounting for remaining calendar days and projecting your exact monthly pacing.
                    </p>

                    <div className="landing-stage-picker">
                      <span className="landing-stage-picker__title">Adjust target duration:</span>
                      <div className="landing-stage-chips">
                        {[
                          { m: 6, label: '6 Months (Sprint)' },
                          { m: 12, label: '12 Months (Balanced)' },
                          { m: 18, label: '18 Months (Relaxed)' },
                        ].map((item) => (
                          <button
                            key={item.m}
                            type="button"
                            className={`stage-chip ${step2Months === item.m ? 'active' : ''}`}
                            onClick={() => setStep2Months(item.m)}
                          >
                            <span>🗓️ {item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Rendered Pacing Preview */}
                  <div className="landing-stage-preview-card">
                    <div className="landing-stage-card-badge-row">
                      <span className="badge badge--on-track">Pacing Active</span>
                      <span className="landing-stage-card-date">Target: Dec 31, 2026</span>
                    </div>

                    <div className="landing-stage-pace-highlight">
                      <span className="landing-stage-pace-highlight__label">Your Required Pace:</span>
                      <div className="landing-stage-pace-highlight__amount">
                        {formatMoney(Math.round(650000 / step2Months))}
                        <small> / month</small>
                      </div>
                      <span className="landing-stage-pace-highlight__sub">
                        Divided smoothly across {step2Months} stress-free deposits
                      </span>
                    </div>

                    <div className="landing-stage-timeline-track">
                      <div className="timeline-node">
                        <span className="timeline-node__dot">1</span>
                        <span className="timeline-node__txt">Start</span>
                      </div>
                      <div className="timeline-node">
                        <span className="timeline-node__dot">25%</span>
                        <span className="timeline-node__txt">Quarter</span>
                      </div>
                      <div className="timeline-node">
                        <span className="timeline-node__dot">50%</span>
                        <span className="timeline-node__txt">Halfway</span>
                      </div>
                      <div className="timeline-node">
                        <span className="timeline-node__dot">75%</span>
                        <span className="timeline-node__txt">Near</span>
                      </div>
                      <div className="timeline-node">
                        <span className="timeline-node__dot">🏆</span>
                        <span className="timeline-node__txt">Finish</span>
                      </div>
                    </div>

                    <div className="landing-stage-card-foot">
                      <span className="landing-stage-card-guarantee">✓ No compounding interest tricks</span>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => setActiveStep(3)}
                      >
                        Proceed to Step 3 →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Deposit & Celebrate */}
              {activeStep === 3 && (
                <div className="landing-stage-content landing-stage-content--step3">
                  <div className="landing-stage-info">
                    <span className="landing-stage-tag">Step 3 — Victory</span>
                    <h3 className="landing-stage-heading">Feel the adrenaline of reaching 100%</h3>
                    <p className="landing-stage-text">
                      Tap “+ Add” whenever money goes into your savings. Watch your progress bar fill up in real time, unlock milestone checkpoints, and hit your goal!
                    </p>

                    <div className="landing-stage-interactive-cta">
                      {!step3Deposited ? (
                        <button
                          type="button"
                          className="btn btn--primary landing-btn-interactive-deposit"
                          onClick={() => setStep3Deposited(true)}
                        >
                          <span>👉 Click to Deposit Final ₦100,000</span>
                        </button>
                      ) : (
                        <div className="landing-stage-deposit-done">
                          <span className="badge badge--completed">🎉 Deposit Recorded!</span>
                          <button
                            type="button"
                            className="btn btn--ghost btn--sm"
                            onClick={() => setStep3Deposited(false)}
                          >
                            ↺ Restart
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Rendered Goal Card with Active Celebration */}
                  <div className={`landing-stage-preview-card ${step3Deposited ? 'landing-stage-preview-card--celebrate' : ''}`}>
                    <div className="landing-stage-card-badge-row">
                      <strong className="landing-stage-card-goal-name">MacBook Pro 16" Fund</strong>
                      <span className={`badge ${step3Deposited ? 'badge--completed' : 'badge--on-track'}`}>
                        {step3Deposited ? '🎉 Goal reached!' : '85% On track'}
                      </span>
                    </div>

                    <div className="landing-stage-card-amounts">
                      <strong>{step3Deposited ? '₦650,000' : '₦550,000'}</strong>
                      <span>of ₦650,000</span>
                      <span className="card__pct" style={{ color: step3Deposited ? 'var(--green)' : 'var(--blue)' }}>
                        {step3Deposited ? '100%' : '85%'}
                      </span>
                    </div>

                    <div className={`bar ${step3Deposited ? 'bar--completed' : 'bar--on-track'}`}>
                      <div
                        className="bar__fill"
                        style={{
                          width: step3Deposited ? '100%' : '85%',
                          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                      <span className="bar__tick" style={{ left: '25%' }} />
                      <span className="bar__tick" style={{ left: '50%' }} />
                      <span className="bar__tick" style={{ left: '75%' }} />
                    </div>

                    {step3Deposited ? (
                      <div className="landing-stage-victory-banner">
                        <span className="victory-icon">🏆</span>
                        <div>
                          <strong>Goal Successfully Completed!</strong>
                          <span>Your MacBook Pro is 100% funded with zero debt.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="landing-stage-card-foot">
                        <span>Save ₦50,000 / mo to finish on schedule.</span>
                        <span className="badge badge--open">1 deposit left</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stories / Testimonials — Enhanced Premium Design */}
      <section id="stories" className="landing-stories">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">REAL STORIES</span>
            <h2 className="landing-section-title">How intentional savers win with Timex</h2>
            <p className="landing-section-sub">
              Real people hitting their financial milestones without anxiety.
            </p>
          </div>

          <div className="landing-stories-grid">
            {/* Featured / Highlighted Card */}
            <article className="landing-story-card landing-story-card--featured">
              <div className="landing-story-card__inner">
                <div className="landing-story-card__quote-mark" aria-hidden="true">“</div>
                <div className="landing-story-stars">★★★★★</div>
                <p className="landing-story-quote">
                  “I always spent extra cash as soon as it hit my account. Timex made my laptop fund feel real. I hit my ₦650k target two weeks early and bought my laptop cash!”
                </p>
                <div className="landing-story-result">
                  <span className="landing-story-result__icon">🎯</span>
                  <span>Reached goal <strong>2 weeks early</strong></span>
                </div>
                <div className="landing-story-author">
                  <div className="landing-story-avatar landing-story-avatar--1">TD</div>
                  <div className="landing-story-author__meta">
                    <strong className="landing-story-name">Timothy Dada</strong>
                    <span className="landing-story-role">Software Developer</span>
                  </div>
                  <span className="landing-story-tag">₦650k Laptop</span>
                </div>
              </div>
            </article>

            <article className="landing-story-card">
              <div className="landing-story-card__inner">
                <div className="landing-story-card__quote-mark" aria-hidden="true">“</div>
                <div className="landing-story-stars">★★★★★</div>
                <p className="landing-story-quote">
                  “Most money apps try to make me feel guilty for buying food. Timex simply shows me my monthly progress. Seeing the 50% milestone tick gave me so much momentum.”
                </p>
                <div className="landing-story-result">
                  <span className="landing-story-result__icon">📈</span>
                  <span>Built a <strong>₦1.2M safety net</strong></span>
                </div>
                <div className="landing-story-author">
                  <div className="landing-story-avatar landing-story-avatar--2">AO</div>
                  <div className="landing-story-author__meta">
                    <strong className="landing-story-name">Amara Okafor</strong>
                    <span className="landing-story-role">Product Designer</span>
                  </div>
                  <span className="landing-story-tag">₦1.2M Emergency</span>
                </div>
              </div>
            </article>

            <article className="landing-story-card">
              <div className="landing-story-card__inner">
                <div className="landing-story-card__quote-mark" aria-hidden="true">“</div>
                <div className="landing-story-stars">★★★★★</div>
                <p className="landing-story-quote">
                  “Clean, quiet, and fast. No annoying popups or loan offers. Just me and my Tokyo trip goal. Best financial decision I made this year.”
                </p>
                <div className="landing-story-result">
                  <span className="landing-story-result__icon">✈️</span>
                  <span>Funded a <strong>dream vacation</strong></span>
                </div>
                <div className="landing-story-author">
                  <div className="landing-story-avatar landing-story-avatar--3">KB</div>
                  <div className="landing-story-author__meta">
                    <strong className="landing-story-name">Korede Balogun</strong>
                    <span className="landing-story-role">Startup Founder</span>
                  </div>
                  <span className="landing-story-tag">₦3M Vacation</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Enhanced FAQs with Interactive Filter & Smooth Animations */}
      <section id="faq" className="landing-faq">
        <div className="landing-container landing-container--sm">
          <div className="landing-section-header">
            <span className="landing-section-tag">COMMON QUESTIONS</span>
            <h2 className="landing-section-title">Everything you need to know</h2>
            <p className="landing-section-sub">
              Simple, clear answers to common questions about Timex.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="landing-faq-filters" role="tablist">
            <button
              type="button"
              className={`landing-faq-pill ${activeFaqCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFaqCategory('all')}
            >
              All Questions
            </button>
            <button
              type="button"
              className={`landing-faq-pill ${activeFaqCategory === 'general' ? 'active' : ''}`}
              onClick={() => setActiveFaqCategory('general')}
            >
              Getting Started
            </button>
            <button
              type="button"
              className={`landing-faq-pill ${activeFaqCategory === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveFaqCategory('privacy')}
            >
              Privacy & Security
            </button>
            <button
              type="button"
              className={`landing-faq-pill ${activeFaqCategory === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveFaqCategory('tracking')}
            >
              Tracking Goals
            </button>
          </div>

          {/* Animated Accordion List */}
          <div className="landing-faq-accordion">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`landing-faq-row ${isOpen ? 'landing-faq-row--open' : ''}`}
                >
                  <button
                    type="button"
                    className="landing-faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="landing-faq-trigger__question">{faq.q}</span>
                    <span className={`landing-faq-trigger__icon ${isOpen ? 'rotate' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  <div className="landing-faq-collapse">
                    <div className="landing-faq-collapse__inner">
                      <p className="landing-faq-answer">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA + Footer Wrapper — shared deep blue aurora background */}
      <div className="landing-cta-footer-wrap">
        {/* Abstract blue aurora gradient backdrop */}
        <div className="landing-cta-aurora-bg" aria-hidden="true">
          <div className="cta-aurora-layer cta-aurora-layer--1" />
          <div className="cta-aurora-layer cta-aurora-layer--2" />
          <div className="cta-aurora-layer cta-aurora-layer--3" />
          <div className="cta-aurora-noise" />
        </div>

        {/* CTA Section */}
        <section className="landing-cta-banner">
          <div className="landing-container">
            <div className="landing-cta-content">
              <h2 className="landing-cta-banner__title">
                Your next big milestone starts with your first deposit.
              </h2>
              <p className="landing-cta-banner__sub">
                No complicated spreadsheets. No advertisements. Just a calm, beautiful space to watch your savings grow.
              </p>

              <div className="landing-cta-banner__actions">
                <button type="button" className="btn btn--primary landing-btn-hero landing-btn-hero--cta" onClick={onGetStarted}>
                  <span>Create Your First Goal in 60s →</span>
                </button>
                <button type="button" className="btn btn--ghost landing-btn-hero" onClick={onExploreDashboard}>
                  <span>Open Live Dashboard</span>
                </button>
              </div>

              <div className="landing-cta-perks">
                <span className="landing-cta-perk">✓ 100% Free Forever</span>
                <span className="landing-cta-perk">✓ No Credit Card Needed</span>
                <span className="landing-cta-perk">✓ Private & Stored on Device</span>
                <span className="landing-cta-perk">✓ Works Offline Anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer — Ironclad Labs-inspired multi-column layout */}
        <footer className="landing-footer">
          <div className="landing-container">
            <div className="landing-footer__top">
              {/* Brand Column */}
              <div className="landing-footer__brand-col">
                <div className="landing-footer__brand">
                  <div className="landing-nav__logo" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span className="landing-footer__title">Timex</span>
                </div>
                <p className="landing-footer__tagline">
                  Save for the things you love, without the stress. Built for intentional savers.
                </p>
                {/* Social Icons */}
                <div className="landing-footer__socials">
                  <a href="#" className="landing-footer__social-icon" aria-label="Twitter / X">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="landing-footer__social-icon" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="landing-footer__social-icon" aria-label="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>

              {/* Link Columns */}
              <div className="landing-footer__link-col">
                <h4 className="landing-footer__col-title">Product</h4>
                <a href="#features">Features</a>
                <a href="#workflow">How It Works</a>
                <button type="button" className="landing-footer__link-btn" onClick={onExploreDashboard}>Live Demo</button>
                <a href="#faq">FAQ</a>
              </div>

              <div className="landing-footer__link-col">
                <h4 className="landing-footer__col-title">Company</h4>
                <a href="#stories">Stories</a>
                <a href="#">About Us</a>
                <a href="#">Press Kit</a>
                <a href="#">Contact</a>
              </div>

              <div className="landing-footer__link-col">
                <h4 className="landing-footer__col-title">Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="landing-footer__bottom">
              <p className="landing-footer__copy">
                © {new Date().getFullYear()} Timex. All rights reserved.
              </p>
              <p className="landing-footer__made">
                Made with ♥ for intentional savers
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
