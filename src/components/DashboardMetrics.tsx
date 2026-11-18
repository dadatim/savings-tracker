import { formatMoney } from '../utils/goals';

interface DashboardMetricsProps {
  totalSaved: number;
  totalTarget: number;
  totalRemaining: number;
  overallProgress: number;
  completedCount: number;
  totalCount: number;
  onTrackCount: number;
  behindCount: number;
}

export default function DashboardMetrics({
  totalSaved,
  totalTarget,
  totalRemaining,
  overallProgress,
  completedCount,
  totalCount,
}: DashboardMetricsProps) {
  const percentage = Math.round(overallProgress * 100);

  return (
    <section className="dash-minimal-overview" aria-label="Portfolio Summary">
      <div className="dash-minimal-stats">
        <div className="dash-minimal-stat">
          <span className="dash-minimal-stat__label">Saved so far</span>
          <div className="dash-minimal-stat__row">
            <span className="dash-minimal-stat__value">{formatMoney(totalSaved)}</span>
            <span className="dash-minimal-stat__pill">{percentage}%</span>
          </div>
          <span className="dash-minimal-stat__hint">
            {totalTarget > 0 ? `${formatMoney(totalRemaining)} remaining` : 'No target'}
          </span>
        </div>

        <div className="dash-minimal-stat">
          <span className="dash-minimal-stat__label">Total target</span>
          <div className="dash-minimal-stat__row">
            <span className="dash-minimal-stat__value">{formatMoney(totalTarget)}</span>
          </div>
          <span className="dash-minimal-stat__hint">
            Across {totalCount} {totalCount === 1 ? 'goal' : 'goals'}
          </span>
        </div>

        <div className="dash-minimal-stat">
          <span className="dash-minimal-stat__label">Goals reached</span>
          <div className="dash-minimal-stat__row">
            <span className="dash-minimal-stat__value">
              {completedCount} <span className="dash-minimal-stat__denom">of {totalCount}</span>
            </span>
          </div>
          <span className="dash-minimal-stat__hint">
            {completedCount === totalCount && totalCount > 0
              ? 'All goals completed!'
              : `${totalCount - completedCount} active`}
          </span>
        </div>
      </div>

      <div className="dash-minimal-bar-wrap">
        <div
          className="bar bar--on-track dash-minimal-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          aria-label="Overall portfolio progress"
        >
          <div
            className="bar__fill"
            style={{
              width: `${percentage}%`,
              background: percentage >= 100 ? 'var(--green)' : 'var(--blue)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
