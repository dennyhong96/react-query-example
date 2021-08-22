import { rest } from 'msw';

import { mockStaff, mockTreatments } from '../../../mocks/mockData';
import { server } from '../../../mocks/server';
import { render, screen, waitFor } from '../../../test-utils';
import { AllStaff } from '../AllStaff';

test('renders response from query', async () => {
  render(<AllStaff />);

  // const staffHeadings = await screen.findAllByRole('heading', {
  //   name: /Divya|Sandra|Michael|Mateo/i,
  // });
  // expect(staffHeadings).toHaveLength(4);

  await waitFor(async () => {
    for (const staff of mockStaff) {
      // eslint-disable-next-line
      const staffHeading = await screen.findByRole('heading', {
        name: staff.name,
      });
      expect(staffHeading).toBeInTheDocument();
    }
  });
});

test('handles query error', async () => {
  server.resetHandlers(
    rest.get('http://localhost:3030/treatments', (req, res, ctx) => {
      return res(ctx.json(mockTreatments));
    }),
    // Overwrite staff handler
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  render(<AllStaff />);

  const toast = await screen.findByRole('alert');
  expect(toast).toBeInTheDocument();
  expect(toast).toHaveTextContent('Request failed with status code 500');
});
