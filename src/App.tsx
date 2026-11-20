import { useState, useMemo } from 'react';
import ConfirmDialog from './components/ConfirmDialog';
import ContributionForm from './components/ContributionForm';
import ContributionHistory from './components/ContributionHistory';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import DashboardNav from './components/DashboardNav';
import DashboardMetrics from './components/DashboardMetrics';
import DashboardToolbar, {
  type SortOption,
  type StatusFilterOption,
} from './components/DashboardToolbar';
import RecentActivity from './components/RecentActivity';
import UpcomingDeadline from './components/UpcomingDeadline';
import PaceOverview from './components/PaceOverview';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import { mockGoals } from './data/mockGoals';
import { useLocalStorage } from './hooks/useLocalStorage';
import type {
  ContributionFormValues,
  Goal,
  GoalFormValues,
  PaceMode,
} from './types';
import {
  createContribution,
  createGoal,
  getGoalStats,
  getSaved,
  isGoalArray,
} from './utils/goals';

const GOALS_STORAGE_KEY = 'savings-goal-tracker:goals:v1';
const USER_STORAGE_KEY = 'savings-goal-tracker:user:v1';
const VIEW_STORAGE_KEY = 'savings-goal-tracker:view:v1';
const PACE_STORAGE_KEY = 'savings-goal-tracker:pace:v1';

export type AppView = 'landing' | 'auth' | 'onboarding' | 'dashboard';

export default function App() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(
    GOALS_STORAGE_KEY,
    mockGoals,
    isGoalArray,
  );

  const [userName, setUserName] = useLocalStorage<string>(
    USER_STORAGE_KEY,
    'Timothy Dada',
    (v): v is string => typeof v === 'string',
  );

  const [currentView, setCurrentView] = useLocalStorage<AppView>(
    VIEW_STORAGE_KEY,
    'dashboard',
    (v): v is AppView => typeof v === 'string' && ['landing', 'auth', 'onboarding', 'dashboard'].includes(v),
  );

  // Monthly / weekly view for "how much to save" figures across the dashboard
  const [paceMode, setPaceMode] = useLocalStorage<PaceMode>(
    PACE_STORAGE_KEY,
    'monthly',
    (v): v is PaceMode => v === 'monthly' || v === 'weekly',
  );

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // Modal states for dashboard
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [contributionGoalId, setContributionGoalId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [historyGoalId, setHistoryGoalId] = useState<string | null>(null);

  // Dashboard Toolbar states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const contributionGoal = goals.find((g) => g.id === contributionGoalId);
  const editingGoal = goals.find((g) => g.id === editingGoalId);
  const deletingGoal = goals.find((g) => g.id === deletingGoalId);
  const historyGoal = goals.find((g) => g.id === historyGoalId);

  function handleAddGoal(values: GoalFormValues) {
    setGoals((current) => [createGoal(values), ...current]);
    setShowGoalForm(false);
  }

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

  function handleDeleteContribution(contributionId: string) {
    setGoals((current) =>
      current.map((g) =>
        g.id === historyGoalId
          ? {
              ...g,
              contributions: g.contributions.filter((c) => c.id !== contributionId),
            }
          : g,
      ),
    );
  }

  // Onboarding Complete Handler
  function handleOnboardingComplete(data: {
    userName: string;
    goal: {
      name: string;
      targetAmount: number;
      startingAmount: number;
      deadline: string | null;
    };
  }) {
    setUserName(data.userName);
    const newFirstGoal = createGoal({
      name: data.goal.name,
      targetAmount: data.goal.targetAmount,
      startingAmount: data.goal.startingAmount,
      deadline: data.goal.deadline,
    });
    setGoals((current) => [newFirstGoal, ...current]);
    setCurrentView('dashboard');
  }

  // Auth Submit Handler
  function handleAuthSubmit(user: { name: string; email: string }) {
    if (user.name) setUserName(user.name);
    // If user has 0 goals, take them through onboarding; otherwise take them to dashboard
    if (goals.length === 0) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  }

  // Dashboard calculations
  const statsList = useMemo(() => goals.map((g) => ({ goal: g, stats: getGoalStats(g) })), [goals]);
  const totalSaved = useMemo(() => statsList.reduce((sum, s) => sum + s.stats.saved, 0), [statsList]);
  const totalTarget = useMemo(() => statsList.reduce((sum, s) => sum + s.stats.target, 0), [statsList]);
  const totalRemaining = Math.max(totalTarget - totalSaved, 0);
  const overallProgress = totalTarget > 0 ? totalSaved / totalTarget : 0;
  const completed = statsList.filter((s) => s.stats.status === 'completed').length;
  const onTrackCount = statsList.filter((s) => s.stats.status === 'on-track').length;
  const behindCount = statsList.filter((s) => s.stats.status === 'behind').length;

  const statusCounts = useMemo<Record<StatusFilterOption, number>>(() => {
    const counts: Record<StatusFilterOption, number> = {
      all: goals.length,
      'on-track': 0,
      behind: 0,
      completed: 0,
      open: 0,
      overdue: 0,
    };
    for (const item of statsList) {
      const st = item.stats.status;
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    }
    return counts;
  }, [goals.length, statsList]);

  const filteredGoals = useMemo(() => {
    let result = statsList.map((item) => item);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(({ goal }) => goal.name.toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      result = result.filter(({ stats }) => stats.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.stats.progress - a.stats.progress;
        case 'target':
          return b.stats.target - a.stats.target;
        case 'name':
          return a.goal.name.localeCompare(b.goal.name);
        case 'deadline': {
          if (!a.goal.deadline && !b.goal.deadline) return 0;
          if (!a.goal.deadline) return 1;
          if (!b.goal.deadline) return -1;
          return a.goal.deadline.localeCompare(b.goal.deadline);
        }
        case 'default':
        default:
          return 0;
      }
    });

    return result.map(({ goal }) => goal);
  }, [statsList, searchQuery, statusFilter, sortBy]);

  const deleteCount = deletingGoal?.contributions.length ?? 0;
  const deleteMessage = deletingGoal
    ? deleteCount > 0
      ? `“${deletingGoal.name}” and its ${deleteCount} ${
          deleteCount === 1 ? 'contribution' : 'contributions'
        } will be removed permanently. This can’t be undone.`
      : `“${deletingGoal.name}” will be removed permanently. This can’t be undone.`
    : '';

  // 1. RENDER: LANDING PAGE
  if (currentView === 'landing') {
    return (
      <div className="view-transition-fade" key="landing">
        <LandingPage
          onGetStarted={() => setCurrentView('onboarding')}
          onSignIn={() => {
            setAuthMode('login');
            setCurrentView('auth');
          }}
          onExploreDashboard={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  // 2. RENDER: AUTH PAGE (SIGN UP / LOG IN)
  if (currentView === 'auth') {
    return (
      <div className="view-transition-fade" key="auth">
        <AuthPage
          initialMode={authMode}
          onSubmit={handleAuthSubmit}
          onBackToHome={() => setCurrentView('landing')}
        />
      </div>
    );
  }

  // 3. RENDER: ONBOARDING FLOW
  if (currentView === 'onboarding') {
    return (
      <div className="view-transition-fade" key="onboarding">
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onCancel={() => setCurrentView('dashboard')}
          paceMode={paceMode}
        />
      </div>
    );
  }

  // 4. RENDER: MINIMAL DASHBOARD
  return (
    <div className="dash-root view-transition-fade" key="dashboard">
      {/* Top dashboard navigation bar */}
      <DashboardNav
        userName={userName}
        onNewGoal={() => setShowGoalForm(true)}
        onGoToLanding={() => setCurrentView('landing')}
        onGoToOnboarding={() => setCurrentView('onboarding')}
        onGoToAuth={() => {
          setAuthMode('login');
          setCurrentView('auth');
        }}
        onSignOut={() => {
          setCurrentView('landing');
        }}
      />

      <main className="dash-page">
        {/* Minimal metrics overview */}
        <DashboardMetrics
          totalSaved={totalSaved}
          totalTarget={totalTarget}
          totalRemaining={totalRemaining}
          overallProgress={overallProgress}
          completedCount={completed}
          totalCount={goals.length}
          onTrackCount={onTrackCount}
          behindCount={behindCount}
        />

        {/* Savings pace: how much to set aside per month or per week */}
        {goals.length > 0 && (
          <PaceOverview
            goals={goals}
            mode={paceMode}
            onModeChange={setPaceMode}
          />
        )}

        {/* Minimal toolbar */}
        <DashboardToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusCounts={statusCounts}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          filteredCount={filteredGoals.length}
          totalCount={goals.length}
        />

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="dash-empty-state">
            <h3 className="dash-empty-state__title">No goals yet</h3>
            <p className="dash-empty-state__text">
              Create your first goal to start tracking savings and milestones.
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowGoalForm(true)}
            >
              New goal
            </button>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="dash-empty-state">
            <h3 className="dash-empty-state__title">No matching goals</h3>
            <p className="dash-empty-state__text">
              Try adjusting your search query or filter.
            </p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <section className="grid" aria-label="Savings goals">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddMoney={(g) => setContributionGoalId(g.id)}
                onHistory={(g) => setHistoryGoalId(g.id)}
                onEdit={(g) => setEditingGoalId(g.id)}
                onDelete={(g) => setDeletingGoalId(g.id)}
                paceMode={paceMode}
              />
            ))}
          </section>
        )}

        {/* Activity & Milestone Insights */}
        {goals.length > 0 && (
          <section className="dash-insights-section" aria-label="Insights and activity">
            <UpcomingDeadline
              goals={goals}
              onAddMoney={(g) => setContributionGoalId(g.id)}
              paceMode={paceMode}
            />

            <RecentActivity
              goals={goals}
              onViewGoalHistory={(goalId) => setHistoryGoalId(goalId)}
              onAddMoneyToGoal={(goalId) => setContributionGoalId(goalId)}
            />
          </section>
        )}
      </main>

      {/* Modals */}
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

      {historyGoal && (
        <ContributionHistory
          goal={historyGoal}
          onDelete={handleDeleteContribution}
          onClose={() => setHistoryGoalId(null)}
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
    </div>
  );
}
