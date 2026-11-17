import { useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog';
import ContributionForm from './components/ContributionForm';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import { mockGoals } from './data/mockGoals';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { ContributionFormValues, Goal, GoalFormValues } from './types';
import {
  createContribution,
  createGoal,
  formatMoney,
  getGoalStats,
  getSaved,
  isGoalArray,
} from './utils/goals';

// Bump the version suffix if the shape of a Goal ever changes.
const STORAGE_KEY = 'savings-goal-tracker:goals:v1';

export default function App() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(
    STORAGE_KEY,
    mockGoals,
    isGoalArray,
  );
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [contributionGoalId, setContributionGoalId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  const contributionGoal = goals.find((g) => g.id === contributionGoalId);
  const editingGoal = goals.find((g) => g.id === editingGoalId);
  const deletingGoal = goals.find((g) => g.id === deletingGoalId);

  function handleAddGoal(values: GoalFormValues) {
    setGoals((current) => [createGoal(values), ...current]);
    setShowGoalForm(false);
  }

  // Editing changes the goal's details only; its contributions stay as they are
  function handleEditGoal(values: GoalFormValues) {
    setGoals((current) =>
      current.map((g) =>
        g.id === editingGoalId
          ? {
              ...g,
              name: values.name,
              targetAmount: values.targetAmount,
              deadline: values.deadline,
            }
          : g,
      ),
    );
    setEditingGoalId(null);
  }

  function handleDeleteGoal() {
    setGoals((current) => current.filter((g) => g.id !== deletingGoalId));
    setDeletingGoalId(null);
  }

  function handleAddContribution(values: ContributionFormValues) {
    setGoals((current) =>
      current.map((g) =>
        g.id === contributionGoalId
          ? { ...g, contributions: [...g.contributions, createContribution(values)] }
          : g,
      ),
    );
    setContributionGoalId(null);
  }

  const stats = goals.map((g) => getGoalStats(g));
  const totalSaved = stats.reduce((sum, s) => sum + s.saved, 0);
  const totalTarget = stats.reduce((sum, s) => sum + s.target, 0);
  const completed = stats.filter((s) => s.status === 'completed').length;

  const deleteCount = deletingGoal?.contributions.length ?? 0;
  const deleteMessage = deletingGoal
    ? deleteCount > 0
      ? `“${deletingGoal.name}” and its ${deleteCount} ${
          deleteCount === 1 ? 'contribution' : 'contributions'
        } will be removed permanently. This can’t be undone.`
      : `“${deletingGoal.name}” will be removed permanently. This can’t be undone.`
    : '';

  return (
    <main className="page">
      <header className="top">
        <div className="top__row">
          <h1 className="top__title">Savings goals</h1>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setShowGoalForm(true)}
          >
            New goal
          </button>
        </div>
        <dl className="summary">
          <div>
            <dt>Saved so far</dt>
            <dd>{formatMoney(totalSaved)}</dd>
          </div>
          <div>
            <dt>Across all goals</dt>
            <dd>{formatMoney(totalTarget)}</dd>
          </div>
          <div>
            <dt>Goals reached</dt>
            <dd>
              {completed} of {goals.length}
            </dd>
          </div>
        </dl>
      </header>

      {goals.length === 0 ? (
        <p className="empty">
          No goals yet. Create your first one to start tracking.
        </p>
      ) : (
        <section className="grid" aria-label="Your goals">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddMoney={(g) => setContributionGoalId(g.id)}
              onEdit={(g) => setEditingGoalId(g.id)}
              onDelete={(g) => setDeletingGoalId(g.id)}
            />
          ))}
        </section>
      )}

      {showGoalForm && (
        <GoalForm
          onSubmit={handleAddGoal}
          onCancel={() => setShowGoalForm(false)}
        />
      )}

      {editingGoal && (
        <GoalForm
          goal={editingGoal}
          onSubmit={handleEditGoal}
          onCancel={() => setEditingGoalId(null)}
        />
      )}

      {contributionGoal && (
        <ContributionForm
          goalName={contributionGoal.name}
          saved={getSaved(contributionGoal)}
          onSubmit={handleAddContribution}
          onCancel={() => setContributionGoalId(null)}
        />
      )}

      {deletingGoal && (
        <ConfirmDialog
          title="Delete this goal?"
          message={deleteMessage}
          confirmLabel="Delete goal"
          onConfirm={handleDeleteGoal}
          onCancel={() => setDeletingGoalId(null)}
        />
      )}
    </main>
  );
}
