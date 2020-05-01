import path from 'path';
import fs from 'fs-extra';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import BeatsaverAPI from '@/libraries/net/beatsaver/BeatsaverAPI';
import PlaylistLoadStateError from '@/libraries/playlist/loader/PlaylistLoadStateError';
import { PlaylistLoadStateInvalid } from '@/libraries/playlist/loader/PlaylistLoadState';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';
import { BeatsaverKey, BeatsaverKeyType } from '@/libraries/beatmap/repo/BeatsaverKeyType';
import mockResponseSuccess from './helper/BeatsaverAPIResponseMocking';

jest.mock('@/plugins/store', () => ({
  getters: { 'settings/defaultExportFormat': 'Json' },
}));

jest.mock('@/libraries/beatmap/repo/BeatsaverCachedLibrary', () => ({
  cacheBeatmap: async () => ({ loadState: { valid: true }, beatmap: { hash: 'foobar' } }),
  Get: (key: BeatsaverKey) => {
    if (key.type !== BeatsaverKeyType.Hash || key.value.toLowerCase() !== '01fb2aa5064d8e30105de66181be1b3fbc9fa28a') {
      return undefined;
    }

    return {
      beatmap: { hash: '01fb2aa5064d8e30105de66181be1b3fbc9fa28a' },
      loadState: { valid: true },
    };
  },
}));

describe('playlist loader, using the JSON as format', () => {
  it('should fail if invalid path', async () => {
    expect.assertions(2);

    const playlist = await PlaylistLoader.Load('unknown.json');

    expect(playlist.loadState.valid).toBe(false);
    expect((playlist.loadState as PlaylistLoadStateInvalid).errorType)
      .toBe(PlaylistLoadStateError.PathDoesntExist);
  });

  it('should not load an invalid playlist', async () => {
    expect.assertions(2);

    const oldFormatInvalid = path.join(__dirname, '../data/playlist/oldFormatInvalid.json');
    const playlist = await PlaylistLoader.Load(oldFormatInvalid);

    expect(playlist.loadState.valid).toBe(false);
    expect((playlist.loadState as PlaylistLoadStateInvalid).errorType)
      .toBe(PlaylistLoadStateError.FailedToParse);
  });

  it('should load a JSON format playlist', async () => {
    expect.assertions(6);

    const oldFormatBeatlist = path.join(__dirname, '../data/playlist/oldFormatFromBeatlist.json');
    const oldFormatPeepee = path.join(__dirname, '../data/playlist/oldFormatFromPeepee.bplist');

    const playlistBeatlist = await PlaylistLoader.Load(oldFormatBeatlist);
    const playlistPeepee = await PlaylistLoader.Load(oldFormatPeepee);

    expect(playlistBeatlist.loadState.valid).toBe(true);
    expect(playlistBeatlist.title).toBe('Test');
    expect(playlistBeatlist.maps[0].hash).toBe('01fb2aa5064d8e30105de66181be1b3fbc9fa28a');

    expect(playlistPeepee.loadState.valid).toBe(true);
    expect(playlistPeepee.title).toBe('Not played (2019-12-22)');
    expect(playlistPeepee.maps[0].hash).toBe('01fb2aa5064d8e30105de66181be1b3fbc9fa28a');
  });

  it('should save the playlist correctly using JSON format', async () => {
    expect.assertions(5);

    const mockGetBeatmapByHash = jest.fn();
    mockGetBeatmapByHash.mockReturnValue(mockResponseSuccess({}));
    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const playlistPath = path.join(__dirname, '../data/playlist/testPlaylistLoaderSaveFunction.json');
    const playlistData = {
      title: 'test',
      author: 'test',
      description: null,
      cover: Buffer.from('test'),
      maps: [
        {
          dateAdded: new Date(),
          hash: '01fb2aa5064d8e30105de66181be1b3fbc9fa28a',
        },
      ],
    } as PlaylistLocal;

    await PlaylistLoader.SaveAt(playlistPath, playlistData, PlaylistFormatType.Json);

    expect(await fs.pathExists(playlistPath)).toBe(true);

    const playlist = await PlaylistLoader.Load(playlistPath);

    expect(playlist.loadState.valid).toBe(true);
    expect(playlist.title).toBe('test');
    expect(playlist.cover?.toString()).toBe('test');
    expect(playlist.maps[0].hash).toBe('01fb2aa5064d8e30105de66181be1b3fbc9fa28a');

    await fs.unlink(playlistPath);
  });
});
