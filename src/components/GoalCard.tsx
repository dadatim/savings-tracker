import ProgressBar from './ProgressBar';
import type { Goal, PaceMode } from '../types';
import {
  formatDate,
  formatMoney,
  getGoalStats,
  getPace,
  PACE_UNIT,
  STATUS_LABEL,
} from '../utils/goals';

interface GoalCardProps {
  goal: Goal;
  onAddMoney: (goal: Goal) => void;
  onHistory: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  paceMode?: PaceMode;
}

export default function GoalCard({
  goal,
  onAddMoney,
  onHistory,
  onEdit,
  onDelete,
  paceMode = 'monthly',
}: GoalCardProps) {
  const stats = getGoalStats(goal);
  const { saved, target, remaining, progress, status } = stats;
  const pace = getPace(stats, paceMode);

  let hint: string;
  if (status === 'completed') hint = 'You hit your target.';
  else if (pace) hint = `Save ${formatMoney(pace)} a ${PACE_UNIT[paceMode]} to finish on time.`;
  else hint = `${formatMoney(remaining)} to go.`;

  const pct = Math.round(progress * 100);

  return (
    <article className="card">
      <header className="card__head">
        <h2 className="card__name">{goal.name}</h2>
        <span className={`badge badge--${status}`}>{STATUS_LABEL[status]}</span>
      </header>

      <p className="card__amount">
        <span className="card__saved">{formatMoney(saved)}</span>
        <span className="card__target">of {formatMoney(target)}</span>
        <span className="card__pct">{pct}%</span>
      </p>

      <ProgressBar
        value={progress}
        status={status}
        label={`${goal.name} progress`}
      />

      <footer className="card__foot">
        <span>{hint}</span>
        {goal.deadline && <span>By {formatDate(goal.deadline)}</span>}
      </footer>

      <div className="card__actions">
        <button
          type="button"
          className="card__btn-add"
          aria-label={`Add money to ${goal.name}`}
          title="Add money"
          onClick={() => onAddMoney(goal)}
        >
          <svg
            width="15"
            height="15"
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
          <span>Add</span>
        </button>

        <div className="card__actions-group">
          <button
            type="button"
            className="card__icon-btn"
            aria-label={`View history for ${goal.name} (${goal.contributions.length} entries)`}
            title={`History (${goal.contributions.length})`}
            onClick={() => onHistory(goal)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {goal.contributions.length > 0 && (
              <span className="card__icon-badge">{goal.contributions.length}</span>
            )}
          </button>

          <button
            type="button"
            className="card__icon-btn"
            aria-label={`Edit ${goal.name}`}
            title="Edit goal"
            onClick={() => onEdit(goal)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>

          <button
            type="button"
            className="card__icon-btn card__icon-btn--danger"
            aria-label={`Delete ${goal.name}`}
            title="Delete goal"
            onClick={() => onDelete(goal)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
