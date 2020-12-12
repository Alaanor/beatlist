import events from "events";
import Progress from "@/libraries/common/Progress";
import ProgressGroup from "@/libraries/common/ProgressGroup";
import PlaylistScanner from "@/libraries/scanner/playlist/PlaylistScanner";
import BeatmapScanner from "@/libraries/scanner/beatmap/BeatmapScanner";
import BeatmapScannerResult from "@/libraries/scanner/beatmap/BeatmapScannerResult";
import PlaylistScannerResult from "@/libraries/scanner/playlist/PlaylistScannerResult";

const ON_SCAN_START = "on_scan_start";
const ON_SCAN_COMPLETED = "on_scan_completed";
const ON_BEATMAP_SCAN_COMPLETED = "on_beatmap_scan_completed";
const ON_PLAYLIST_SCAN_COMPLETED = "on_playlist_scan_completed";
const ON_REQUEST_DIALOG_OPEN = "on_request_dialog_open";
const ON_SCANNING_STATE_UPDATE = "on_scanning_state_update";

export default class ScannerService {
  static get playlistProgress(): ProgressGroup {
    return this._playlistProgress;
  }

  static get beatmapProgress(): Progress {
    return this._beatmapProgress;
  }

  public static get isScanning(): boolean {
    return this.locked;
  }

  private static _scanning: { beatmap: boolean; playlist: boolean } = {
    beatmap: false,
    playlist: false,
  };

  public static get scanning(): { beatmap: boolean; playlist: boolean } {
    return this._scanning;
  }

  private static set scanningBeatmap(value: boolean) {
    this._scanning.beatmap = value;
    this.eventEmitter.emit(ON_SCANNING_STATE_UPDATE);
  }

  private static set scanningPlaylist(value: boolean) {
    this._scanning.playlist = value;
    this.eventEmitter.emit(ON_SCANNING_STATE_UPDATE);
  }

  private static eventEmitter: events.EventEmitter = new events.EventEmitter();

  private static locked: boolean = false;

  private static operation:
    | "beatmap"
    | "playlist"
    | "all"
    | undefined = undefined;

  private static _beatmapProgress: Progress = new Progress();

  private static _playlistProgress: ProgressGroup = new ProgressGroup();

  public static async ScanAll(): Promise<void> {
    if (this.locked) return undefined;
    this.operation = "all";

    this.eventEmitter.emit(ON_SCAN_START);
    return this.ScanBeatmaps().then(() => this.ScanPlaylists());
  }

  public static async ScanBeatmaps(): Promise<void> {
    if (this.locked) return undefined;

    this.scanningBeatmap = true;
    this.locked = true;
    this.operation = this.operation ?? "beatmap";
    this._beatmapProgress = new Progress();
    this.eventEmitter.emit(ON_SCAN_START);

    return new BeatmapScanner()
      .scanAll(this._beatmapProgress)
      .then((result: BeatmapScannerResult) => {
        this.locked = false;
        this.scanningBeatmap = false;
        this.eventEmitter.emit(ON_BEATMAP_SCAN_COMPLETED, result);
        this.checkForEndOperation("beatmap");
      });
  }

  public static async ScanPlaylists(): Promise<void> {
    if (this.locked) return undefined;

    this.scanningPlaylist = true;
    this.locked = true;
    this.operation = this.operation ?? "playlist";
    this._playlistProgress = new ProgressGroup();
    this.eventEmitter.emit(ON_SCAN_START);

    return new PlaylistScanner()
      .scanAll(this._playlistProgress)
      .then((result: PlaylistScannerResult) => {
        this.locked = false;
        this.scanningPlaylist = false;
        this.eventEmitter.emit(ON_PLAYLIST_SCAN_COMPLETED, result);
        this.checkForEndOperation("playlist");
      });
  }

  private static checkForEndOperation(from: "beatmap" | "playlist") {
    switch (from) {
      case "beatmap":
        if (this.operation === "beatmap") {
          this.eventEmitter.emit(ON_SCAN_COMPLETED);
          this.operation = undefined;
        }
        break;

      case "playlist":
        if (this.operation === "playlist" || this.operation === "all") {
          this.eventEmitter.emit(ON_SCAN_COMPLETED);
          this.operation = undefined;
        }
        break;

      default:
        break;
    }
  }

  public static requestDialogToBeOpened() {
    this.eventEmitter.emit(ON_REQUEST_DIALOG_OPEN);
  }

  public static onBeatmapScanCompleted(
    callback: (result: BeatmapScannerResult) => void
  ) {
    this.eventEmitter.on(ON_BEATMAP_SCAN_COMPLETED, callback);
  }

  public static offBeatmapScanCompleted(
    callback: (result: BeatmapScannerResult) => void
  ) {
    this.eventEmitter.off(ON_BEATMAP_SCAN_COMPLETED, callback);
  }

  public static onPlaylistScanCompleted(
    callback: (result: PlaylistScannerResult) => void
  ) {
    this.eventEmitter.on(ON_PLAYLIST_SCAN_COMPLETED, callback);
  }

  public static offPlaylistScanCompleted(
    callback: (result: PlaylistScannerResult) => void
  ) {
    this.eventEmitter.off(ON_PLAYLIST_SCAN_COMPLETED, callback);
  }

  public static onScanStart(callback: () => void) {
    this.eventEmitter.on(ON_SCAN_START, callback);
  }

  public static offScanStart(callback: () => void) {
    this.eventEmitter.off(ON_SCAN_START, callback);
  }

  public static onScanCompleted(callback: () => void) {
    this.eventEmitter.on(ON_SCAN_COMPLETED, callback);
  }

  public static offScanCompleted(callback: () => void) {
    this.eventEmitter.off(ON_SCAN_COMPLETED, callback);
  }

  public static onStatusDialogRequestOpen(callback: () => void) {
    this.eventEmitter.on(ON_REQUEST_DIALOG_OPEN, callback);
  }

  public static offStatusDialogRequestOpen(callback: () => void) {
    this.eventEmitter.off(ON_REQUEST_DIALOG_OPEN, callback);
  }

  public static onScanningStateUpdate(callback: () => void) {
    this.eventEmitter.on(ON_SCANNING_STATE_UPDATE, callback);
  }

  public static offScanningStateUpdate(callback: () => void) {
    this.eventEmitter.off(ON_SCANNING_STATE_UPDATE, callback);
  }
}
