import {Generate} from './mod';

describe('Generate', () => {
  context('.cli()', () => {
    it('should test cli', async () => {
      await Generate.cli(process);
    });
  });
});
