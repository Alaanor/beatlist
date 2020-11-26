import BeatmapScanner from "@/libraries/scanner/beatmap/BeatmapScanner";
import BeatSaber from "@/libraries/os/beatSaber/BeatSaber";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import { Beatmap } from "@/libraries/beatmap/Beatmap";
import BeatmapLoader from "@/libraries/beatmap/BeatmapLoader";
import Progress from "@/libraries/common/Progress";

jest.mock("@/plugins/store", () => {});

describe("beatmap beatmapScanner", () => {
  it("should only scan the difference", async () => {
    expect.assertions(7);

    jest
      .spyOn(BeatSaber, "getAllSongFolderPath")
      .mockImplementation()
      .mockResolvedValue(["foo", "bar", "foobar"]);

    jest
      .spyOn(BeatmapLibrary, "GetAllMaps")
      .mockImplementation()
      .mockReturnValue([
        { folderPath: "foo" } as Beatmap,
        { folderPath: "baz" } as Beatmap,
      ]);

    jest
      .spyOn(BeatmapLoader, "Load")
      .mockImplementation((path: string) =>
        Promise.resolve({ folderPath: path } as Beatmap)
      );

    jest.spyOn(BeatmapLibrary, "UpdateAllMaps").mockImplementation();

    const progress = new Progress();
    const scanner = new BeatmapScanner();
    await scanner.scanAll(progress);

    expect(scanner.result.newItems[0].folderPath).toBe("bar");
    expect(scanner.result.newItems[1].folderPath).toBe("foobar");
    expect(scanner.result.removedItems).toBe(1);
    expect(scanner.result.keptItems).toBe(1);
    expect(progress.get().done).toBe(2);
    expect(progress.get().total).toBe(2);
    expect(progress.getRatio()).toBe(1);
  });
});
