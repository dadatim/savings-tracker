import type { GoalStatus } from '../types';

export type StatusFilterOption = GoalStatus | 'all';
export type SortOption = 'default' | 'deadline' | 'target' | 'progress' | 'name';

interface DashboardToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterOption;
  onStatusFilterChange: (status: StatusFilterOption) => void;
  statusCounts: Record<StatusFilterOption, number>;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  filteredCount: number;
  totalCount: number;
}

const FILTER_ITEMS: { id: StatusFilterOption; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'on-track', label: 'On track' },
  { id: 'behind', label: 'Behind' },
  { id: 'completed', label: 'Reached' },
  { id: 'open', label: 'No deadline' },
];

export default function DashboardToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  sortBy,
  onSortByChange,
  filteredCount,
  totalCount,
}: DashboardToolbarProps) {
  const isFiltered = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="dash-minimal-toolbar">
      <div className="dash-minimal-toolbar__left">
        {/* Search */}
        <div className="dash-search">
          <svg
            className="dash-search__icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            className="dash-search__input"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search goals"
          />
          {searchQuery && (
            <button
              type="button"
              className="dash-search__clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="dash-filter-group" role="tablist" aria-label="Status filters">
          {FILTER_ITEMS.map((item) => {
            const count = statusCounts[item.id] ?? 0;
            const isSelected = statusFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`dash-pill ${isSelected ? 'dash-pill--active' : ''}`}
                onClick={() => onStatusFilterChange(item.id)}
              >
                <span>{item.label}</span>
                <span className="dash-pill__count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dash-minimal-toolbar__right">
        {isFiltered && (
          <button
            type="button"
            className="dash-clear-btn"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
            }}
            title="Reset filters"
          >
            Clear
          </button>
        )}

        <div className="dash-sort">
          <select
            className="dash-sort__select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            aria-label="Sort goals"
          >
            <option value="default">Default</option>
            <option value="progress">Progress %</option>
            <option value="target">Target amount</option>
            <option value="deadline">Deadline</option>
            <option value="name">Name</option>
          </select>
        </div>

        <span className="dash-count-tag" aria-live="polite">
          {filteredCount}/{totalCount}
        </span>
      </div>
    </div>
  );
}
