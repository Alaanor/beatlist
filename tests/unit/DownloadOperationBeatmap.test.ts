import fs from "fs-extra";
import path from "path";
import DownloadOperationBeatmap from "@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmap";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatSaber from "@/libraries/os/beatSaber/BeatSaber";
import {
  DownloadOperationBeatmapResult,
  DownloadOperationBeatmapResultStatus,
} from "@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult";

const fakeInstallationPath = path.join(__dirname, "../data/fakeInstallation");
const fakeInstallationLevelsPath = path.join(
  fakeInstallationPath,
  path.join("Beat Saber_Data", "CustomLevels")
);
const sourceFooZipPath = path.join(__dirname, "../data/foo.zip");
const destinationFooZipPath = path.join(fakeInstallationLevelsPath, "foo.zip");
const destinationFooTxtPath = path.join(fakeInstallationLevelsPath, "foo.txt");

jest.mock("@/plugins/store", () => ({
  getters: {
    "settings/installationPath": path.join(
      __dirname,
      "../data/fakeInstallation"
    ),
  },
}));

jest.mock("@/libraries/net/downloader/DownloadUnit", () =>
  jest
    .fn()
    .mockImplementationOnce(() => ({
      onError: () => {},
      onCompleted: (callback: () => void) => {
        fs.copyFileSync(sourceFooZipPath, destinationFooZipPath);
        callback();
      },
    }))
    .mockImplementation(() => ({
      onError: () => {},
      onCompleted: (callback: () => void) => callback(),
    }))
);

jest.mock("electron", () => ({
  remote: {
    app: {
      getPath: () => fakeInstallationLevelsPath,
    },
  },
}));

describe("download operation beatmap", () => {
  afterEach(async () => {
    await fs.unlink(destinationFooZipPath);
    await fs.unlink(destinationFooTxtPath);
  });

  it("should download the beatmap", async () => {
    expect.assertions(2);

    const beatmap = {
      downloadURL: "foo",
      key: "foo",
    } as BeatsaverBeatmap;

    jest.spyOn(fs, "createWriteStream").mockImplementation();

    // eslint-disable-next-line jest/prefer-spy-on
    fs.mkdtemp = jest.fn().mockReturnValue(fakeInstallationLevelsPath);
    jest
      .spyOn(BeatSaber, "GetFolderPathFor")
      .mockImplementation()
      .mockReturnValue(fakeInstallationLevelsPath);

    await new Promise((done) => {
      const operationBeatmap = new DownloadOperationBeatmap(beatmap);

      operationBeatmap.OnCompleted(
        async (result: DownloadOperationBeatmapResult) => {
          const fooFile = (await fs.readFile(destinationFooTxtPath)).toString();

          expect(result.status).toBe(
            DownloadOperationBeatmapResultStatus.Success
          );
          expect(fooFile).toBe("foo");

          done();
        }
      );

      operationBeatmap.Start();
    });
  });
});
