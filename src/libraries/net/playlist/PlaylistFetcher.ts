import os from "os";
import path from "path";
import fs from "fs-extra";
import fetch from "node-fetch";
import util from "util";
import stream from "stream";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistLoader from "@/libraries/playlist/loader/PlaylistLoader";
import Progress from "@/libraries/common/Progress";

const streamPipeline = util.promisify(stream.pipeline);

export default class PlaylistFetcher {
  public static async Fetch(
    url: string,
    progress?: Progress
  ): Promise<PlaylistLocal> {
    const tmpFolder = await fs.mkdtemp(path.join(os.tmpdir(), "beatlist-"));
    const tmpFile = path.join(tmpFolder, "playlist");

    await fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Unexpected response ${res.statusText}`);
        }

        return streamPipeline(res.body, fs.createWriteStream(tmpFile));
      })
      .catch((e: Error) => {
        throw new Error(`Failed to fetch the playlist. ${e.message}`);
      });

    const playlist = PlaylistLoader.Load(tmpFile, progress);
    await fs.rmdir(tmpFolder);

    return playlist;
  }
}
