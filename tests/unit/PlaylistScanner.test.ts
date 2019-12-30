import PlaylistScanner from '@/libraries/playlist/PlaylistScanner';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistLoader from '@/libraries/playlist/PlaylistLoader';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';

describe('playlist beatmapScanner', () => {
  it('should only scan the difference', async () => {
    expect.assertions(4);

    jest.spyOn(BeatSaber, 'getAllPlaylistsPath')
      .mockImplementation()
      .mockResolvedValue(['foo', 'bar', 'foobar']);

    jest.spyOn(PlaylistLoader, 'Load')
      .mockImplementation(async (path: string) => ({ path } as PlaylistLocal));

    jest.spyOn(PlaylistLibrary, 'GetAllPlaylists')
      .mockReturnValue([
        { path: 'bar' } as PlaylistLocal,
        { path: 'baz' } as PlaylistLocal,
      ]);

    const scanner = new PlaylistScanner();
    await scanner.ScanAll();

    expect(scanner.newPlaylists[0].path).toBe('foo');
    expect(scanner.newPlaylists[1].path).toBe('foobar');
    expect(scanner.keptPlaylists).toBe(1);
    expect(scanner.removedPlaylists).toBe(1);
  });
});
