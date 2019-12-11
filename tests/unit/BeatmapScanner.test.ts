import BeatmapScanner from '../../src/libraries/beatmap/BeatmapScanner';
import BeatSaber from '../../src/libraries/os/beatSaber/BeatSaber';
import BeatmapLibrary from '../../src/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '../../src/libraries/beatmap/BeatmapLocal';
import BeatmapLoader from '../../src/libraries/beatmap/BeatmapLoader';

describe('beatmap scanner', () => {
  it('should only scan the difference', async () => {
    expect.assertions(4);

    jest.spyOn(BeatSaber, 'getAllSongFolderPath')
      .mockImplementation()
      .mockResolvedValue(['foo', 'bar', 'foobar']);

    jest.spyOn(BeatmapLibrary, 'GetAllMaps')
      .mockImplementation()
      .mockReturnValue([
        { folderPath: 'foo' } as BeatmapLocal,
        { folderPath: 'baz' } as BeatmapLocal,
      ]);

    jest.spyOn(BeatmapLoader.prototype, 'Load')
      .mockImplementation(
        (path: string) => Promise.resolve({ folderPath: path } as BeatmapLocal),
      );

    jest.spyOn(BeatmapLibrary, 'UpdateAllMaps')
      .mockImplementation();

    const scanner = new BeatmapScanner();
    await scanner.ScanAll();

    expect(scanner.newBeatmaps[0].folderPath).toBe('bar');
    expect(scanner.newBeatmaps[1].folderPath).toBe('foobar');
    expect(scanner.removedBeatmaps).toBe(1);
    expect(scanner.keptBeatmaps).toBe(1);
  });
});
