// src/components/system/TokenRefresher.tsx
'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { refreshAccessToken } from '@/redux/features/Auth/authSlice';

const EARLY_SKEW_MS = 10_000;   // refresh ~10s early
const MIN_DELAY_MS = 5_000;     // minimum schedule

export default function TokenRefresher() {
  const dispatch = useDispatch<AppDispatch>();
  const { refresh_token, expiresAt } = useSelector((s: RootState) => s.auth);

  React.useEffect(() => {
    if (!refresh_token || !expiresAt) return;

    const now = Date.now();
    let delay = expiresAt - now - EARLY_SKEW_MS;
    if (delay < MIN_DELAY_MS) delay = MIN_DELAY_MS;

    const id = setTimeout(() => {
      dispatch(refreshAccessToken());
    }, delay);

    return () => clearTimeout(id);
  }, [dispatch, refresh_token, expiresAt]);

  // Optional: refresh when user returns and token is near expiry/expired
  React.useEffect(() => {
    const onFocus = () => {
      if (!refresh_token || !expiresAt) return;
      if (Date.now() >= expiresAt - EARLY_SKEW_MS) {
        dispatch(refreshAccessToken());
      }
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, [dispatch, refresh_token, expiresAt]);

  return null;
}
