import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface DashboardState {
  stats: {
    platter: number;
    projects: number;
    typologies: number;
    subTypologies: number;
    amenities: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    platter: 0,
    projects: 0,
    typologies: 0,
    subTypologies: 0,
    amenities: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const results = await Promise.allSettled([
        api.get("admin/platter?limit=1"),
        api.get("admin/project?limit=1"),
        api.get("admin/typology?limit=1"),
        api.get("admin/subtypology?limit=1"),
        api.get("admin/amenities?limit=1"),
        api.get("admin/pages?limit=1"),
      ]);

      const getTotal = (result: any) =>
        result.status === "fulfilled"
          ? result.value.data?.pagination?.total || 0
          : 0;

      return {
        platter: getTotal(results[0]),
        projects: getTotal(results[1]),
        typologies: getTotal(results[2]),
        subTypologies: getTotal(results[3]),
        amenities: getTotal(results[4]),
        pages: getTotal(results[5]),
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch dashboard stats");
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })

      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
