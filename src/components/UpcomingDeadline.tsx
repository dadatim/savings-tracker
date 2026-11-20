import type { Goal, PaceMode } from '../types';
import {
  formatDate,
  formatMoney,
  getGoalStats,
  getPace,
  PACE_UNIT,
} from '../utils/goals';
import ProgressBar from './ProgressBar';

interface UpcomingDeadlineProps {
  goals: Goal[];
  onAddMoney: (goal: Goal) => void;
  paceMode?: PaceMode;
}

export default function UpcomingDeadline({
  goals,
  onAddMoney,
  paceMode = 'monthly',
}: UpcomingDeadlineProps) {
  // Find active goals with deadlines, sorted by deadline soonest
  const activeDeadlineGoals = goals
    .map((g) => ({ goal: g, stats: getGoalStats(g) }))
    .filter(({ goal, stats }) => goal.deadline !== null && stats.status !== 'completed')
    .sort((a, b) => (a.goal.deadline || '').localeCompare(b.goal.deadline || ''));

  const next = activeDeadlineGoals[0];

  if (!next) {
    return (
      <div className="dash-widget dash-widget--milestone">
        <div className="dash-widget__header">
          <div className="dash-widget__title-group">
            <div className="dash-widget__icon dash-widget__icon--check" aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="dash-widget__title">Priority Focus</h2>
          </div>
        </div>
        <div className="dash-widget__empty">
          <p className="dash-widget__empty-title">All targets looking good!</p>
          <p className="dash-widget__empty-sub">
            No pending deadlines overdue or requiring urgent attention.
          </p>
        </div>
      </div>
    );
  }

  const { goal, stats } = next;
  const pace = getPace(stats, paceMode);
  const deadlineDate = goal.deadline ? formatDate(goal.deadline) : '';
  const daysLeft = Math.ceil(
    (new Date(goal.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="dash-widget dash-widget--milestone">
      <div className="dash-widget__header">
        <div className="dash-widget__title-group">
          <div className="dash-widget__icon dash-widget__icon--focus" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2 className="dash-widget__title">Next Target Due</h2>
        </div>
        <span
          className={`dash-widget__deadline-badge ${
            daysLeft < 30 ? 'dash-widget__deadline-badge--urgent' : ''
          }`}
        >
          {daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}
        </span>
      </div>

      <div className="dash-focus-card">
        <div className="dash-focus-card__head">
          <div>
            <h3 className="dash-focus-card__title">{goal.name}</h3>
            <p className="dash-focus-card__due">Target deadline: {deadlineDate}</p>
          </div>
          <span className={`badge badge--${stats.status}`}>
            {stats.status === 'on-track' ? 'On track' : stats.status === 'behind' ? 'Behind' : stats.status}
          </span>
        </div>

        <div className="dash-focus-card__amounts">
          <span className="dash-focus-card__saved">{formatMoney(stats.saved)}</span>
          <span className="dash-focus-card__target">of {formatMoney(stats.target)}</span>
        </div>

        <ProgressBar
          value={stats.progress}
          status={stats.status}
          label={`${goal.name} priority progress`}
        />

        {pace ? (
          <p className="dash-focus-card__hint">
            Save <strong>{formatMoney(pace)}/{PACE_UNIT[paceMode]}</strong> to finish on schedule.
          </p>
        ) : (
          <p className="dash-focus-card__hint">
            <strong>{formatMoney(stats.remaining)}</strong> left to complete.
          </p>
        )}

        <button
          type="button"
          className="btn btn--primary btn--small dash-focus-card__cta"
          onClick={() => onAddMoney(goal)}
        >
          Add money to this goal
        </button>
      </div>
    </div>
  );
}
