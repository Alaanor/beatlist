import events from 'events';
import Progress from '@/libraries/common/Progress';
import ProgressGroup from '@/libraries/common/ProgressGroup';
import PlaylistScanner from '@/libraries/scanner/playlist/PlaylistScanner';
import BeatmapScanner from '@/libraries/scanner/beatmap/BeatmapScanner';
import BeatmapScannerResult from '@/libraries/scanner/beatmap/BeatmapScannerResult';
import PlaylistScannerResult from '@/libraries/scanner/playlist/PlaylistScannerResult';

const ON_SCAN_COMPLETED = 'on_scan_completed';
const ON_BEATMAP_SCAN_COMPLETED = 'on_beatmap_scan_completed';
const ON_PLAYLIST_SCAN_COMPLETED = 'on_playlist_scan_completed';
const ON_REQUEST_DIALOG_OPEN = 'on_request_dialog_open';
const ON_SCANNING_STATE_UPDATE = 'on_scanning_state_update';

export default class ScannerService {
  public static get isScanning(): boolean {
    return this.locked;
  }

  private static _scanning: { beatmap: boolean, playlist: boolean } = {
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

  private static operation: 'beatmap' | 'playlist' | 'all' | undefined = undefined;

  private static beatmapProgress?: Progress;

  private static playlistProgress?: ProgressGroup;

  private static beatmapProgressGetter?: () => Progress;

  private static playlistProgressGetter?: () => ProgressGroup;

  public static async ScanAll(): Promise<void> {
    if (this.locked) return undefined;
    this.operation = 'all';

    return this.ScanBeatmaps().then(() => this.ScanPlaylists());
  }

  public static async ScanBeatmaps(): Promise<void> {
    if (this.locked) return undefined;

    this.scanningBeatmap = true;
    this.locked = true;
    this.operation = this.operation ?? 'beatmap';

    if (this.beatmapProgressGetter) {
      this.beatmapProgress = this.beatmapProgressGetter();
    }

    return new BeatmapScanner().scanAll(this.beatmapProgress)
      .then((result: BeatmapScannerResult) => {
        this.locked = false;
        this.scanningBeatmap = false;
        this.eventEmitter.emit(ON_BEATMAP_SCAN_COMPLETED, result);
        this.checkForEndOperation('beatmap');
      });
  }

  public static async ScanPlaylists(): Promise<void> {
    if (this.locked) return undefined;
    this.operation = this.operation ?? 'playlist';

    this.scanningPlaylist = true;
    this.locked = true;

    if (this.playlistProgressGetter) {
      this.playlistProgress = this.playlistProgressGetter();
    }

    return new PlaylistScanner().scanAll(this.playlistProgress)
      .then((result: PlaylistScannerResult) => {
        this.locked = false;
        this.scanningPlaylist = false;
        this.eventEmitter.emit(ON_PLAYLIST_SCAN_COMPLETED, result);
        this.checkForEndOperation('playlist');
      });
  }

  private static checkForEndOperation(from: 'beatmap' | 'playlist') {
    switch (from) {
      case 'beatmap':
        if (this.operation === 'beatmap') {
          this.eventEmitter.emit(ON_SCAN_COMPLETED);
          this.operation = undefined;
        }
        break;

      case 'playlist':
        if (this.operation === 'playlist' || this.operation === 'all') {
          this.eventEmitter.emit(ON_SCAN_COMPLETED);
          this.operation = undefined;
        }
        break;

      default: break;
    }
  }

  public static OnBindBeatmapProgress(callback: () => Progress) {
    this.beatmapProgressGetter = callback;
  }

  public static OnBindPlaylistProgress(callback: () => ProgressGroup) {
    this.playlistProgressGetter = callback;
  }

  public static onBeatmapScanCompleted(callback: (result: BeatmapScannerResult) => void) {
    this.eventEmitter.on(ON_BEATMAP_SCAN_COMPLETED, callback);
  }

  public static onPlaylistScanCompleted(callback: (result: PlaylistScannerResult) => void) {
    this.eventEmitter.on(ON_PLAYLIST_SCAN_COMPLETED, callback);
  }

  public static onScanCompleted(callback: () => void) {
    this.eventEmitter.on(ON_SCAN_COMPLETED, callback);
  }

  public static onStatusDialogRequestOpen(callback: () => void) {
    this.eventEmitter.on(ON_REQUEST_DIALOG_OPEN, callback);
  }

  public static requestDialogToBeOpened() {
    this.eventEmitter.emit(ON_REQUEST_DIALOG_OPEN);
  }

  public static onScanningStateUpdate(callback: () => void) {
    this.eventEmitter.on(ON_SCANNING_STATE_UPDATE, callback);
  }
}
