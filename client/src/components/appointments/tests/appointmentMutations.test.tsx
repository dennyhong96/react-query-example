import userEvent from '@testing-library/user-event';

import { mockUser } from '../../../mocks/mockData';
import { render, screen, waitForElementToBeRemoved } from '../../../test-utils';
import { UserProfile } from '../../user/UserProfile';
import { Calendar } from '../Calendar';

// mocking useUser to mimic a logged-in user
jest.mock('../../user/hooks/useUser', () => ({
  __esModule: true,
  useUser: () => ({ user: mockUser }), // Pretend we have a authenticated user
}));

test('Reserve appointment', async () => {
  render(<Calendar />);

  // find all the appointments
  const appointments = await screen.findAllByRole('button', {
    name: /\d\d? [ap]m\s+(scrub|facial|massage)/i,
  });

  // click on the first one to reserve
  userEvent.click(appointments[0]);

  // check for the toast alert
  const toast = await screen.findByRole('alert');
  expect(toast).toHaveTextContent('reserve');

  // close alert to keep state clean and wait for it to disappear
  const closeToastButton = screen.getByRole('button', { name: 'Close' });
  closeToastButton.click();

  // avoid jest async warnings
  await waitForElementToBeRemoved(toast);
});

test('Cancel appointment', async () => {
  render(<UserProfile />);

  const cancelButtons = await screen.findAllByRole('button', {
    name: 'cancel appointment',
  });

  userEvent.click(cancelButtons[0]);

  const toast = await screen.findByRole('alert');
  expect(toast).toHaveTextContent('removed');

  const closeToastButton = screen.getByRole('button', { name: 'Close' });
  closeToastButton.click();

  await waitForElementToBeRemoved(toast);
});
