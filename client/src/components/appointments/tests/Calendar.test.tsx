import { rest } from 'msw';

import { server } from '../../../mocks/server';
import { render, screen } from '../../../test-utils';
import { Calendar } from '../Calendar';

// mocking useUser to mimic a logged-in user
// jest.mock('../../user/hooks/useUser', () => ({
//   __esModule: true,
//   useUser: () => ({ user: mockUser }),
// }));

test('Reserve appointment error', async () => {
  // (re)set handler to overwrite defaults and return a 500 error for appointments
  server.resetHandlers(
    rest.get(
      'http://localhost:3030/appointments/:month/:year',
      (req, res, ctx) => {
        return res(ctx.status(500));
      },
    ),
  );

  render(<Calendar />);

  const toast = await screen.findByRole('alert');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('Request failed with status code 500');
});
