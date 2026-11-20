import type {
  Contribution,
  ContributionFormValues,
  Goal,
  GoalFormValues,
  GoalStats,
  GoalStatus,
  HistoryEntry,
  PaceMode,
} from '../types';

// Change these two constants to switch currency everywhere.
const CURRENCY = 'NGN';
const LOCALE = 'en-NG';

const money = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export const formatMoney = (n: number): string => money.format(n);

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const DAY_MS = 1000 * 60 * 60 * 24;

const DAYS_PER_PERIOD: Record<PaceMode, number> = {
  monthly: 30.44,
  weekly: 7,
};

// Whole periods (months or weeks) left until the deadline; always at least 1,
// so a deadline less than a week away counts as one week.
export const getPeriodsLeft = (daysLeft: number, mode: PaceMode): number =>
  Math.max(Math.ceil(daysLeft / DAYS_PER_PERIOD[mode]), 1);

export const getSaved = (goal: Goal): number =>
  goal.contributions.reduce((sum, c) => sum + c.amount, 0);

export function getGoalStats(goal: Goal, today: Date = new Date()): GoalStats {
  const saved = getSaved(goal);
  const target = goal.targetAmount;
  const remaining = Math.max(target - saved, 0);
  const progress = Math.min(saved / target, 1);

  if (saved >= target) {
    return { saved, target, remaining: 0, progress: 1, status: 'completed', perMonth: 0, perWeek: 0 };
  }
  if (!goal.deadline) {
    return { saved, target, remaining, progress, status: 'open', perMonth: null, perWeek: null };
  }

  const start = new Date(goal.createdAt).getTime();
  const end = new Date(goal.deadline).getTime();
  const now = today.getTime();
  const daysLeft = (end - now) / DAY_MS;

  if (daysLeft < 0) {
    return { saved, target, remaining, progress, status: 'overdue', perMonth: null, perWeek: null };
  }

  const elapsed = Math.min(Math.max((now - start) / (end - start), 0), 1);

  return {
    saved,
    target,
    remaining,
    progress,
    status: progress >= elapsed ? 'on-track' : 'behind',
    perMonth: Math.ceil(remaining / getPeriodsLeft(daysLeft, 'monthly')),
    perWeek: Math.ceil(remaining / getPeriodsLeft(daysLeft, 'weekly')),
  };
}

export const STATUS_LABEL: Record<GoalStatus, string> = {
  completed: 'Goal reached',
  'on-track': 'On track',
  behind: 'Behind schedule',
  overdue: 'Past deadline',
  open: 'No deadline',
};

export const PACE_UNIT: Record<PaceMode, string> = {
  monthly: 'month',
  weekly: 'week',
};

// The amount to save per period for whichever view is selected
export const getPace = (stats: GoalStats, mode: PaceMode): number | null =>
  mode === 'weekly' ? stats.perWeek : stats.perMonth;

// Local calendar date as YYYY-MM-DD (avoids the UTC off-by-one of toISOString)
export const todayISO = (): string => new Date().toLocaleDateString('en-CA');

export function createGoal(values: GoalFormValues): Goal {
  const today = todayISO();
  return {
    id: crypto.randomUUID(),
    name: values.name,
    targetAmount: values.targetAmount,
    createdAt: today,
    deadline: values.deadline,
    contributions:
      values.startingAmount > 0
        ? [
            {
              id: crypto.randomUUID(),
              amount: values.startingAmount,
              date: today,
              note: 'Starting balance',
            },
          ]
        : [],
  };
}

export function createContribution(values: ContributionFormValues): Contribution {
  return {
    id: crypto.randomUUID(),
    amount: values.kind === 'withdrawal' ? -values.amount : values.amount,
    date: values.date,
    note: values.note,
  };
}

// ---- Runtime checks for data read back from localStorage ----

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

function isContribution(v: unknown): v is Contribution {
  return (
    isObject(v) &&
    typeof v.id === 'string' &&
    typeof v.amount === 'number' &&
    typeof v.date === 'string' &&
    typeof v.note === 'string'
  );
}

export function isGoalArray(v: unknown): v is Goal[] {
  return (
    Array.isArray(v) &&
    v.every(
      (g) =>
        isObject(g) &&
        typeof g.id === 'string' &&
        typeof g.name === 'string' &&
        typeof g.targetAmount === 'number' &&
        typeof g.createdAt === 'string' &&
        (g.deadline === null || typeof g.deadline === 'string') &&
        Array.isArray(g.contributions) &&
        g.contributions.every(isContribution),
    )
  );
}

// Newest first, each entry carrying the running balance after it.
// Same-day entries keep the order they were added in.
export function getHistory(goal: Goal): HistoryEntry[] {
  const chronological = goal.contributions
    .map((contribution, index) => ({ contribution, index }))
    .sort(
      (a, b) =>
        a.contribution.date.localeCompare(b.contribution.date) ||
        a.index - b.index,
    );

  let balance = 0;
  return chronological
    .map(({ contribution }) => {
      balance += contribution.amount;
      return { ...contribution, balance };
    })
    .reverse();
}
