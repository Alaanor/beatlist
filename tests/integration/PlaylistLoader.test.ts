import path from 'path';
import fs from 'fs-extra';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLoader from '@/libraries/playlist/PlaylistLoader';
import BeatSaverAPI from '@/libraries/net/beatsaver/BeatSaverAPI';
import Progress, { ProgressStatus } from '@/libraries/common/Progress';

describe('playlist loader', () => {
  it('should fail if invalid path', async () => {
    expect.assertions(1);
    expect(await PlaylistLoader.Load('')).toBeUndefined();
  });

  it('should not load a playlist', async () => {
    expect.assertions(1);

    const oldFormatInvalid = path.join(__dirname, '../data/playlist/oldFormatInvalid.json');
    const playlist = await PlaylistLoader.Load(oldFormatInvalid);

    expect(playlist).toBeUndefined();
  });

  it('should load old format playlist', async () => {
    expect.assertions(4);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValueForBeatlist = { key: '75f1' };
    const mockedValueForPeepee = { key: '765d' };
    mockGetBeatmapByHash.mockReturnValueOnce(mockedValueForBeatlist);
    mockGetBeatmapByHash.mockReturnValueOnce(mockedValueForPeepee);
    BeatSaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const oldFormatBeatlist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist.json');
    const oldFormatPeepee = path.join(__dirname, '../data/playlist/oldFormatFromPeepee.bplist');

    const playlistBeatlist = await PlaylistLoader.Load(oldFormatBeatlist);
    const playlistPeepee = await PlaylistLoader.Load(oldFormatPeepee);

    expect(playlistBeatlist?.title).toBe('Test');
    expect(playlistBeatlist?.maps[0].online?.key).toBe('75f1');

    expect(playlistPeepee?.title).toBe('Not played (2019-12-22)');
    expect(playlistPeepee?.maps[0].online?.key).toBe('765d');
  });

  it('should load new format playlist', async () => {
    expect.assertions(4);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValue = { key: '75f1' };
    mockGetBeatmapByHash.mockReturnValue(mockedValue);
    BeatSaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const newFormatPlaylistFile = path.join(__dirname, '../data/playlist/newFormatFromBeatlist.blist');
    const playlist = await PlaylistLoader.Load(newFormatPlaylistFile);

    expect(playlist).toBeDefined();
    expect(playlist?.title).toBe('Test');
    expect(playlist?.author).toBe('Alaanor');
    expect(playlist?.maps[0].online?.key).toBe('75f1');
  });

  it('should show a correct progress', async () => {
    expect.assertions(4);

    const newFormatPlaylistFile = path.join(__dirname, '../data/playlist/newFormatFromBeatlist.blist');
    const progress = new Progress();
    await PlaylistLoader.Load(newFormatPlaylistFile, false, progress);

    expect(progress.status).toBe(ProgressStatus.Completed);
    expect(progress.getRatio()).toBe(1);
    expect(progress.total).toBe(1);
    expect(progress.done).toBe(1);
  });

  it('should convert the old playlist to a new one', async () => {
    expect.assertions(8);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValue = { key: '75f1' };
    mockGetBeatmapByHash.mockReturnValue(mockedValue);
    BeatSaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const sourcePlaylist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist.json');
    const targetPlaylist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist-copy-tmp.json');
    const convertedPlaylist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist-copy-tmp.blist');
    await fs.copyFile(sourcePlaylist, targetPlaylist);

    const playlist = await PlaylistLoader.Load(targetPlaylist, true);

    expect(playlist?.title).toBe('Test');
    expect(playlist?.maps[0].online?.key).toBe('75f1');
    expect(await fs.pathExists(convertedPlaylist)).toBe(true);
    expect(await fs.pathExists(targetPlaylist)).toBe(false);

    const loadedPlaylist = await PlaylistLoader.Load(convertedPlaylist, true);

    expect(loadedPlaylist?.title).toBe('Test');
    expect(loadedPlaylist?.maps[0].online?.key).toBe('75f1');
    expect(await fs.pathExists(convertedPlaylist)).toBe(true);
    expect(await fs.pathExists(targetPlaylist)).toBe(false);

    await fs.unlink(convertedPlaylist);
  });

  it('should save the playlist correctly', async () => {
    expect.assertions(5);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValue = { key: '75f1' };
    mockGetBeatmapByHash.mockReturnValue(mockedValue);
    BeatSaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const playlistPath = path.join(__dirname, '../data/playlist/testPlaylistLoaderSaveFunction.blist');
    const beatmap = { key: '75f1', hash: '01fb2aa5064d8e30105de66181be1b3fbc9fa28a' };
    const playlistData = {
      title: 'test',
      author: 'test',
      description: null,
      cover: Buffer.from('test'),
      maps: [
        {
          dateAdded: new Date(),
          online: beatmap,
        },
      ],
    } as PlaylistLocal;

    const done = await PlaylistLoader.Save(playlistPath, playlistData);

    expect(done).toBe(true);
    expect(await fs.pathExists(playlistPath)).toBe(true);

    const playlist = await PlaylistLoader.Load(playlistPath);

    expect(playlist).toBeDefined();
    expect(playlist?.title).toBe('test');
    expect(playlist?.maps[0].online?.key).toBe('75f1');

    await fs.unlink(playlistPath);
  });
});
