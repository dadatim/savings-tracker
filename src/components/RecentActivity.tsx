import type { Goal } from '../types';
import { formatDate, formatMoney } from '../utils/goals';

interface RecentActivityProps {
  goals: Goal[];
  onViewGoalHistory: (goalId: string) => void;
  onAddMoneyToGoal: (goalId: string) => void;
}

interface ActivityTransaction {
  id: string;
  goalId: string;
  goalName: string;
  amount: number;
  date: string;
  note: string;
}

export default function RecentActivity({
  goals,
  onViewGoalHistory,
  onAddMoneyToGoal,
}: RecentActivityProps) {
  // Aggregate all contributions across all goals and sort by date descending
  const transactions: ActivityTransaction[] = goals
    .flatMap((g) =>
      g.contributions.map((c) => ({
        id: c.id,
        goalId: g.id,
        goalName: g.name,
        amount: c.amount,
        date: c.date,
        note: c.note,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="dash-widget dash-widget--activity">
      <div className="dash-widget__header">
        <div className="dash-widget__title-group">
          <div className="dash-widget__icon dash-widget__icon--activity" aria-hidden="true">
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h2 className="dash-widget__title">Recent Activity</h2>
        </div>
        <span className="dash-widget__badge">{transactions.length} latest</span>
      </div>

      {transactions.length === 0 ? (
        <div className="dash-widget__empty">
          <p>No activity yet.</p>
          <p className="dash-widget__empty-sub">
            Add money or create a goal to begin tracking transactions.
          </p>
        </div>
      ) : (
        <ul className="dash-activity-list">
          {transactions.map((tx) => {
            const isWithdrawal = tx.amount < 0;
            const amountFormatted = `${isWithdrawal ? '−' : '+'}${formatMoney(
              Math.abs(tx.amount),
            )}`;

            return (
              <li key={tx.id} className="dash-activity-item">
                <div
                  className={`dash-activity-item__icon ${
                    isWithdrawal
                      ? 'dash-activity-item__icon--out'
                      : 'dash-activity-item__icon--in'
                  }`}
                  aria-hidden="true"
                >
                  {isWithdrawal ? '↓' : '↑'}
                </div>

                <div className="dash-activity-item__body">
                  <div className="dash-activity-item__row">
                    <span className="dash-activity-item__goal" title={tx.goalName}>
                      {tx.goalName}
                    </span>
                    <span
                      className={`dash-activity-item__amount ${
                        isWithdrawal
                          ? 'dash-activity-item__amount--out'
                          : 'dash-activity-item__amount--in'
                      }`}
                    >
                      {amountFormatted}
                    </span>
                  </div>

                  <div className="dash-activity-item__meta">
                    <span>{formatDate(tx.date)}</span>
                    {tx.note && <span> · {tx.note}</span>}
                    <div className="dash-activity-item__links">
                      <button
                        type="button"
                        className="dash-activity-item__link"
                        onClick={() => onAddMoneyToGoal(tx.goalId)}
                      >
                        + Add
                      </button>
                      <button
                        type="button"
                        className="dash-activity-item__link"
                        onClick={() => onViewGoalHistory(tx.goalId)}
                      >
                        History
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
