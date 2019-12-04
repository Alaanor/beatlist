import BeatlistRepo from './BeatlistRepo';

describe('beatlist repo', () => {
  it('changelog content fetcher', async () => {
    expect.assertions(2);

    const repo = new BeatlistRepo();
    const data = await repo.GetChangelogContent();

    expect(data).toBeDefined();
    expect(data).toMatch(/^# Changelog/);
  });
});
