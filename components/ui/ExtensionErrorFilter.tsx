'use client';

import { useEffect } from 'react';

export default function ExtensionErrorFilter() {
  useEffect(() => {
    // Intercept console.error to swallow hydration mismatch warnings caused by browser extension attribute injections (e.g. bis_skin_checked)
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const msg = args.map((a) => (typeof a === 'string' ? a : a?.message || JSON.stringify(a) || '')).join(' ');
      if (
        msg.includes('bis_skin_checked') ||
        msg.includes('chrome-extension://') ||
        msg.includes('Hydration failed') ||
        msg.includes("didn't match") ||
        msg.includes('Text content does not match') ||
        msg.includes('Hydration')
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.filename?.includes('chrome-extension://') ||
        event.error?.stack?.includes('chrome-extension://') ||
        event.message?.includes('M_ID') ||
        event.message?.includes('bis_skin_checked') ||
        event.message?.includes('Hydration')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.stack?.includes('chrome-extension://') ||
        event.reason?.message?.includes('M_ID') ||
        event.reason?.message?.includes('bis_skin_checked') ||
        event.reason?.message?.includes('Hydration')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return null;
}
