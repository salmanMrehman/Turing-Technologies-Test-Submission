/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import END_POINT from '@/config/endpoints';
import { postData } from '@/utils/api';
import { setTicket } from '@/utils/auth';

/** Request body sent to the API */
export interface LogInModel {
  username: string;
  password: string;
}

/** Shape returned by your API (adjust if needed) */
export interface AuthResponse {
  refresh_token: string;
  access_token: string;
  /** optional from backend: seconds until the access token expires */
  expires_in?: number;
}

/** Local slice state */
export interface AuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  access_token: string | null;
  refresh_token: string | null;
  /** epoch ms when access token expires */
  expiresAt: number | null;
}

const DEFAULT_EXP_SECONDS = 9 * 60; // 9 minutes

/** Thunk: POST /login */
export const logIn = createAsyncThunk<
  AuthResponse,
  LogInModel,
  { rejectValue: string }
>('auth/logIn', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await postData(END_POINT.LOGIN, payload);
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Login failed';
    return rejectWithValue(message);
  }
});

/** Thunk: POST /refresh using refresh_token */
export const refreshAccessToken = createAsyncThunk<
  AuthResponse,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>('auth/refresh', async (_void, { getState, rejectWithValue }) => {
  try {
    const rt = getState().auth.refresh_token;
    if (!rt) throw new Error('No refresh token');
    // Adjust body/endpoint to your API contract
    const { data } = await postData(END_POINT.REFRESH_TOKEN, {
      refresh_token: rt,
    });
    return data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Refresh failed';
    return rejectWithValue(message);
  }
});

const initialState: AuthState = {
  status: 'idle',
  error: null,
  access_token: null,
  refresh_token: null,
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.access_token = null;
      state.refresh_token = null;
      state.expiresAt = null;
      state.status = 'idle';
      state.error = null;
      setTicket(''); // clear persisted token if you want
    },
    setAuth(state, action: PayloadAction<AuthResponse>) {
      const { access_token, refresh_token, expires_in } = action.payload;
      state.access_token = access_token;
      state.refresh_token = refresh_token ?? null;
      state.expiresAt =
        Date.now() + 1000 * (typeof expires_in === 'number' ? expires_in : DEFAULT_EXP_SECONDS);
      state.status = 'succeeded';
      state.error = null;
      setTicket(access_token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        const { access_token, refresh_token, expires_in } = action.payload;
        state.status = 'succeeded';
        state.access_token = access_token;
        state.refresh_token = refresh_token ?? null;
        state.expiresAt =
          Date.now() + 1000 * (typeof expires_in === 'number' ? expires_in : DEFAULT_EXP_SECONDS);
        setTicket(access_token);
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
        state.access_token = null;
        state.refresh_token = null;
        state.expiresAt = null;
      })

      // Refresh
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const { access_token, refresh_token, expires_in } = action.payload;
        state.access_token = access_token;
        if (refresh_token) state.refresh_token = refresh_token;
        state.expiresAt =
          Date.now() + 1000 * (typeof expires_in === 'number' ? expires_in : DEFAULT_EXP_SECONDS);
        state.error = null;
        setTicket(access_token);
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        // Optional: force logout on refresh failure
        state.error = action.payload ?? 'Session expired';
        state.access_token = null;
        state.expiresAt = null;
        // keep refresh_token if you want to let user retry
      });
  },
});

export const { clearAuth, setAuth } = authSlice.actions;
export default authSlice.reducer;
