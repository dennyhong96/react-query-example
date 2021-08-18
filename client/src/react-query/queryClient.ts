import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

// useToast can only be called inside components
const toast = createStandaloneToast({ theme });

export function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = 'react-query-error';

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
      // Handle all useQuery error in a centralized place
      onError(error) {
        queryErrorHandler(error);
      },
      // useErrorBoundary - Set this to true to throw errors in the render phase and propagated to the nearest error boundary
    },
  },
});
