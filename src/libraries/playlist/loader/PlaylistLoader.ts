import crypto from "crypto";
import {
  PlaylistBase,
  PlaylistLocal,
  PlaylistMap,
} from "@/libraries/playlist/PlaylistLocal";
import Progress from "@/libraries/common/Progress";
import PlaylistLoadStateError from "@/libraries/playlist/loader/PlaylistLoadStateError";
import JsonSerializer from "@/libraries/playlist/loader/serializer/JsonSerializer";
import PlaylistFormatType from "@/libraries/playlist/PlaylistFormatType";
import PlaylistFilenameExtension, {
  FILENAME_EXTENSION_UNHANDLED,
} from "@/libraries/playlist/PlaylistFilenameExtension";
import JsonDeserializer, {
  FILE_NOT_FOUND,
  INVALID_JSON,
} from "@/libraries/playlist/loader/deserializer/JsonDeserializer";
import PlaylistDeserializer from "@/libraries/playlist/loader/deserializer/PlaylistDeserializer";
import PlaylistSerializer from "@/libraries/playlist/loader/serializer/PlaylistSerializer";
import PlaylistFilename from "@/libraries/playlist/PlaylistFilename";

export default class PlaylistLoader {
  public static async Load(
    filepath: string,
    progress?: Progress
  ): Promise<PlaylistLocal> {
    try {
      progress = progress ?? new Progress();

      const format = PlaylistFilenameExtension.detectType(filepath);
      const playlist = (await this.GetPlaylistBase(
        filepath,
        progress
      )) as PlaylistLocal;
      playlist.loadState = { valid: true, format };
      playlist.path = filepath;
      playlist.hash = this.computeHash(playlist, filepath);
      playlist.format = format;

      return playlist;
    } catch (e) {
      return this.handleError(e, filepath);
    }
  }

  public static async Save(
    playlist: PlaylistLocal,
    format?: PlaylistFormatType
  ): Promise<PlaylistLocal> {
    const noPathError = new Error("this playlist doesn't contain a path");
    if (playlist.path === undefined) throw noPathError;

    if (playlist.cover === null) {
      playlist.cover = await PlaylistLoader.LoadCover(playlist.path);
    }

    format = format ?? playlist.format;
    await this.SaveAt(playlist.path, playlist, format);

    if (!PlaylistFilename.isFilenameCorrect(playlist.path, playlist.title)) {
      playlist.path = await PlaylistFilename.renameToItsTitle(
        playlist.path,
        playlist.title
      );
    }

    if (!PlaylistFilenameExtension.isExtensionCorrect(playlist.path, format)) {
      playlist.path = await PlaylistFilenameExtension.RenameTo(
        playlist.path,
        format
      );
    }

    return playlist;
  }

  public static async SaveAt(
    filepath: string,
    playlist: PlaylistBase,
    format: PlaylistFormatType
  ): Promise<void> {
    let serializer: PlaylistSerializer;

    switch (format) {
      case PlaylistFormatType.Json:
        serializer = new JsonSerializer(filepath);
        break;
      case PlaylistFormatType.Blist:
      default:
        throw new Error("Invalid playlist export format specified");
    }

    await serializer.serialize(playlist);
  }

  public static LoadCover(playlistPath: string): Promise<Buffer | null> {
    return this.GetPlaylistBase(playlistPath).then((p) => p.cover);
  }

  private static async GetPlaylistBase(
    filepath: string,
    progress?: Progress
  ): Promise<PlaylistBase> {
    progress = progress ?? new Progress();
    let deserializer: PlaylistDeserializer;
    const format = PlaylistFilenameExtension.detectType(filepath);

    switch (format) {
      case PlaylistFormatType.Json:
        deserializer = new JsonDeserializer(filepath);
        break;

      case PlaylistFormatType.Blist:
      default:
        throw FILENAME_EXTENSION_UNHANDLED;
    }

    return deserializer.deserialize(progress);
  }

  private static handleError(e: any, filepath: string) {
    switch (e) {
      case FILE_NOT_FOUND:
        return this.buildEmptyPlaylist(
          undefined,
          e.message,
          PlaylistLoadStateError.PathDoesntExist
        );
      case INVALID_JSON:
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.FailedToParse
        );
      case FILENAME_EXTENSION_UNHANDLED:
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.FormatDoesntExist
        );
      default:
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.Unknown
        );
    }
  }

  private static computeHash(playlist: PlaylistBase, filepath: string): string {
    const safeEmptyPlaylist = {} as PlaylistBase;
    safeEmptyPlaylist.title = playlist.title;
    safeEmptyPlaylist.author = playlist.author;
    safeEmptyPlaylist.description = playlist.description;
    safeEmptyPlaylist.cover = playlist.cover;
    safeEmptyPlaylist.maps = playlist.maps.map((beatmap: PlaylistMap) => {
      const copy = { ...beatmap };
      delete copy.dateAdded;
      return copy;
    });

    return crypto
      .createHash("sha1")
      .update(JSON.stringify(safeEmptyPlaylist) + filepath.toLowerCase())
      .digest("hex")
      .substr(0, 5);
  }

  private static buildEmptyPlaylist(
    filepath: string | undefined,
    message: string,
    errorType: PlaylistLoadStateError
  ): PlaylistLocal {
    return {
      author: "",
      cover: null,
      description: null,
      maps: [],
      title: "",
      path: filepath,
      hash: undefined,
      loadState: {
        valid: false,
        errorMessage: message,
        errorType,
        format: undefined,
      },
      format: PlaylistFormatType.Unset,
    } as PlaylistLocal;
  }
}
