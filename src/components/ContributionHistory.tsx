import { useState } from 'react';
import Modal from './Modal';
import type { Goal } from '../types';
import { formatDate, formatMoney, getHistory, getSaved } from '../utils/goals';

interface ContributionHistoryProps {
  goal: Goal;
  onDelete: (contributionId: string) => void;
  onClose: () => void;
}

export default function ContributionHistory({
  goal,
  onDelete,
  onClose,
}: ContributionHistoryProps) {
  // Which entry is showing its "Remove this entry?" check, if any
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const entries = getHistory(goal);

  return (
    <Modal labelledBy="history-title" onClose={onClose}>
      <div className="form">
        <div>
          <h2 id="history-title" className="form__title">
            History
          </h2>
          <p className="form__subtitle">
            {goal.name} · {formatMoney(getSaved(goal))} of{' '}
            {formatMoney(goal.targetAmount)}
          </p>
        </div>

        {entries.length === 0 ? (
          <p className="form__text">
            No contributions yet. Use “Add money” on the card to log one.
          </p>
        ) : (
          <ul className="history">
            {entries.map((entry) => {
              const isWithdrawal = entry.amount < 0;
              const amountText = `${isWithdrawal ? '−' : '+'}${formatMoney(
                Math.abs(entry.amount),
              )}`;

              return (
                <li key={entry.id} className="history__item">
                  <div className="history__main">
                    <span className="history__kind">
                      {isWithdrawal ? 'Withdrawal' : 'Deposit'}
                    </span>
                    <span className="history__meta">
                      {formatDate(entry.date)}
                      {entry.note && ` · ${entry.note}`}
                    </span>
                  </div>

                  <div className="history__amounts">
                    <span className="history__amount">{amountText}</span>
                    <span className="history__meta">
                      Balance {formatMoney(entry.balance)}
                    </span>
                  </div>

                  <div className="history__actions">
                    {confirmingId === entry.id ? (
                      <>
                        <span className="history__meta">Remove this entry?</span>
                        <button
                          type="button"
                          className="btn btn--danger btn--small"
                          onClick={() => {
                            onDelete(entry.id);
                            setConfirmingId(null);
                          }}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--small"
                          onClick={() => setConfirmingId(null)}
                        >
                          Keep
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--ghost btn--small btn--danger-text"
                        aria-label={`Delete ${
                          isWithdrawal ? 'withdrawal' : 'deposit'
                        } of ${formatMoney(Math.abs(entry.amount))} on ${formatDate(
                          entry.date,
                        )}`}
                        onClick={() => setConfirmingId(entry.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
