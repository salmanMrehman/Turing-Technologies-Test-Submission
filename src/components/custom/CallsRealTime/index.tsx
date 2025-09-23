// src/components/system/CallsRealtime.tsx
'use client';

import * as React from 'react';
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux';
import { applyCallUpdate, type CallItem } from '@/redux/features/Calls/callsSlice';
import type { AppDispatch } from '@/store';
import COMMON_CONSTANTS from "@/constants/commanConstants";

export default function CallsRealtime() {
  const dispatch = useDispatch<AppDispatch>();
const accessToken = useSelector(
  (s: { auth?: { access_token?: string } }) => s.auth?.access_token ?? ""
);
  React.useEffect(() => {
    if (!accessToken) return; // no auth, don't connect

    const pusher = new Pusher(COMMON_CONSTANTS.API_KEY, {
      cluster: COMMON_CONSTANTS.APP_CLUSTER,
      authEndpoint: COMMON_CONSTANTS.PUSHER_SDK_AUTH,
      auth: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const channel = pusher.subscribe('private-aircall');

    channel.bind('update-call', (payload: CallItem) => {
      dispatch(applyCallUpdate(payload));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('private-aircall');
      pusher.disconnect();
    };
  }, [accessToken, dispatch]);

  return null;
}
