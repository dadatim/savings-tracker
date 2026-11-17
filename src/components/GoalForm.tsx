import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from './Modal';
import type { Goal, GoalFormValues } from '../types';
import { todayISO } from '../utils/goals';

interface GoalFormProps {
  goal?: Goal; // pass a goal to edit it; leave out to create a new one
  onSubmit: (values: GoalFormValues) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  target?: string;
  starting?: string;
  deadline?: string;
}

export default function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const isEdit = goal !== undefined;
  const today = todayISO();

  const [name, setName] = useState(goal?.name ?? '');
  const [target, setTarget] = useState(goal ? String(goal.targetAmount) : '');
  const [starting, setStarting] = useState('');
  const [deadline, setDeadline] = useState(goal?.deadline ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  // If an edited goal's deadline has already passed, let the date picker show it
  const minDate = goal?.deadline && goal.deadline < today ? goal.deadline : today;

  function validate(): { errors: FormErrors; values: GoalFormValues | null } {
    const next: FormErrors = {};
    const trimmed = name.trim();
    const targetAmount = Number(target);
    // The "already saved" field only exists when creating a goal
    const startingAmount = isEdit || starting === '' ? 0 : Number(starting);

    if (!trimmed) next.name = 'Give your goal a name.';

    if (target === '' || !Number.isFinite(targetAmount) || targetAmount <= 0) {
      next.target = 'Enter a target amount greater than 0.';
    }

    if (startingAmount < 0 || !Number.isFinite(startingAmount)) {
      next.starting = 'Enter 0 or more.';
    } else if (!next.target && startingAmount > targetAmount) {
      next.starting = 'This can’t be more than your target.';
    }

    // Only complain about a past date if the person actually changed it
    if (deadline && deadline < today && deadline !== goal?.deadline) {
      next.deadline = 'Pick today or a future date.';
    }

    if (Object.keys(next).length > 0) return { errors: next, values: null };

    return {
      errors: next,
      values: {
        name: trimmed,
        targetAmount,
        startingAmount,
        deadline: deadline || null,
      },
    };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = validate();
    setErrors(result.errors);
    if (result.values) onSubmit(result.values);
  }

  return (
    <Modal labelledBy="goal-form-title" onClose={onCancel}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <h2 id="goal-form-title" className="form__title">
          {isEdit ? 'Edit goal' : 'New goal'}
        </h2>

        <div className="field">
          <label htmlFor="goal-name">Goal name</label>
          <input
            id="goal-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Laptop fund"
            maxLength={60}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'goal-name-error' : undefined}
          />
          {errors.name && (
            <p id="goal-name-error" className="field__error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="goal-target">Target amount</label>
          <input
            id="goal-target"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            aria-invalid={!!errors.target}
            aria-describedby={errors.target ? 'goal-target-error' : undefined}
          />
          {errors.target && (
            <p id="goal-target-error" className="field__error">
              {errors.target}
            </p>
          )}
        </div>

        {!isEdit && (
          <div className="field">
            <label htmlFor="goal-starting">Already saved (optional)</label>
            <input
              id="goal-starting"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={starting}
              onChange={(e) => setStarting(e.target.value)}
              aria-invalid={!!errors.starting}
              aria-describedby={errors.starting ? 'goal-starting-error' : undefined}
            />
            {errors.starting && (
              <p id="goal-starting-error" className="field__error">
                {errors.starting}
              </p>
            )}
          </div>
        )}

        <div className="field">
          <label htmlFor="goal-deadline">Deadline (optional)</label>
          <input
            id="goal-deadline"
            type="date"
            min={minDate}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            aria-invalid={!!errors.deadline}
            aria-describedby={errors.deadline ? 'goal-deadline-error' : undefined}
          />
          {errors.deadline && (
            <p id="goal-deadline-error" className="field__error">
              {errors.deadline}
            </p>
          )}
        </div>

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEdit ? 'Save changes' : 'Save goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
