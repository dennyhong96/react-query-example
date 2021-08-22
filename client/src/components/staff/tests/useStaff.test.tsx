import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper } from '../../../test-utils';
import { useStaff } from '../hooks/useStaff';

test('filter staff', async () => {
  const { result, waitFor } = renderHook(() => useStaff(), {
    wrapper: createQueryClientWrapper(),
  });

  // Show all staff
  await waitFor(() => expect(result.current.staff).toHaveLength(4));

  // Set filter to only show facial staff
  act(() => result.current.setFilter('facial'));

  await waitFor(() => expect(result.current.staff).toHaveLength(3));
});
