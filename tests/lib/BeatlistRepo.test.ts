import BeatlistRepo from '../../src/libraries/net/github/BeatlistRepo';
import AxiosCachedFactory from '../../src/libraries/net/AxiosCachedFactory';

jest.mock('../../src/libraries/net/AxiosCachedFactory');

describe('beatlist repo', () => {
  it('should get the changelog content', async () => {
    expect.assertions(2);

    const mockGetAxios = jest.fn();
    mockGetAxios.mockReturnValue({
      get: async () => ({ data: '# Changelog' }),
    });

    AxiosCachedFactory.getAxios = mockGetAxios;

    const repo = new BeatlistRepo();
    const data = await repo.GetChangelogContent();

    expect(data).toBeDefined();
    expect(data).toMatch(/^# Changelog/);
  });

  it('shouldn\'t get the changelog content, 404', async () => {
    expect.assertions(1);

    const mockGetAxios = jest.fn();
    mockGetAxios.mockImplementation(() => ({
      get: async () => {
        throw new Error('no internet for you human');
      },
    }));

    AxiosCachedFactory.getAxios = mockGetAxios;

    const repo = new BeatlistRepo();
    const data = await repo.GetChangelogContent();

    expect(data).toBeUndefined();
  });
});
