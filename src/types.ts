export interface Contribution {
  id: string;
  amount: number;
  date: string; // ISO date, e.g. '2026-11-10'
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  createdAt: string; // ISO date
  deadline: string | null; // ISO date, or null for open-ended goals
  contributions: Contribution[];
}

export type GoalStatus =
  | 'completed'
  | 'on-track'
  | 'behind'
  | 'overdue'
  | 'open';

export type PaceMode = 'monthly' | 'weekly' | 'daily';

export interface GoalStats {
  saved: number;
  target: number;
  remaining: number;
  progress: number; // 0 to 1
  status: GoalStatus;
  perMonth: number | null; // amount to save per month to hit the deadline
  perWeek: number | null; // amount to save per week to hit the deadline
  perDay: number | null; // amount to save per day to hit the deadline
}

// What the "New goal" form collects before a Goal is created from it
export interface GoalFormValues {
  name: string;
  targetAmount: number;
  deadline: string | null; // ISO date, or null for no deadline
  startingAmount: number; // 0 if the person starts from nothing
}

export type ContributionKind = 'deposit' | 'withdrawal';

// What the "Add money" form collects (amount is always positive here;
// a withdrawal is stored as a negative Contribution amount)
export interface ContributionFormValues {
  kind: ContributionKind;
  amount: number;
  date: string; // ISO date
  note: string;
}

// A contribution plus the running balance of the goal right after it
export interface HistoryEntry extends Contribution {
  balance: number;
}
