import type { Goal } from '../types';

// Same shape the real app will use later: a goal owns its contributions,
// and "saved" is always derived from them (never stored).
export const mockGoals: Goal[] = [
  {
    id: 'g1',
    name: 'Laptop fund',
    targetAmount: 650000,
    createdAt: '2026-08-01',
    deadline: '2027-03-31',
    contributions: [
      { id: 'c1', amount: 120000, date: '2026-08-20', note: 'Allowance' },
      { id: 'c2', amount: 90000, date: '2026-09-25', note: '' },
      { id: 'c3', amount: 60000, date: '2026-10-30', note: 'Gift' },
      { id: 'c4', amount: 50000, date: '2026-11-10', note: '' },
    ],
  },
  {
    id: 'g2',
    name: 'Emergency fund',
    targetAmount: 300000,
    createdAt: '2026-06-01',
    deadline: '2027-06-30',
    contributions: [
      { id: 'c5', amount: 50000, date: '2026-06-15', note: '' },
      { id: 'c6', amount: 25000, date: '2026-09-02', note: '' },
      { id: 'c7', amount: 15000, date: '2026-10-12', note: '' },
    ],
  },
  {
    id: 'g3',
    name: 'Hackathon trip',
    targetAmount: 120000,
    createdAt: '2026-09-01',
    deadline: '2026-12-15',
    contributions: [
      { id: 'c8', amount: 60000, date: '2026-09-20', note: '' },
      { id: 'c9', amount: 60000, date: '2026-10-28', note: '' },
    ],
  },
  {
    id: 'g4',
    name: 'Noise-cancelling headphones',
    targetAmount: 85000,
    createdAt: '2026-10-05',
    deadline: null,
    contributions: [{ id: 'c10', amount: 20000, date: '2026-10-05', note: '' }],
  },
];
