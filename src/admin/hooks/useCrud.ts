// src/admin/hooks/useCrud.ts
// ─────────────────────────────────────────────────────────────────────────────
// One hook that wires up everything a CRUD page needs:
//   - list data + pagination
//   - search / filter helpers
//   - fetchList, fetchDetail, create, update, delete
//   - loading & error states
//
// Usage:
//   const crud = useCrud("platter");
//   crud.rows          → current page rows
//   crud.fetchList()   → re-fetch (called automatically on mount)
//   crud.create(fd)    → POST + optimistic update
//   crud.update(id,fd) → PUT  + optimistic update
//   crud.remove(id)    → DELETE + remove from list
//   crud.setSearch("…")→ update search + re-fetch
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { crudActions, crudThunks } from "@/src/admin/redux/crudRegistry";
import { getSectionConfig } from "@/src/admin/config/adminConfig";
import type { FilterState, Row } from "@/src/admin/redux/features/crudSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import api from "@/src/admin/lib/axios";

export function useCrud(
  sectionKey: string,
  routeParams?: Record<string, string | number>,
) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const config = getSectionConfig(sectionKey);

  // Pull this section's slice out of the store
  // RootState is indexed by section key at runtime
  const state = useAppSelector((s: any) => s[sectionKey]);

  const actions = crudActions[sectionKey];
  const thunks = crudThunks[sectionKey];

  // Memoize routeParams to keep a stable reference
  const routeParamsStr = routeParams ? JSON.stringify(routeParams) : "";
  const stableRouteParams = useMemo(() => {
    return routeParams;
  }, [routeParamsStr]);

  // ── helpers ───────────────────────────────────────────────────────────────

  const replacePlaceholders = useCallback(
    (path: string) => {
      if (!stableRouteParams) return path;
      return path.replace(/\{(\w+)\}/g, (match, key) => {
        return stableRouteParams[key] !== undefined
          ? String(stableRouteParams[key])
          : match;
      });
    },
    [stableRouteParams],
  );

  const buildFetchArgs = useCallback(
    () => ({
      endpoint: replacePlaceholders(config.tableDataApi || config.endpoint),
      page: state.pagination.page,
      limit: state.pagination.limit,
      search: state.filter.search || undefined,
      filters: { ...config.queryParams, ...state.filter.filters },
      sort: state.filter.sort ?? undefined,
    }),
    [
      config.endpoint,
      config.tableDataApi,
      config.queryParams,
      state.pagination.page,
      state.pagination.limit,
      state.filter,
      replacePlaceholders,
    ],
  );

  // ── fetch list ────────────────────────────────────────────────────────────

  const fetchList = useCallback(() => {
    dispatch(thunks.fetchList(buildFetchArgs()));
  }, [dispatch, thunks, buildFetchArgs]);

  /** Fetch on mount */
  useEffect(() => {
    if (stableRouteParams) {
      const pathTemplate = config.tableDataApi || config.endpoint;
      const keys = Object.keys(stableRouteParams);
      const queryKeys = keys.filter(
        (key) => !pathTemplate.includes(`{${key}}`),
      );
      const isSynced = queryKeys.every(
        (key) => state.filter.filters[key] === String(stableRouteParams[key]),
      );
      if (!isSynced) return;
    }

    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.pagination.page,
    state.pagination.limit,
    state.filter,
    stableRouteParams,
    config.tableDataApi,
    config.endpoint,
  ]);

  // ── fetch single record ───────────────────────────────────────────────────

  const fetchDetail = useCallback(
    (id: string) => {
      dispatch(
        thunks.fetchDetail({
          endpoint: replacePlaceholders(config.endpoint),
          id,
        }),
      );
    },
    [dispatch, thunks, config.endpoint, replacePlaceholders],
  );

  // ── create ────────────────────────────────────────────────────────────────

  const create = useCallback(
    async (
      data: FormData | Record<string, unknown>,
      opts?: { redirectTo?: string | null; onSuccess?: (row: Row) => void },
    ) => {
      const result = await dispatch(
        thunks.createRecord({
          endpoint: replacePlaceholders(config.endpoint),
          data,
        }),
      );
      if (thunks.createRecord.fulfilled.match(result)) {
        opts?.onSuccess?.(result.payload as Row);
        if (opts?.redirectTo !== null) {
          router.push(opts?.redirectTo ?? `/admin/${sectionKey}`);
        }
        return result.payload as Row;
      }
      // Return the error message so the page can show it
      throw new Error(result.payload as string);
    },
    [
      dispatch,
      thunks,
      config.endpoint,
      router,
      sectionKey,
      replacePlaceholders,
    ],
  );

  // ── update ────────────────────────────────────────────────────────────────

  const update = useCallback(
    async (
      id: string,
      data: FormData | Record<string, unknown>,
      opts?: { redirectTo?: string | null; onSuccess?: (row: Row) => void },
    ) => {
      const result = await dispatch(
        thunks.updateRecord({
          endpoint: replacePlaceholders(config.endpoint),
          id,
          data,
        }),
      );
      if (thunks.updateRecord.fulfilled.match(result)) {
        opts?.onSuccess?.(result.payload as Row);
        if (opts?.redirectTo !== null) {
          router.push(opts?.redirectTo ?? `/admin/${sectionKey}`);
        }
        return result.payload as Row;
      }
      throw new Error(result.payload as string);
    },
    [
      dispatch,
      thunks,
      config.endpoint,
      router,
      sectionKey,
      replacePlaceholders,
    ],
  );

  // ── delete ────────────────────────────────────────────────────────────────

  const remove = useCallback(
    async (id: string, opts?: { onSuccess?: () => void }) => {
      const result = await dispatch(
        thunks.deleteRecord({
          endpoint: replacePlaceholders(config.endpoint),
          id,
        }),
      );
      if (thunks.deleteRecord.fulfilled.match(result)) {
        opts?.onSuccess?.();
        return;
      }
      throw new Error(result.payload as string);
    },
    [dispatch, thunks, config.endpoint, replacePlaceholders],
  );

  // ── updateSequence ──────────────────────────────────────────────────────────
  const updateSequence = useCallback(
    async (id: string, seq: number, customPath?: string) => {
      try {
        const path =
          customPath || `${replacePlaceholders(config.endpoint)}/${id}/seq`;
        const res = await api.patch(path, { seq });

        // refresh list
        fetchList();

        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [config.endpoint, fetchList, replacePlaceholders],
  );

  // ── filter / search / pagination ──────────────────────────────────────────

  const setSearch = useCallback(
    (search: string) => {
      dispatch(actions.setFilter({ search }));
    },
    [dispatch, actions],
  );

  const setFilters = useCallback(
    (filters: FilterState["filters"]) => {
      dispatch(actions.setFilter({ filters }));
    },
    [dispatch, actions],
  );

  const setSort = useCallback(
    (sort: FilterState["sort"]) => {
      dispatch(actions.setFilter({ sort }));
    },
    [dispatch, actions],
  );

  const setPage = useCallback(
    (page: number) => {
      dispatch(actions.setPage(page));
    },
    [dispatch, actions],
  );

  const setLimit = useCallback(
    (limit: number) => {
      dispatch(actions.setLimit(limit));
    },
    [dispatch, actions],
  );

  const setTotalPages = useCallback(
    (totalPages: number) => {
      dispatch(actions.setTotalPages(totalPages));
    },
    [dispatch, actions],
  );

  const clearErrors = useCallback(() => {
    dispatch(actions.clearErrors());
  }, [dispatch, actions]);

  // ── expose ────────────────────────────────────────────────────────────────

  return {
    // data
    rows: state.rows as Row[],
    selectedRow: state.selectedRow as Row | null,
    pagination: state.pagination,
    filter: state.filter,

    // loading flags
    isLoadingList: state.loading.list,
    isLoadingDetail: state.loading.detail,
    isSubmitting: state.loading.submit,
    isDeleting: state.loading.delete,

    // errors
    listError: state.error.list as string | null,
    detailError: state.error.detail as string | null,
    submitError: state.error.submit as string | null,
    deleteError: state.error.delete as string | null,

    // actions
    fetchList,
    fetchDetail,
    create,
    update,
    remove,
    setSearch,
    setFilters,
    setSort,
    setPage,
    setLimit,
    clearErrors,
    updateSequence,

    // section meta
    config,
    sectionKey,
  };
}
