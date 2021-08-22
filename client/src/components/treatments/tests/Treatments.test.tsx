import { mockTreatments } from '../../../mocks/mockData';
import { render, screen, waitFor } from '../../../test-utils';
import { Treatments } from '../Treatments';

test('renders response from query', async () => {
  render(<Treatments />);

  // const treatmentHeadings = await screen.findAllByRole('heading', {
  //   name: /Massage|Facial|Scrub/,
  // });
  // expect(treatmentHeadings).toHaveLength(3);

  await waitFor(async () => {
    for (const treatment of mockTreatments) {
      // eslint-disable-next-line
      const heading = await screen.findByRole('heading', {
        name: treatment.name,
      });
      expect(heading).toBeInTheDocument();
    }
  });
});
