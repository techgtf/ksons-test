// hooks/useProjectFilters.ts
import { useState, useMemo } from "react";
import { Project } from "../components/projects/projects";

export interface ProjectFiltersState {
  search: string;
  cities: string[];
  budgets: string[];
  statuses: string[];
}

const DEFAULT_FILTERS: ProjectFiltersState = {
  search: "",
  cities: [],
  budgets: [],
  statuses: [],
};

function parseBudgetRange(budgetLabel: string): { min: number; max: number } {
  if (budgetLabel === "Under ₹50L") return { min: 0, max: 5000000 };
  if (budgetLabel === "₹50L - ₹1Cr") return { min: 5000000, max: 10000000 };
  if (budgetLabel === "₹1Cr - ₹5Cr") return { min: 10000000, max: 50000000 };
  if (budgetLabel === "Above ₹5Cr") return { min: 50000000, max: Infinity };
  return { min: 0, max: Infinity };
}

function matchesStatusLabel(
  status: string | undefined,
  statusLabel: string,
): boolean {
  const s = status?.toLowerCase();
  switch (statusLabel) {
    case "Completed":
      return s === "Completed" || s === "delivered";
    case "Ongoing":
      return s === "ongoing";
    case "Upcoming":
      return s === "Upcoming";
    case "New Launch":
      return s === "new launch";
    default:
      return false;
  }
}

export function useProjectFilters(
  projectsList: Project[],
  initialFilters: Partial<ProjectFiltersState> = {},
) {
  const [filters, setFilters] = useState<ProjectFiltersState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesCity =
        filters.cities.length === 0 ||
        filters.cities.some((city) =>
          project.location.toLowerCase().includes(city.toLowerCase()),
        );

      const matchesBudget =
        filters.budgets.length === 0 ||
        filters.budgets.some((budgetLabel) => {
          const { min, max } = parseBudgetRange(budgetLabel);
          return (
            typeof project.price === "number" &&
            project.price > 0 &&
            project.price >= min &&
            project.price <= max
          );
        });

      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.some((label) =>
          matchesStatusLabel(project.status, label),
        );

      return matchesSearch && matchesCity && matchesBudget && matchesStatus;
    });
  }, [projectsList, filters]);

  const isFiltering = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.cities.length > 0 ||
      filters.budgets.length > 0 ||
      filters.statuses.length > 0
    );
  }, [filters]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    filteredProjects,
    isFiltering,
    resetFilters,
  };
}
