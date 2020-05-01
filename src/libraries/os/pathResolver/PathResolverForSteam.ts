import path from "path";
import { promisify } from "util";
import fs, { PathLike } from "fs";
import regKey from "./Registry";

const access = promisify(fs.access);
const readFile = promisify(fs.readFile);

const STEAM_APP_ID: string = "620980";
const STEAM_REG_KEY: string =
  "\\Software\\WOW6432Node\\Valve\\PathResolverForSteam";
const STEAM_REG_VAL: string = "InstallPath";

export default class PathResolverForSteam {
  public static async findPath(): Promise<string | undefined> {
    const fromLibs = await PathResolverForSteam.findSteamPathFromLibraries();
    if (fromLibs !== undefined) {
      return fromLibs;
    }

    const fromReg = await PathResolverForSteam.findSteamPathFromRegistry();
    if (fromReg !== undefined) {
      return fromReg;
    }

    return undefined;
  }

  private static async findSteamPathFromRegistry(): Promise<
    string | undefined
  > {
    const key = await regKey(
      `\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App ${STEAM_APP_ID}`,
      "InstallLocation"
    );

    if (key === undefined) {
      return undefined;
    }
    return key;
  }

  private static async exists(pathToCheck: PathLike) {
    try {
      await access(pathToCheck, fs.constants.F_OK);
      return true;
    } catch (err) {
      if (err.code === "ENOENT") {
        return false;
      }
      throw err;
    }
  }

  private static parseManifest(manifestLines: string, library: string) {
    const regex = /\s"installdir"\s+"(.+)"/;
    const [installDir] = manifestLines
      .split("\n")
      .filter((line) => line.match(regex))
      .map((line) =>
        (regex.exec(line) as RegExpMatchArray)[1].replace(/\\\\/g, "\\")
      );

    return path.join(library, "common", installDir);
  }

  private static async findSteamLibraries() {
    const steamPath = await regKey(STEAM_REG_KEY, STEAM_REG_VAL);

    if (steamPath === undefined) {
      return [];
    }

    const baseDir = path.join(steamPath, "steamapps");
    const libraryFolders = await readFile(
      path.join(baseDir, "libraryfolders.vdf"),
      "utf8"
    );

    const regex = /\s"\d"\s+"(.+)"/;
    const libraries = libraryFolders
      .split("\n")
      .filter((line: string) => line.match(regex))
      .map((line: string) =>
        (regex.exec(line) as RegExpExecArray)[1].replace(/\\\\/g, "\\")
      )
      .map((line: string) => path.join(line, "steamapps"));

    return [baseDir, ...libraries];
  }

  private static async findSteamPathFromLibraries(): Promise<
    string | undefined
  > {
    const libraries = await PathResolverForSteam.findSteamLibraries();

    if (libraries.length === 0) {
      return undefined;
    }

    const manifests = await Promise.all(
      libraries.map(async (library) => {
        const test = path.join(library, `appmanifest_${STEAM_APP_ID}.acf`);
        const fileExists = await PathResolverForSteam.exists(test);
        return { path: test, library, fileExists };
      })
    );

    const filtered = manifests.filter((x) => x.fileExists);
    if (filtered.length === 0) {
      return undefined;
    }
    const [manifestInfo] = filtered;
    const manifestLines = await readFile(manifestInfo.path, "utf8");

    return this.parseManifest(manifestLines, manifestInfo.library);
  }
}
