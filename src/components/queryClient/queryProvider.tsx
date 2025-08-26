'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"; 
import { useState } from "react"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 30, 
          gcTime: 1000 * 60 * 60,    
          networkMode: 'offlineFirst',
          refetchOnReconnect: false,
          refetchOnWindowFocus: false,
        },
      },
    });

    if (typeof window !== "undefined") {
      const persister = createAsyncStoragePersister({
        storage: window.localStorage, 
        key: "react-query-exam",
      });

      persistQueryClient({
        queryClient: qc,
        persister,
        maxAge: 1000 * 60 * 60, 
      });
    }

    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
