// src/app/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Provider, useSelector } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from '@/lib/theme';
import '../../public/styles/globals.scss';
import Header from '@/components/custom/Header';
import TokenRefresher from '@/components/custom/RefreshToken';
import { Toaster } from 'react-hot-toast';
import CallsRealtime from '@/components/custom/CallsRealTime';

function RealtimeGate() {
  // read auth from redux; adjust selector to your auth slice name
  const accessToken = useSelector((s: {auth: {access_token: string}}) => s.auth?.access_token);
  const pathname = usePathname();
  const onCalls = pathname?.startsWith('/calls');

  // Mount realtime only if logged in (and optionally only on /calls)
  if (!accessToken) return null;
  if (!onCalls) return null; // remove this line if you want realtime globally

  return <CallsRealtime />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCalls = pathname?.startsWith('/calls');

  return (
    <html lang="en">
      <body className={isCalls ? 'bg-white' : undefined}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <TokenRefresher />
            {/* Realtime mount if logged in */}
            <RealtimeGate />

            <Header />
            <Box component="main" sx={{ minHeight: 'calc(100svh - 56px)' }}>
              {children}
            </Box>
          </ThemeProvider>
        </Provider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
