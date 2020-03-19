import path from 'path';
import fs from 'fs-extra';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import BeatsaverAPI from '@/libraries/net/beatsaver/BeatsaverAPI';
import Progress from '@/libraries/common/Progress';
import mockResponseSuccess from './helper/BeatsaverAPIResponseMocking';
import PlaylistLoadStateError from '@/libraries/playlist/loader/PlaylistLoadStateError';
import { PlaylistLoadStateInvalid } from '@/libraries/playlist/loader/PlaylistLoadState';

describe('playlist loader', () => {
  it('should fail if invalid path', async () => {
    expect.assertions(2);

    const playlist = await PlaylistLoader.Load('');

    expect(playlist.loadState.valid).toBe(false);
    expect((playlist.loadState as PlaylistLoadStateInvalid).errorType)
      .toBe(PlaylistLoadStateError.PathDoesntExist);
  });

  it('should not load an invalid playlist using the old format', async () => {
    expect.assertions(2);

    const oldFormatInvalid = path.join(__dirname, '../data/playlist/oldFormatInvalid.json');
    const playlist = await PlaylistLoader.Load(oldFormatInvalid);

    expect(playlist.loadState.valid).toBe(false);
    expect((playlist.loadState as PlaylistLoadStateInvalid).errorType)
      .toBe(PlaylistLoadStateError.FailedToParseOldFormat);
  });

  it('should not load an invalid playlist using the new format', async () => {
    expect.assertions(2);

    const newFormatInvalid = path.join(__dirname, '../data/playlist/newFormatInvalid.blist');
    const playlist = await PlaylistLoader.Load(newFormatInvalid);

    expect(playlist.loadState.valid).toBe(false);
    expect((playlist.loadState as PlaylistLoadStateInvalid).errorType)
      .toBe(PlaylistLoadStateError.FailedToParseNewFormat);
  });

  it('should load old format playlist', async () => {
    expect.assertions(6);

    const mockGetBeatmapByHash = jest.fn();

    mockGetBeatmapByHash.mockReturnValueOnce(mockResponseSuccess({ key: '75f1' }));
    mockGetBeatmapByHash.mockReturnValueOnce(mockResponseSuccess({ key: '765d' }));

    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const oldFormatBeatlist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist.json');
    const oldFormatPeepee = path.join(__dirname, '../data/playlist/oldFormatFromPeepee.bplist');

    const playlistBeatlist = await PlaylistLoader.Load(oldFormatBeatlist);
    const playlistPeepee = await PlaylistLoader.Load(oldFormatPeepee);

    expect(playlistBeatlist.loadState.valid).toBe(true);
    expect(playlistBeatlist.title).toBe('Test');
    expect(playlistBeatlist.maps[0].online?.key).toBe('75f1');

    expect(playlistPeepee.loadState.valid).toBe(true);
    expect(playlistPeepee.title).toBe('Not played (2019-12-22)');
    expect(playlistPeepee.maps[0].online?.key).toBe('765d');
  });

  it('should load new format playlist', async () => {
    expect.assertions(4);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValue = { key: '75f1' };
    mockGetBeatmapByHash.mockReturnValue(mockResponseSuccess(mockedValue));
    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const newFormatPlaylistFile = path.join(__dirname, '../data/playlist/newFormatFromBeatlist.blist');
    const playlist = await PlaylistLoader.Load(newFormatPlaylistFile);

    expect(playlist.loadState.valid).toBe(true);
    expect(playlist.title).toBe('Test');
    expect(playlist.author).toBe('Alaanor');
    expect(playlist.maps[0].online?.key).toBe('75f1');
  });

  it('should show a correct progress', async () => {
    expect.assertions(3);

    const newFormatPlaylistFile = path.join(__dirname, '../data/playlist/newFormatFromBeatlist.blist');
    const progress = new Progress();
    await PlaylistLoader.Load(newFormatPlaylistFile, false, progress);

    expect(progress.getRatio()).toBe(1);
    expect(progress.get().total).toBe(1);
    expect(progress.get().done).toBe(1);
  });

  it('should convert the old playlist to a new one', async () => {
    expect.assertions(10);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValue = { key: '75f1', hash: 'foo_bar' };
    mockGetBeatmapByHash.mockReturnValue(mockResponseSuccess(mockedValue));
    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const sourcePlaylist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist.json');
    const targetPlaylist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist-copy-tmp.json');
    const convertedPlaylist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist-copy-tmp.blist');
    await fs.copyFile(sourcePlaylist, targetPlaylist);

    const playlist = await PlaylistLoader.Load(targetPlaylist, true);

    expect(playlist.loadState.valid).toBe(true);
    expect(playlist.title).toBe('Test');
    expect(playlist.maps[0].online?.key).toBe('75f1');
    expect(await fs.pathExists(convertedPlaylist)).toBe(true);
    expect(await fs.pathExists(targetPlaylist)).toBe(false);

    const loadedPlaylist = await PlaylistLoader.Load(convertedPlaylist, true);

    expect(loadedPlaylist.loadState.valid).toBe(true);
    expect(loadedPlaylist.title).toBe('Test');
    expect(loadedPlaylist.maps[0].online?.key).toBe('75f1');
    expect(await fs.pathExists(convertedPlaylist)).toBe(true);
    expect(await fs.pathExists(targetPlaylist)).toBe(false);

    await fs.unlink(convertedPlaylist);
  });

  it('should save the playlist correctly', async () => {
    expect.assertions(5);

    const mockGetBeatmapByHash = jest.fn();
    const mockedValue = { key: '75f1' };
    mockGetBeatmapByHash.mockReturnValue(mockResponseSuccess(mockedValue));
    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

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

    await PlaylistLoader.SaveAt(playlistPath, playlistData);

    expect(await fs.pathExists(playlistPath)).toBe(true);

    const playlist = await PlaylistLoader.Load(playlistPath);

    expect(playlist.loadState.valid).toBe(true);
    expect(playlist.title).toBe('test');
    expect(playlist.cover?.toString()).toBe('test');
    expect(playlist.maps[0].online?.key).toBe('75f1');

    await fs.unlink(playlistPath);
  });

  it('should update the playlist', async () => {
    expect.assertions(9);

    const mockGetBeatmapByHash = jest.fn();

    // map fetch from 'toBeUpdated'
    mockGetBeatmapByHash.mockReturnValueOnce(mockResponseSuccess({ key: '1f90', hash: '2fddb136bda7f9e29b4cb6621d6d8e0f8a43b126' }));
    mockGetBeatmapByHash.mockReturnValueOnce(mockResponseSuccess({ key: '1db6', hash: '196d1061eac3cd4bc586e5afcaea07c35f1d69d0' }));

    // map fetched from 'updated'
    mockGetBeatmapByHash.mockReturnValueOnce(mockResponseSuccess({ key: '1db6', hash: '196d1061eac3cd4bc586e5afcaea07c35f1d69d0' }));
    mockGetBeatmapByHash.mockReturnValueOnce(mockResponseSuccess({ key: '1a33', hash: 'a5be6e439863b22bb0ca36e2f4ead53452e1b978' }));
    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const toBeUpdatedPath = path.join(__dirname, '../data/playlist/update/toBeUpdated.blist');
    const toBeUpdated = await PlaylistLoader.Load(toBeUpdatedPath);

    const progress = new Progress();
    const updatedPath = path.join(__dirname, '../data/playlist/update/updated.blist');
    const updated = await PlaylistLoader.update(toBeUpdated, updatedPath, progress);

    expect(updated.hash).not.toBe(toBeUpdated.hash);
    expect(updated.path).toBe(updatedPath);
    expect(updated.loadState.valid).toBe(true);
    expect(updated.author).toBe('bar');
    expect(updated.maps).toHaveLength(2);
    expect(updated.maps[0].online?.key).toBe('1db6');
    expect(updated.maps[1].online?.key).toBe('1a33');
    expect(progress.get().total).toBe(2);
    expect(progress.get().done).toBe(2);
  });
});
