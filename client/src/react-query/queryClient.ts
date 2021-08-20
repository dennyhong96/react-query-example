import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

// useToast can only be called inside components
const toast = createStandaloneToast({ theme });

export function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = `react-query-error-${Math.random().toString(36).substr(2, 9)}`; // id is used as key, needs to be unique

  // error in JS can come from any throw statement, not just Error instances
  const title =
    error instanceof Error
      ? // remove the initial 'Error: ' that accompanies many errors
        error.toString().replace(/^Error:\s*/, '')
      : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();

  // Have to specify options manually because can't use useCustomToast, not in a component
  toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Suppressing aggresive default refetch behavior
      staleTime: 10 * 60 * 1000, // data is considered stale after 10 minutes (applies to queryClient.preFetch as well)
      cacheTime: 15 * 60 * 1000, // cache data for 15 minutes, have to be greater than staleTime (applies to queryClient.preFetch as well)
      retryOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,

      // Handle all useQuery error in a centralized place
      onError(error) {
        queryErrorHandler(error);
      },
      // useErrorBoundary - Set this to true to throw errors in the render phase and propagated to the nearest error boundary
    },

    mutations: {
      onError(error) {
        queryErrorHandler(error);
      },
    },
  },
});
