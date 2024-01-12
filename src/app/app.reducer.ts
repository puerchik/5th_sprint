import { Dispatch } from "redux";
import { authActions } from "features/auth/auth.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "features/auth/auth.api";
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeApp.fulfilled, (state, action) => {
      state.isInitialized = action.payload.isInitialized;
    });
  },
});

const initializeApp = createAppAsyncThunk<{ isInitialized: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        return { isInitialized: true };
      } else {
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      return { isInitialized: true };
    }
  },
);

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const appThunks = { initializeApp };
