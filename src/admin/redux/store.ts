import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { crudReducers } from "./crudRegistry";
import dashboardReducer from "./features/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ...crudReducers,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
