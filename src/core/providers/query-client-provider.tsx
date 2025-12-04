import * as React from "react";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/core/lib/query-client";

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => queryClient);

  return <ReactQueryClientProvider client={client}>
    {children}
          <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>;
}
