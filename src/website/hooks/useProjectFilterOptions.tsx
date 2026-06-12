// hooks/useProjectFilterOptions.ts
import { useState, useEffect } from "react";

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
  const [cities, setCities] = useState<string[]>([
    "Govardhan",
    "Mathura",
    "Vrindavan",
    "Rukmani Vihar",
  ]);
  const [statuses, setStatuses] = useState<string[]>([
    "Completed",
    "Delivered",
    "Ongoing",
    "Upcoming",
    // "New Launch",
    // "Ready to Move",
  ]);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     async function fetchOptions() {
  //       try {
  //         const [citiesRes, statusesRes] = await Promise.all([
  //           fetch("/api/filter-cities"),
  //           fetch("/api/filter-statuses"),
  //         ]);
  //         setCities(await citiesRes.json());
  //         setStatuses(await statusesRes.json());
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     fetchOptions();
  //   }, []);

  return { cities, budgets: FILTER_BUDGETS, statuses, loading };
}
