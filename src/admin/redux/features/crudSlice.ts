// src/redux/features/crudSlice.ts
// ─────────────────────────────────────────────────────────────────────────────
// Factory that creates a fully-typed Redux slice for any admin section.
// Each section gets its own isolated state: list, pagination, search, filters,
// loading flags, and error messages.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type Row = Record<string, unknown>;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  filters: Record<string, string | string[]>;
  sort: { field: string; order: "asc" | "desc" } | null;
}

export interface CrudState {
  rows: Row[];
  selectedRow: Row | null;
  pagination: PaginationMeta;
  filter: FilterState;
  loading: {
    list: boolean;
    detail: boolean;
    submit: boolean;
    delete: boolean;
  };
  error: {
    list: string | null;
    detail: string | null;
    submit: string | null;
    delete: string | null;
  };
}

/* -------------------------------------------------------------------------- */
/*                            THUNK ARGUMENT TYPES                            */
/* -------------------------------------------------------------------------- */

export interface FetchListArgs {
  endpoint: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, string | string[]>;
  sort?: { field: string; order: "asc" | "desc" } | null;
}

export interface FetchDetailArgs {
  endpoint: string;
  id: string;
}

export interface CreateArgs {
  endpoint: string;
  data: FormData | Record<string, unknown>;
}

export interface UpdateArgs {
  endpoint: string;
  id: string;
  data: FormData | Record<string, unknown>;
}

export interface DeleteArgs {
  endpoint: string;
  id: string;
}

/* -------------------------------------------------------------------------- */
/*                              INITIAL STATE                                 */
/* -------------------------------------------------------------------------- */

const buildInitialState = (): CrudState => ({
  rows: [],
  selectedRow: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filter: { search: "", filters: {}, sort: null },
  loading: { list: false, detail: false, submit: false, delete: false },
  error: { list: null, detail: null, submit: null, delete: null },
});

/* -------------------------------------------------------------------------- */
/*                           THUNK FACTORY                                    */
/* -------------------------------------------------------------------------- */

/**
 * Creates all async thunks for a given section name.
 * Section name is used to namespace the action types, e.g. "platter/fetchList".
 */
export function createCrudThunks(sectionName: string) {
  /** Fetch paginated list with optional search / filters / sort */
  const fetchList = createAsyncThunk(
    `${sectionName}/fetchList`,
    async (args: FetchListArgs, { rejectWithValue }) => {
      try {
        const { endpoint, page = 1, limit = 10, search, filters, sort } = args;

        const params: Record<string, unknown> = { page, limit };
        if (search) params.search = search;
        if (sort) {
          params.sortField = sort.field;
          params.sortOrder = sort.order;
        }
        if (filters) Object.assign(params, filters);

        const res = await api.get(endpoint, { params });

        // Supports both { data: [...] } and { data: { rows:[...], meta:{...} } }
        const payload = res.data?.data;

        // Extract pagination from either res.data.pagination or res.data.meta, or payload.pagination
        const extractedMeta = res.data?.pagination ?? res.data?.meta ?? payload?.meta ?? payload?.pagination;

        if (Array.isArray(payload)) {
          return {
            rows: payload,
            meta: extractedMeta ?? { page, limit, total: payload.length, totalPages: 1 },
          };
        }
        return {
          rows: payload?.rows ?? payload?.data ?? [],
          meta: extractedMeta ?? { page, limit, total: 0, totalPages: 0 },
        };
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data?.message ?? "Failed to fetch list",
        );
      }
    },
  );

  /** Fetch single record by id */
  const fetchDetail = createAsyncThunk(
    `${sectionName}/fetchDetail`,
    async ({ endpoint, id }: FetchDetailArgs, { rejectWithValue }) => {
      try {
        const res = await api.get(`${endpoint}/${id}`);
        return res.data?.data ?? res.data;
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data?.message ?? "Failed to fetch detail",
        );
      }
    },
  );

  /** Create a new record */
  const createRecord = createAsyncThunk(
    `${sectionName}/createRecord`,
    async ({ endpoint, data }: CreateArgs, { rejectWithValue }) => {
      try {
        const isFormData = data instanceof FormData;
        const res = await api.post(endpoint, data, {
          headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return res.data?.data ?? res.data;
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data?.message ?? "Failed to create",
        );
      }
    },
  );

  /** Update an existing record */
  const updateRecord = createAsyncThunk(
    `${sectionName}/updateRecord`,
    async ({ endpoint, id, data }: UpdateArgs, { rejectWithValue }) => {
      try {
        const isFormData = data instanceof FormData;
        const res = await api.patch(`${endpoint}/${id}`, data, {
          headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return res.data?.data ?? res.data;
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data?.message ?? "Failed to update",
        );
      }
    },
  );

  /** Delete a record by id */
  const deleteRecord = createAsyncThunk(
    `${sectionName}/deleteRecord`,
    async ({ endpoint, id }: DeleteArgs, { rejectWithValue }) => {
      try {
        await api.delete(`${endpoint}/${id}`);
        return id; // return id so the slice can remove it from rows
      } catch (err: any) {
        return rejectWithValue(
          err?.response?.data?.message ?? "Failed to delete",
        );
      }
    },
  );

  return { fetchList, fetchDetail, createRecord, updateRecord, deleteRecord };
}

/* -------------------------------------------------------------------------- */
/*                            SLICE FACTORY                                   */
/* -------------------------------------------------------------------------- */

/**
 * Creates a Redux slice for a given admin section.
 *
 * @param sectionName - Unique name, e.g. "platter", "amenities"
 *
 * Usage:
 *   const { slice, thunks } = createCrudSlice("platter");
 *   export const platterReducer = slice.reducer;
 *   export const platterThunks  = thunks;
 */
export function createCrudSlice(sectionName: string) {
  const thunks = createCrudThunks(sectionName);
  const { fetchList, fetchDetail, createRecord, updateRecord, deleteRecord } =
    thunks;

  const slice = createSlice({
    name: sectionName,
    initialState: buildInitialState(),
    reducers: {
      /** Update search/filter state (call this then re-fetch) */
      setFilter(state, action: PayloadAction<Partial<FilterState>>) {
        state.filter = { ...state.filter, ...action.payload };
        state.pagination.page = 1; // reset to page 1 on filter change
      },

      /** Jump to a specific page */
      setPage(state, action: PayloadAction<number>) {
        state.pagination.page = action.payload;
      },

      /** Change page size */
      setLimit(state, action: PayloadAction<number>) {
        state.pagination.limit = action.payload;
        state.pagination.page = 1;
      },

      /** Set total pages */
      setTotalPages(state, action: PayloadAction<number>) {
        state.pagination.totalPages = action.payload;
      },

      /** Clear the selected / detail row */
      clearSelectedRow(state) {
        state.selectedRow = null;
        state.error.detail = null;
      },

      /** Clear all errors */
      clearErrors(state) {
        state.error = { list: null, detail: null, submit: null, delete: null };
      },
    },

    extraReducers: (builder: ActionReducerMapBuilder<CrudState>) => {
      /* ── fetchList ── */
      builder
        .addCase(fetchList.pending, (state) => {
          state.loading.list = true;
          state.error.list = null;
        })
        .addCase(fetchList.fulfilled, (state, action) => {
          state.loading.list = false;
          state.rows = action.payload.rows;
          state.pagination = { ...state.pagination, ...action.payload.meta };
        })
        .addCase(fetchList.rejected, (state, action) => {
          state.loading.list = false;
          state.error.list = action.payload as string;
        });

      /* ── fetchDetail ── */
      builder
        .addCase(fetchDetail.pending, (state) => {
          state.loading.detail = true;
          state.error.detail = null;
          state.selectedRow = null;
        })
        .addCase(fetchDetail.fulfilled, (state, action) => {
          state.loading.detail = false;
          state.selectedRow = action.payload;
        })
        .addCase(fetchDetail.rejected, (state, action) => {
          state.loading.detail = false;
          state.error.detail = action.payload as string;
        });

      /* ── createRecord ── */
      builder
        .addCase(createRecord.pending, (state) => {
          state.loading.submit = true;
          state.error.submit = null;
        })
        .addCase(createRecord.fulfilled, (state, action) => {
          state.loading.submit = false;
          // Optimistically prepend the new row
          if (action.payload) {
            state.rows = [action.payload, ...state.rows];
            state.pagination.total += 1;
          }
        })
        .addCase(createRecord.rejected, (state, action) => {
          state.loading.submit = false;
          state.error.submit = action.payload as string;
        });

      /* ── updateRecord ── */
      builder
        .addCase(updateRecord.pending, (state) => {
          state.loading.submit = true;
          state.error.submit = null;
        })
        .addCase(updateRecord.fulfilled, (state, action) => {
          state.loading.submit = false;
          // Replace the updated row in the list
          const updated = action.payload;
          if (updated?.id) {
            state.rows = state.rows.map((row) =>
              row.id === updated.id ? updated : row,
            );
            if (state.selectedRow?.id === updated.id) {
              state.selectedRow = updated;
            }
          }
        })
        .addCase(updateRecord.rejected, (state, action) => {
          state.loading.submit = false;
          state.error.submit = action.payload as string;
        });

      /* ── deleteRecord ── */
      builder
        .addCase(deleteRecord.pending, (state) => {
          state.loading.delete = true;
          state.error.delete = null;
        })
        .addCase(deleteRecord.fulfilled, (state, action) => {
          state.loading.delete = false;
          // Remove the deleted row
          state.rows = state.rows.filter((row) => row.id !== action.payload);
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        })
        .addCase(deleteRecord.rejected, (state, action) => {
          state.loading.delete = false;
          state.error.delete = action.payload as string;
        });
    },
  });

  return { slice, thunks };
}
