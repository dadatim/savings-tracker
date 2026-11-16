import ProgressBar from './ProgressBar';
import type { Goal } from '../types';
import {
  formatDate,
  formatMoney,
  getGoalStats,
  STATUS_LABEL,
} from '../utils/goals';

interface GoalCardProps {
  goal: Goal;
  onAddMoney: (goal: Goal) => void;
}

export default function GoalCard({ goal, onAddMoney }: GoalCardProps) {
  const { saved, target, remaining, progress, status, perMonth } =
    getGoalStats(goal);

  let hint: string;
  if (status === 'completed') hint = 'You hit your target.';
  else if (perMonth) hint = `Save ${formatMoney(perMonth)} a month to finish on time.`;
  else hint = `${formatMoney(remaining)} to go.`;

  return (
    <article className="card">
      <header className="card__head">
        <h2 className="card__name">{goal.name}</h2>
        <span className={`badge badge--${status}`}>{STATUS_LABEL[status]}</span>
      </header>

      <p className="card__amount">
        <span className="card__saved">{formatMoney(saved)}</span>
        <span className="card__target">of {formatMoney(target)}</span>
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

      <button
        type="button"
        className="btn btn--ghost btn--small"
        aria-label={`Add money to ${goal.name}`}
        onClick={() => onAddMoney(goal)}
      >
        Add money
      </button>
    </article>
  );
}
