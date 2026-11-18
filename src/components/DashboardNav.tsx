import { useState, useRef, useEffect } from 'react';

interface DashboardNavProps {
  onNewGoal: () => void;
  userName?: string;
  onGoToLanding: () => void;
  onGoToOnboarding: () => void;
  onGoToAuth: () => void;
  onSignOut: () => void;
}

export default function DashboardNav({
  onNewGoal,
  userName = 'Timothy',
  onGoToLanding,
  onGoToOnboarding,
  onGoToAuth,
  onSignOut,
}: DashboardNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="dash-nav">
      <div className="dash-nav__container">
        {/* Left: Logo & "Timex" */}
        <div className="dash-nav__brand" onClick={onGoToLanding} role="button" tabIndex={0} title="Return to Landing Page">
          <div className="dash-nav__logo" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span className="dash-nav__title">Timex</span>
        </div>

        {/* Right: New Goal & Profile Icon */}
        <div className="dash-nav__actions" ref={menuRef}>
          <button
            type="button"
            className="btn btn--primary dash-nav__btn"
            onClick={onNewGoal}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New goal</span>
          </button>

          <div className="dash-nav__profile-wrap">
            <button
              type="button"
              className="dash-nav__profile"
              aria-label={`User profile for ${userName}`}
              title={`Logged in as ${userName}`}
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
            >
              <span className="dash-nav__initials">{initials}</span>
            </button>

            {profileOpen && (
              <div className="dash-nav__menu" role="menu">
                <div className="dash-nav__menu-header">
                  <strong className="dash-nav__menu-name">{userName}</strong>
                  <span className="dash-nav__menu-tag">Active Saver</span>
                </div>

                <div className="dash-nav__menu-divider" />

                <button
                  type="button"
                  className="dash-nav__menu-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onGoToLanding();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Landing Page</span>
                </button>

                <button
                  type="button"
                  className="dash-nav__menu-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onGoToOnboarding();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span>New Client Onboarding</span>
                </button>

                <button
                  type="button"
                  className="dash-nav__menu-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onGoToAuth();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>Switch / Sign Up Account</span>
                </button>

                <div className="dash-nav__menu-divider" />

                <button
                  type="button"
                  className="dash-nav__menu-item dash-nav__menu-item--danger"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onSignOut();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
