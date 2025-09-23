// src/lib/axios.ts
import axios, { AxiosResponse } from 'axios';
import { getTicket } from '@/utils/auth';
import toast from 'react-hot-toast';

type SuccessInfo = {
  method: string;
  url?: string;
  status: number;
  response: AxiosResponse['data'];
};

// Optional notifier callback you can set from anywhere in your app
let notifySuccess: ((info: SuccessInfo) => void) | null = null;
export function setApiSuccessNotifier(fn: (info: SuccessInfo) => void) {
  notifySuccess = fn;
}

const instance = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach token
instance.interceptors.request.use(
  (config) => {
    const token = getTicket();
    if (config.headers) {
      (config.headers as Record<string, string>)['Authorization'] = token ? `Bearer ${token}` : '';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: notify on successful POST/PUT
instance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const isMutation = method === 'post' || method === 'put';
    const ok = response.status >= 200 && response.status < 300;
    if (isMutation && ok) {   
        toast.success('Request has been processed successfully.');
    }
    return response;
  },
  (error) => {
    // pass through errors; you can also centralize error toast here if needed
    return Promise.reject(error);
  }
);

export default instance;
