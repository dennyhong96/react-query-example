import { act, renderHook } from '@testing-library/react-hooks';

import { createQueryClientWrapper, wait } from '../../../test-utils';
import { useAppointments } from '../hooks/useAppointments';

test('filter appointments by availability', async () => {
  const { result, waitFor } = renderHook(() => useAppointments(), {
    wrapper: createQueryClientWrapper(),
  });

  // Wait for appointments to be populated
  await waitFor(() => expect(result.current.appointments).not.toEqual({}));

  const filteredAppointmentsLength = Object.values(
    result.current.appointments,
  ).flat(Infinity).length;

  // set setShowAll filter to true
  // act makes the change to a hook
  act(() => result.current.setShowAll(true));

  await waitFor(() => {
    const allAppointmentsLength = Object.values(
      result.current.appointments,
    ).flat(Infinity).length;
    expect(allAppointmentsLength).toBeGreaterThan(filteredAppointmentsLength);
  });
});
