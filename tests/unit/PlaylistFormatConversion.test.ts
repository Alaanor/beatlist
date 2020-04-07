import fs from 'fs-extra';
import path from 'path';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';
import { PlaylistLoadStateValid } from '@/libraries/playlist/loader/PlaylistLoadState';
import PlaylistFilenameExtension from '@/libraries/playlist/PlaylistFilenameExtension';

describe('playlist format conversion', () => {
  it('should convert the file, be loaded as json, written in blister, with the right file extension', async () => {
    expect.assertions(6);

    const original = path.join(__dirname, '../data/playlist/newFormatFromBeatlist.blist');
    const fromPath = path.join(__dirname, '../data/playlist/conversion-test.blist');
    const toPath = path.join(__dirname, '../data/playlist/conversion-test.json');

    fs.copyFileSync(original, fromPath);

    const playlist = await PlaylistLoader.Load(fromPath);

    expect(playlist.loadState.valid).toBe(true);
    expect((playlist.loadState as PlaylistLoadStateValid).format)
      .toBe(PlaylistFormatType.Blister);

    await PlaylistLoader.Save(playlist, PlaylistFormatType.Json);

    expect(fs.pathExistsSync(toPath)).toBe(true);
    expect(fs.pathExistsSync(fromPath)).toBe(false);

    const loadedPlaylist = await PlaylistLoader.Load(toPath);

    expect(loadedPlaylist.loadState.valid).toBe(true);
    expect((loadedPlaylist.loadState as PlaylistLoadStateValid).format)
      .toBe(PlaylistFormatType.Json);

    fs.removeSync(toPath);
  });

  it('should detect if extension is correct or not', () => {
    expect.assertions(4);

    expect(PlaylistFilenameExtension.isExtensionCorrect('foo/bar.blist', PlaylistFormatType.Blister))
      .toBe(true);
    expect(PlaylistFilenameExtension.isExtensionCorrect('foo/bar.blist', PlaylistFormatType.Json))
      .toBe(false);
    expect(PlaylistFilenameExtension.isExtensionCorrect('foo/bar.json', PlaylistFormatType.Json))
      .toBe(true);
    expect(PlaylistFilenameExtension.isExtensionCorrect('foo/bar.json', PlaylistFormatType.Blister))
      .toBe(false);
  });
});
