import BeatSaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatSaverAPI';

jest.setTimeout(15 * 1e3);

describe('beatsaver api', () => {
  it('should find the correct map by hash', async () => {
    expect.assertions(2);

    const response = await BeatSaverAPI.Singleton.getBeatmapByHash('152da020c774105db2d70fcbfd4991ef2878384b');

    expect(response.status).toBe(BeatSaverAPIResponseStatus.ResourceFound);
    expect(response.data?.metadata.songName).toBe('Galactic Symphony');
  });

  it('shouldn\'t find a beatmap by hash', async () => {
    expect.assertions(2);

    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByHash('');

    expect(beatmap.status).toBe(BeatSaverAPIResponseStatus.ResourceNotFound);
    expect(beatmap.data).toBeUndefined();
  });

  it('should find the correct map by key', async () => {
    expect.assertions(2);

    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByKey('1d68');

    expect(beatmap.status).toBe(BeatSaverAPIResponseStatus.ResourceFound);
    expect(beatmap.data?.metadata.songName).toBe('Galactic Symphony');
  });

  it('shouldn\'t find a beatmap by key', async () => {
    expect.assertions(2);

    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByKey('');

    expect(beatmap.status).toBe(BeatSaverAPIResponseStatus.ResourceNotFound);
    expect(beatmap.data).toBeUndefined();
  });
});
