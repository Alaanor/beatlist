import path from 'path';
import BeatmapHashComputer from 'src/libraries/beatmap/BeatmapHashComputer';

describe('compute beatmap hash from a folder', () => {
  it('should compute the correct hash', async () => {
    expect.assertions(1);

    const folderPath = path.join(__dirname, '../data/beatmap');
    const hash = await BeatmapHashComputer.Compute(folderPath);

    expect(hash).toBe('152da020c774105db2d70fcbfd4991ef2878384b'.toUpperCase());
  });

  it('should not compute a hash', async () => {
    expect.assertions(1);

    const hash = await BeatmapHashComputer.Compute(__dirname);

    expect(hash).toBeUndefined();
  });
});
