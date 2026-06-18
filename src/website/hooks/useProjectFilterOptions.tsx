import { useState } from "react";

export interface ProjectFilterOptions {
  cities: string[];
  budgets: string[];
  statuses: string[];
}

// budgets stay hardcoded since they're a UI concern, not API data
const FILTER_BUDGETS = [
  "Under ₹50L",
  "₹50L - ₹1Cr",
  "₹1Cr - ₹5Cr",
  "Above ₹5Cr",
];

export function useProjectFilterOptions(): ProjectFilterOptions & {
  loading: boolean;
} {
  const [cities] = useState<string[]>([
    "Govardhan",
    "Mathura",
    "Vrindavan",
    "Rukmani Vihar",
  ]);

  return { cities, budgets: FILTER_BUDGETS, statuses: [], loading: false };
}
