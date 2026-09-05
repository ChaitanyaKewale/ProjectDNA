'use client';

import { useEffect } from 'react';

export default function ExtensionErrorFilter() {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.filename?.includes('chrome-extension://') ||
        event.error?.stack?.includes('chrome-extension://') ||
        event.message?.includes('M_ID')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.stack?.includes('chrome-extension://') ||
        event.reason?.message?.includes('M_ID')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return null;
}
