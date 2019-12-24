import path from 'path';
import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import resolver from '@/libraries/os/pathResolver/Resolve';

jest.mock('@/libraries/os/pathResolver/Resolve');
jest.mock('@/plugins/store', () => ({
  getters: { 'settings/installationPath': path.join(__dirname, '../data/fakeInstallation') },
}));

describe('beatSaber', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should validate the path', async () => {
    expect.assertions(2);

    const goodPath = path.join(__dirname, '../data/fakeInstallation');
    const badPath = path.join(__dirname, '../data');

    expect(BeatSaber.validateInstallationPathSync(goodPath)).toBe(true);
    expect(BeatSaber.validateInstallationPathSync(badPath)).toBe(false);
  });

  it('should solve the installationPath', async () => {
    expect.assertions(1);

    const resp = 'foo';
    const mockResolver = resolver as jest.MockedFunction<typeof resolver>;
    mockResolver.mockImplementation(async () => resp);

    const installationPath = await BeatSaber.solveInstallationPath();
    expect(installationPath).toBe(resp);
  });

  it('should get all folder (supposed to be beatmap) in the folder', async () => {
    expect.assertions(2);

    const [first, second] = await BeatSaber.getAllSongFolderPath() ?? [];

    expect(first).toBe(path.join(__dirname, '../data/fakeInstallation/Beat Saber_Data/CustomLevels/bar'));
    expect(second).toBe(path.join(__dirname, '../data/fakeInstallation/Beat Saber_Data/CustomLevels/foo'));
  });

  it('should find all playlists file', async () => {
    expect.assertions(3);

    const [first, second, third] = await BeatSaber.getAllPlaylistsPath() ?? [];

    expect(first).toBe(path.join(__dirname, '../data/fakeInstallation/Playlists/file1'));
    expect(second).toBe(path.join(__dirname, '../data/fakeInstallation/Playlists/file2'));
    expect(third).toBeUndefined();
  });
});
