import type { GoalStatus } from '../types';

interface ProgressBarProps {
  value: number; // 0 to 1
  status: GoalStatus;
  label: string;
}

// Tick marks at 25/50/75% give the bar a sense of milestones.
export default function ProgressBar({ value, status, label }: ProgressBarProps) {
  const pct = Math.round(value * 100);

  return (
    <div
      className={`bar bar--${status}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      <div className="bar__fill" style={{ width: `${pct}%` }} />
      <span className="bar__tick" style={{ left: '25%' }} />
      <span className="bar__tick" style={{ left: '50%' }} />
      <span className="bar__tick" style={{ left: '75%' }} />
    </div>
  );
}
