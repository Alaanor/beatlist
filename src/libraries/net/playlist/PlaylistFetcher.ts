import os from "os";
import path from "path";
import fs from "fs-extra";
import fetch from "node-fetch";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistLoader from "@/libraries/playlist/loader/PlaylistLoader";
import Progress from "@/libraries/common/Progress";
import util from "util";
import stream from "stream";
import crypto from "crypto";

const streamPipeline = util.promisify(stream.pipeline);

export default class PlaylistFetcher {
  public static async Fetch(
    url: string,
    progress?: Progress
  ): Promise<PlaylistLocal> {
    const extension = url.split(".").slice(-1)[0] ?? ".json";
    const randHex = crypto.randomBytes(6).toString("hex");
    const tmpFile = path.join(
      os.tmpdir(),
      `beatlist-playlist-${randHex}.${extension}`
    );

    await this.download(url, fs.createWriteStream(tmpFile));

    const playlist = await PlaylistLoader.Load(tmpFile, progress);

    await fs.unlink(tmpFile);

    return playlist;
  }

  private static async download(url: string, writeStream: stream.Writable) {
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`unexpected response ${response.statusText}`);

    return streamPipeline(response.body, writeStream);
  }
}
