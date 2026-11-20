import type { Goal, PaceMode } from '../types';
import {
  formatDate,
  formatMoney,
  getGoalStats,
  getPace,
  PACE_UNIT,
} from '../utils/goals';

interface PaceOverviewProps {
  goals: Goal[];
  mode: PaceMode;
  onModeChange: (mode: PaceMode) => void;
}

const MODES: { value: PaceMode; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
];

const MAX_ROWS = 5;

export default function PaceOverview({
  goals,
  mode,
  onModeChange,
}: PaceOverviewProps) {
  const unit = PACE_UNIT[mode];

  // Only goals that still need money and have a deadline have a pace.
  // Soonest deadline first.
  const rows = goals
    .map((goal) => ({ goal, pace: getPace(getGoalStats(goal), mode) }))
    .filter((row): row is { goal: Goal; pace: number } => row.pace !== null && row.pace > 0)
    .sort((a, b) => (a.goal.deadline ?? '').localeCompare(b.goal.deadline ?? ''));

  const total = rows.reduce((sum, row) => sum + row.pace, 0);
  const visible = rows.slice(0, MAX_ROWS);
  const hiddenCount = rows.length - visible.length;

  return (
    <section className="pace" aria-label="Savings pace">
      <div className="pace__head">
        <div>
          <h2 className="pace__title">Savings pace</h2>
          <p className="pace__summary" aria-live="polite">
            {rows.length === 0 ? (
              'Add a deadline to a goal to see how much to save each week or month.'
            ) : (
              <>
                Set aside <strong>{formatMoney(total)}</strong> a {unit} to finish{' '}
                {rows.length} {rows.length === 1 ? 'goal' : 'goals'} on time.
              </>
            )}
          </p>
        </div>

        <div
          className="pace__toggle segmented"
          role="radiogroup"
          aria-label="Show savings pace by"
        >
          {MODES.map((m) => (
            <label key={m.value}>
              <input
                type="radio"
                name="pace-mode"
                value={m.value}
                checked={mode === m.value}
                onChange={() => onModeChange(m.value)}
              />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {rows.length > 0 && (
        <ul className="pace__list">
          {visible.map(({ goal, pace }) => (
            <li key={goal.id} className="pace__row">
              <span className="pace__name">{goal.name}</span>
              {goal.deadline && (
                <span className="pace__due">By {formatDate(goal.deadline)}</span>
              )}
              <span className="pace__amount">
                {formatMoney(pace)}
                <small>/{unit}</small>
              </span>
            </li>
          ))}
        </ul>
      )}

      {hiddenCount > 0 && (
        <p className="pace__more">
          and {hiddenCount} more {hiddenCount === 1 ? 'goal' : 'goals'}
        </p>
      )}
    </section>
  );
}
