import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Project } from "../components/projects/projects";
import { BASE_WEBSITE } from "@/config";

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
      return s === "completed" || s === "delivered";
    case "Ongoing":
      return s === "ongoing";
    case "Upcoming":
      return s === "upcoming";
    case "New Launch":
      return s === "new launch";
    default:
      return false;
  }
}

export interface ProjectStatusOption {
  id: string;
  name: string;
  slug?: string;
}

export function useProjectFilters(
  projectsList: Project[],
  initialFilters: Partial<ProjectFiltersState> = {},
  platterId?: string,
  initialStatusOptions: ProjectStatusOption[] = [],
  initialPagination?: any,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = 20;

  const [filters, setFilters] = useState<ProjectFiltersState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [apiProjects, setApiProjects] = useState<Project[]>(projectsList);
  const [statusOptions, setStatusOptions] =
    useState<ProjectStatusOption[]>(initialStatusOptions);
  const [pagination, setPagination] = useState<any>(initialPagination);

  useEffect(() => {
    if (initialStatusOptions && initialStatusOptions.length > 0) {
      setStatusOptions(initialStatusOptions);
    }
  }, [initialStatusOptions]);

  // Sync initial projects list when page loads/changes
  useEffect(() => {
    setApiProjects(projectsList);
  }, [projectsList]);

  // Keep pagination in sync with server initialPagination when no search/status filters are active
  useEffect(() => {
    if (!filters.search && filters.statuses.length === 0) {
      setPagination(initialPagination);
    }
  }, [initialPagination, filters.search, filters.statuses]);

  // Reset page parameter in URL when search or status filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("page")) {
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [filters.search, filters.statuses, pathname, router]);

  // Fetch projects from website/project when search, status filter, or page changes
  useEffect(() => {
    async function fetchFilteredProjects() {
      try {
        let url = `${BASE_WEBSITE}website/project?status=true&limit=${limit}&page=${currentPage}`;
        if (platterId) {
          url += `&platterId=${platterId}`;
        }
        if (filters.search) {
          url += `&search=${encodeURIComponent(filters.search)}`;
        }
        if (filters.statuses.length > 0) {
          // Map checked status display names back to status values/slugs
          filters.statuses.forEach((statusName) => {
            const found = statusOptions.find((so) => so.name === statusName);
            const val = found
              ? found.slug || found.id
              : statusName.toLowerCase();
            url += `&status=${encodeURIComponent(val)}`;
          });
        }

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const data = json.data || json || [];
          setPagination(json.pagination || null);

          const mapped = data.map((p: any) => {
            const typologyName = p.typology?.name || "";
            const subTypologies =
              p.projectSubTypology
                ?.map((st: any) => st.subTypology?.name?.trim())
                .filter(Boolean) || [];
            const combinedTypology =
              [typologyName, ...subTypologies].filter(Boolean).join(", ") || "";

            const matchedStatus = statusOptions.find(
              (so) => so.id === p.projectStatusId,
            );
            const statusName = matchedStatus ? matchedStatus.name : "Ongoing";

            return {
              id: p.id,
              slug: p.slug,
              title: p.projectName,
              categorySlug: p.platter?.slug || "",
              description: p.shortDescription || "",
              location: p.location || p.city?.name || "",
              year: p.createdAt ? new Date(p.createdAt).getFullYear() : 2026,
              price: p.price || 0,
              area: p.starting_size
                ? `${p.starting_size} ${p.size_unit || "Acres"}`
                : "",
              desktop_file: p.files?.desktop_image || "",
              mobile_file: p.files?.mobile_image || "",
              featured_img:
                p.files?.featured_desktop_file || p.files?.desktop_image || "",
              featured: p.is_featured || false,
              typology: combinedTypology,
              status: statusName,
              seq: Number(p.seq) || 0,
            };
          });
          setApiProjects(mapped);
        }
      } catch (err) {
        console.error("Error fetching filtered projects:", err);
      }
    }

    if (filters.search || filters.statuses.length > 0) {
      fetchFilteredProjects();
    } else {
      setApiProjects(projectsList);
    }
  }, [
    filters.search,
    filters.statuses,
    statusOptions,
    platterId,
    projectsList,
    currentPage,
  ]);

  const filteredProjects = useMemo(() => {
    return apiProjects.filter((project) => {
      const matchesSearch =
        !filters.search ||
        project.title.toLowerCase().includes(filters.search.toLowerCase());

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
  }, [apiProjects, filters]);

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
    pagination,
  };
}
