/* eslint-disable no-console */
import { render, RenderResult } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { generateQueryClient } from '../react-query/queryClient';

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {
    // swallow error in test
  },
});

export const generateTestQueryClient = (): QueryClient => {
  const client = generateQueryClient();
  const options = client.getDefaultOptions();

  // turn off query retry to avoid test timeout in error cases
  options.queries = { ...options.queries, retry: false };
  return client;
};

export const customRender = (
  ui: ReactElement,
  client?: QueryClient,
): RenderResult => {
  // Create a new query client every render() to make it deterministic
  const queryClient = client ?? generateTestQueryClient();
  return render(
    // Need MemoryRouter to render <Link/> without error
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
};

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  // Create a new query client every renderHook() to make it deterministic
  const queryClient = generateTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const customRenderHook = (callback) => {
  return renderHook(callback, {
    wrapper: createQueryClientWrapper(),
  });
};

export * from '@testing-library/react';

export { customRender as render };
export { customRenderHook as renderHook };
