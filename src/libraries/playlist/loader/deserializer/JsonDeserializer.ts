import fs from "fs-extra";
import PlaylistDeserializer from "@/libraries/playlist/loader/deserializer/PlaylistDeserializer";
import {
  PlaylistBase,
  PlaylistLocalMap,
  PlaylistMapImportError,
} from "@/libraries/playlist/PlaylistLocal";
import Base64SrcLoader from "@/libraries/os/utils/Base64SrcLoader";
import Progress from "@/libraries/common/Progress";
import PlaylistDeserializeBeatsaverBeatmap from "@/libraries/playlist/loader/deserializer/helper/PlaylistDeserializeBeatsaverBeatmap";
import {
  BeatsaverItem,
  BeatsaverItemLoadError,
} from "@/libraries/beatmap/repo/BeatsaverItem";

export const FILE_NOT_FOUND: Error = new Error("File not found");
export const INVALID_JSON: Error = new Error("Invalid JSON");

export default class JsonDeserializer extends PlaylistDeserializer {
  public async deserialize(progress?: Progress): Promise<PlaylistBase> {
    if (!(await fs.pathExists(this.filepath))) {
      throw FILE_NOT_FOUND;
    }

    const rawJson = await fs.readFile(this.filepath);

    try {
      const json = JSON.parse(rawJson.toString());
      JsonDeserializer.validateJson(json);

      return {
        title: json.playlistTitle,
        author: json.playlistAuthor ?? "",
        description: json.playlistDescription ?? "",
        cover: Buffer.from(
          Base64SrcLoader.GetRawSrc(json.image ?? ""),
          "base64"
        ),
        maps: await JsonDeserializer.convertToHash(
          json.songs ?? [],
          progress ?? new Progress()
        ),
      } as PlaylistBase;
    } catch (e) {
      throw INVALID_JSON;
    }
  }

  private static validateJson(json: any) {
    // check for required fields
    if (!json.playlistTitle) {
      throw new Error("missing required fields");
    }
  }

  private static async convertToHash(
    songs: { hash: string | undefined; key: string | undefined }[],
    progress: Progress
  ): Promise<PlaylistLocalMap[]> {
    return (await PlaylistDeserializeBeatsaverBeatmap.convert(songs, progress))
      .filter((item): item is BeatsaverItem => item !== undefined)
      .map(
        (item: BeatsaverItem) =>
          ({
            dateAdded: new Date(),
            hash: item?.beatmap?.hash,
            attemptedSource: item.loadState.attemptedSource,
            ...this.getErrorFor(item),
          } as PlaylistLocalMap)
      );
  }

  private static getErrorFor(
    item: BeatsaverItem
  ): { error?: PlaylistMapImportError; errorInfo?: string } {
    if (item.loadState.valid) {
      return { error: undefined, errorInfo: undefined };
    }

    switch (item.loadState.errorType) {
      case BeatsaverItemLoadError.BeatmapNotOnBeatsaver:
        return {
          error: PlaylistMapImportError.BeatsaverInexistent,
          errorInfo: "Beatmap not found on beatsaber",
        };
      case BeatsaverItemLoadError.BeatsaverServerNotAvailable:
        return {
          error: PlaylistMapImportError.BeatsaverRequestError,
          errorInfo: "Server not available",
        };
      case BeatsaverItemLoadError.InvalidDataReceivedFromBeatsaver:
        return {
          error: PlaylistMapImportError.BeatsaverRequestError,
          errorInfo: "Unexpected data received from beatsaber",
        };
      case BeatsaverItemLoadError.BeatsaverRateLimited:
        return {
          error: PlaylistMapImportError.BeatsaverRequestError,
          errorInfo: "Reached the rate limit",
        };

      case BeatsaverItemLoadError.RequestTimeout:
        return {
          error: PlaylistMapImportError.BeatsaverRequestError,
          errorInfo: "Request timeout",
        };

      case BeatsaverItemLoadError.Unknown:
      default:
        return { error: PlaylistMapImportError.Unknown, errorInfo: "Unknown" };
    }
  }
}
