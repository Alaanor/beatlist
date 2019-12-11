import BeatmapScanner from '../../src/libraries/beatmap/BeatmapScanner';
import BeatSaber from '../../src/libraries/os/beatSaber/BeatSaber';
import BeatmapLibrary from '../../src/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '../../src/libraries/beatmap/BeatmapLocal';
import BeatmapLoader from '../../src/libraries/beatmap/BeatmapLoader';

describe('beatmap scanner', () => {
  it('should only scan the difference', async () => {
    expect.assertions(2);

    jest.spyOn(BeatSaber, 'getAllSongFolderPath')
      .mockImplementation()
      .mockResolvedValue(['foo', 'bar', 'foobar']);

    jest.spyOn(BeatmapLibrary, 'GetAllMaps')
      .mockImplementation()
      .mockReturnValue([
        { folderPath: 'foo' } as BeatmapLocal,
      ]);

    jest.spyOn(BeatmapLoader.prototype, 'Load')
      .mockImplementation(
        (path: string) => Promise.resolve({ folderPath: path } as BeatmapLocal),
      );

    const [first, second] = await BeatmapScanner.ScanAll();

    expect(first.folderPath).toBe('bar');
    expect(second.folderPath).toBe('foobar');
  });
});
