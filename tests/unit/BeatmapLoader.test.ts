import path from 'path';
import BeatmapLoader from '@/libraries/beatmap/BeatmapLoader';
import BeatsaverAPI from '@/libraries/net/beatsaver/BeatsaverAPI';
import BeatmapLoadStateError from '@/libraries/beatmap/BeatmapLoadStateError';
import BeatmapHashComputer from '@/libraries/beatmap/BeatmapHashComputer';
import mockResponseSuccess from './helper/BeatsaverAPIResponseMocking';

jest.mock('@/plugins/store', () => {});
jest.mock('@/libraries/beatmap/repo/BeatsaverCachedLibrary', () => ({
  cacheBeatmap: () => {},
}));

describe('beatmap loader', () => {
  it('should load the map correctly', async () => {
    expect.assertions(6);

    const mockGetBeatmapByHash = jest.fn();
    const mockedAnswer = { foo: 'bar' };
    const mockedValue = mockResponseSuccess(mockedAnswer);

    mockGetBeatmapByHash.mockReturnValue(mockedValue);
    BeatsaverAPI.Singleton.getBeatmapByHash = mockGetBeatmapByHash;

    const beatmapFolder = path.join(__dirname, '../data/beatmap');
    const coverPath = path.join(__dirname, '../data/beatmap/cover.jpg');
    const songPath = path.join(__dirname, '../data/beatmap/song.egg');
    const beatmap = await (BeatmapLoader.Load(beatmapFolder));

    expect(beatmap).toBeDefined();
    expect(beatmap.loadState.valid).toBe(true);
    expect(beatmap.coverPath).toBe(coverPath);
    expect(beatmap.songPath).toBe(songPath);
    expect(beatmap.folderPath).toBe(beatmapFolder);
    expect(beatmap.hash).toBe('152DA020C774105DB2D70FCBFD4991EF2878384B');
  });

  it('should fail at infoDat', async () => {
    expect.assertions(2);

    const beatmapFolder = path.join(__dirname, '../data/');
    const beatmap = await (BeatmapLoader.Load(beatmapFolder));

    expect(beatmap.loadState.valid).toBe(false);
    expect(beatmap.loadState.errorType).toBe(BeatmapLoadStateError.NoInfoDatFileFound);
  });

  it('should fail at cover file', async () => {
    expect.assertions(2);

    const beatmapFolder = path.join(__dirname, '../data/beatmapWithoutCover');
    const beatmap = await (BeatmapLoader.Load(beatmapFolder));

    expect(beatmap.loadState.valid).toBe(false);
    expect(beatmap.loadState.errorType).toBe(BeatmapLoadStateError.NoCoverImageFound);
  });

  it('should fail at song file', async () => {
    expect.assertions(2);

    const beatmapFolder = path.join(__dirname, '../data/beatmapWithoutSong');
    const beatmap = await (BeatmapLoader.Load(beatmapFolder));

    expect(beatmap.loadState.valid).toBe(false);
    expect(beatmap.loadState.errorType).toBe(BeatmapLoadStateError.NoSoundFileFound);
  });

  it('should fail at hash', async () => {
    expect.assertions(2);

    const mockHashCompute = jest.fn();
    mockHashCompute.mockReturnValue(undefined);
    BeatmapHashComputer.Compute = mockHashCompute;

    const beatmapFolder = path.join(__dirname, '../data/beatmap');
    const beatmap = await (BeatmapLoader.Load(beatmapFolder));

    expect(beatmap.loadState.valid).toBe(false);
    expect(beatmap.loadState.errorType).toBe(BeatmapLoadStateError.FailedToComputeHash);
  });
});
