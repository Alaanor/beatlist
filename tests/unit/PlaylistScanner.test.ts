import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import PlaylistScanner from '@/libraries/scanner/playlist/PlaylistScanner';

jest.mock('@/plugins/store', () => ({
  commit: () => {},
}));

describe('playlist scanner', () => {
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

    jest.spyOn(PlaylistLibrary, 'GetByPath')
      .mockReturnValue({} as PlaylistLocal);

    jest.spyOn(PlaylistLibrary, 'UpdateAllPlaylist')
      .mockImplementation(() => {});

    jest.spyOn(PlaylistLibrary, 'AddPlaylist')
      .mockImplementation(() => {});

    jest.spyOn(PlaylistLibrary, 'RemovePlaylist')
      .mockImplementation(() => {});

    const scanner = new PlaylistScanner();
    await scanner.scanAll();

    expect(scanner.result.newItems[0].path).toBe('foo');
    expect(scanner.result.newItems[1].path).toBe('foobar');
    expect(scanner.result.keptItems).toBe(1);
    expect(scanner.result.removedItems).toBe(1);
  });
});
