import BeatmapScanner from '@/libraries/beatmap/BeatmapScanner';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import BeatmapLoader from '@/libraries/beatmap/BeatmapLoader';
import Progress from '@/libraries/common/Progress';

describe('beatmap scanner', () => {
  it('should only scan the difference', async () => {
    expect.assertions(7);

    jest.spyOn(BeatSaber, 'getAllSongFolderPath')
      .mockImplementation()
      .mockResolvedValue(['foo', 'bar', 'foobar']);

    jest.spyOn(BeatmapLibrary, 'GetAllMaps')
      .mockImplementation()
      .mockReturnValue([
        { folderPath: 'foo' } as BeatmapLocal,
        { folderPath: 'baz' } as BeatmapLocal,
      ]);

    jest.spyOn(BeatmapLoader, 'Load')
      .mockImplementation(
        (path: string) => Promise.resolve({ folderPath: path } as BeatmapLocal),
      );

    jest.spyOn(BeatmapLibrary, 'UpdateAllMaps')
      .mockImplementation();

    const progress = new Progress();
    const scanner = new BeatmapScanner();
    await scanner.ScanAll(progress);

    expect(scanner.newBeatmaps[0].folderPath).toBe('bar');
    expect(scanner.newBeatmaps[1].folderPath).toBe('foobar');
    expect(scanner.removedBeatmaps).toBe(1);
    expect(scanner.keptBeatmaps).toBe(1);
    expect(progress.get().done).toBe(2);
    expect(progress.get().total).toBe(2);
    expect(progress.getRatio()).toBe(1);
  });
});
