// redux/features/Calls/callsSlice.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import END_POINT from '@/config/endpoints';
import { getData, postData, putData } from '@/utils/api'; // <-- ensure putData exists

export interface CallNote {
  id?: string;
  content: string;
  created_at?: string;
}

export interface CallItem {
  id: string;
  call_type: 'missed' | 'answered' | 'voice mail';
  direction: 'inbound' | 'outbound';
  duration: number;
  from: string;
  to: string;
  via: string;
  created_at: string;
  is_archived?: boolean;
  notes?: CallNote[];
}

export interface CallsApiShape {
  nodes: CallItem[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface CallsState {
  calls: CallItem[];
  backupCalls: CallItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  perPage: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface FetchCallsParams {
  page?: number;
  perPage?: number;
}

export const addNote = createAsyncThunk<
  CallItem,
  { id: string; content: string },
  { rejectValue: string }
>('calls/addNote', async ({ id, content }, { rejectWithValue }) => {
  try {
    const url = `${END_POINT.CALLS}/${id}/note`;
    const { data } = await postData(url, { content });
    return data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Failed to add note';
    return rejectWithValue(message);
  }
});

/** PUT /calls/:id/archive (toggles archive/unarchive) */
export const archiveCall = createAsyncThunk<
  CallItem,
  { id: string, isArchiving: boolean },
  { rejectValue: string }
>('calls/archive', async ({ id }, { rejectWithValue }) => {
  try {
    const url = `${END_POINT.CALLS}/${id}/archive`;
    const { data } = await putData(url); // body is empty for this API
    return data; // server returns the updated Call
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Failed to archive call';
    return rejectWithValue(message);
  }
});

export const fetchCalls = createAsyncThunk<
  CallsApiShape,
  FetchCallsParams | void,
  { rejectValue: string }
>('calls/fetch', async (payload, { rejectWithValue }) => {
  try {
    const page = payload?.page ?? 1;
    const perPage = payload?.perPage ?? 10;
    const offset = (page - 1) * perPage;
    const url = `${END_POINT.CALLS}?offset=${offset}&limit=${perPage}`;
    const resp = await getData(url);
    const raw = (resp as any)?.data ?? resp;

    const nodes = raw?.nodes ?? raw?.data ?? [];
    const totalCount =
      typeof raw?.totalCount === 'number'
        ? raw.totalCount
        : Array.isArray(nodes)
        ? nodes.length
        : 0;
    const hasNextPage = Boolean(raw?.hasNextPage);

    return { nodes, totalCount, hasNextPage };
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? 'Failed to load calls';
    return rejectWithValue(message);
  }
});

const initialState: CallsState = {
  calls: [],
  backupCalls: [],
  status: 'idle',
  error: null,
  page: 1,
  perPage: 10,
  totalCount: 0,
  hasNextPage: false,
};

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    filterCalls(state, action: PayloadAction<string>) {
      const v = action.payload.toLowerCase().trim();
      const src = state.backupCalls;
      if (v === 'all') {
        state.calls = src.slice();
      } else if (v === 'archived') {
        state.calls = src.filter((c) => !!c.is_archived);
      } else if (v === 'unarchived' || v === 'active') {
        state.calls = src.filter((c) => !c.is_archived);
      } else {
        state.calls = src.filter((c) => (c.call_type ?? '').toLowerCase() === v);
      }
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
    clearCalls(state) {
      state.calls = [];
      state.backupCalls = [];
      state.totalCount = 0;
      state.hasNextPage = false;
      state.page = 1;
      state.status = 'idle';
      state.error = null;
    },
    /** handy reducer to apply call payloads from Pusher realtime */
    applyCallUpdate(state, action: PayloadAction<CallItem>) {
      const updated = action.payload;
      const replace = (arr: CallItem[]) => {
        const idx = arr.findIndex((c) => c.id === updated.id);
        if (idx !== -1) arr[idx] = updated;
      };
      replace(state.calls);
      replace(state.backupCalls);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalls.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchCalls.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.calls = payload.nodes;
        s.backupCalls = payload.nodes;
        s.totalCount = payload.totalCount;
        s.hasNextPage = payload.hasNextPage;
      })
      .addCase(fetchCalls.rejected, (s, { payload }) => {
        s.status = 'failed';
        s.error = (payload as string) ?? 'Failed to load calls';
      })
      // addNote -> replace call with updated payload
      .addCase(addNote.fulfilled, (s, { payload: updatedCall }) => {
        const replace = (arr: CallItem[]) => {
          const idx = arr.findIndex((c) => c.id === updatedCall.id);
          if (idx !== -1) arr[idx] = updatedCall;
        };
        replace(s.calls);
        replace(s.backupCalls);
        s.error = null;
      })
      .addCase(addNote.rejected, (s, { payload }) => {
        s.error = (payload as string) ?? 'Failed to add note';
      })
      // archive -> replace call with updated payload
      .addCase(archiveCall.fulfilled, (s, { payload: updatedCall }) => {
        const replace = (arr: CallItem[]) => {
          const idx = arr.findIndex((c) => c.id === updatedCall.id);
          if (idx !== -1) arr[idx] = updatedCall;
        };
        replace(s.calls);
        replace(s.backupCalls);
        s.error = null;
      })
      .addCase(archiveCall.rejected, (s, { payload }) => {
        s.error = (payload as string) ?? 'Failed to archive/unarchive';
      });
  },
});

export const { filterCalls, setPage, setPerPage, clearCalls, applyCallUpdate } = callsSlice.actions;
export default callsSlice.reducer;
