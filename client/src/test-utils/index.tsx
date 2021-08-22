/* eslint-disable no-console */
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { generateQueryClient } from '../react-query/queryClient';
// import { defaultQueryClientOptions } from '../react-query/queryClient';

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    // swallow error
  },
});

export const generateTestQueryClient = (): QueryClient => {
  const client = generateQueryClient();
  const options = client.getDefaultOptions();

  // turn off query retry to avoid test timeout in error cases
  options.queries = { ...options.queries, retry: false };
  return client;
};

export const renderWithQueryClient = (
  ui: ReactElement,
  client?: QueryClient,
): RenderResult => {
  const queryClient = client ?? generateTestQueryClient();
  return render(
    // Need MemoryRouter for <Link/>
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
};

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrappe = () => {
  const queryClient = generateTestQueryClient();

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export * from '@testing-library/react';

export { renderWithQueryClient as render };
