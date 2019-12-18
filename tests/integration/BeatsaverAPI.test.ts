import BeatSaverAPI from 'src/libraries/net/beatsaver/BeatSaverAPI';

describe('beatsaver api', () => {
  it('should compute the correct hash', async () => {
    expect.assertions(2);

    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByHash('152da020c774105db2d70fcbfd4991ef2878384b');

    expect(beatmap).toBeDefined();
    expect(beatmap?.metadata.songName).toBe('Galactic Symphony');
  });

  it('shouldn\'t find a beatmap', async () => {
    expect.assertions(1);

    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByHash('');

    expect(beatmap).toBeUndefined();
  });
});
