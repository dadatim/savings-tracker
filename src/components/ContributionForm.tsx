import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from './Modal';
import type { ContributionFormValues, ContributionKind } from '../types';
import { formatMoney, todayISO } from '../utils/goals';

interface ContributionFormProps {
  goalName: string;
  saved: number; // current saved amount, used to cap withdrawals
  onSubmit: (values: ContributionFormValues) => void;
  onCancel: () => void;
}

interface FormErrors {
  amount?: string;
  date?: string;
}

export default function ContributionForm({
  goalName,
  saved,
  onSubmit,
  onCancel,
}: ContributionFormProps) {
  const [kind, setKind] = useState<ContributionKind>('deposit');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: FormErrors = {};
    const value = Number(amount);

    if (amount === '' || !Number.isFinite(value) || value <= 0) {
      next.amount = 'Enter an amount greater than 0.';
    } else if (kind === 'withdrawal' && value > saved) {
      next.amount = `You only have ${formatMoney(saved)} saved in this goal.`;
    }

    if (!date) next.date = 'Pick a date.';
    else if (date > todayISO()) next.date = 'The date can’t be in the future.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({ kind, amount: value, date, note: note.trim() });
  }

  return (
    <Modal labelledBy="contribution-form-title" onClose={onCancel}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div>
          <h2 id="contribution-form-title" className="form__title">
            Update savings
          </h2>
          <p className="form__subtitle">{goalName}</p>
        </div>

        <fieldset className="field">
          <legend>Type</legend>
          <div className="segmented">
            <label>
              <input
                type="radio"
                name="kind"
                value="deposit"
                checked={kind === 'deposit'}
                onChange={() => setKind('deposit')}
              />
              <span>Add money</span>
            </label>
            <label>
              <input
                type="radio"
                name="kind"
                value="withdrawal"
                checked={kind === 'withdrawal'}
                onChange={() => setKind('withdrawal')}
              />
              <span>Withdraw</span>
            </label>
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="contribution-amount">Amount</label>
          <input
            id="contribution-amount"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'contribution-amount-error' : undefined}
          />
          {errors.amount && (
            <p id="contribution-amount-error" className="field__error">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="contribution-date">Date</label>
          <input
            id="contribution-date"
            type="date"
            max={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'contribution-date-error' : undefined}
          />
          {errors.date && (
            <p id="contribution-date-error" className="field__error">
              {errors.date}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="contribution-note">Note (optional)</label>
          <input
            id="contribution-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={80}
            placeholder="e.g. Allowance"
          />
        </div>

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {kind === 'deposit' ? 'Save deposit' : 'Save withdrawal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
