import NotificationService from "@/libraries/notification/NotificationService";
import BeatmapScannerResult from "@/libraries/scanner/beatmap/BeatmapScannerResult";
import PlaylistScannerResult from "@/libraries/scanner/playlist/PlaylistScannerResult";
import ScannerService from "@/libraries/scanner/ScannerService";

export default class NotificationServiceScanner {
  private static latestResultBeatmap = undefined as
    | undefined
    | BeatmapScannerResult;

  private static latestResultPlaylist = undefined as
    | undefined
    | PlaylistScannerResult;

  private static notifyNextScan = false;

  public static Initialize() {
    ScannerService.onScanStart(this.onScanStart);
    ScannerService.onBeatmapScanCompleted(this.onBeatmapScanCompleted);
    ScannerService.onPlaylistScanCompleted(this.onPlaylistScanCompleted);
    ScannerService.onScanCompleted(this.onScanCompleted);
  }

  public static notifyOnNextScan() {
    NotificationServiceScanner.notifyNextScan = true;
  }

  private static onScanCompleted() {
    if (NotificationServiceScanner.notifyNextScan) {
      NotificationServiceScanner.notifyScanResult();
      NotificationServiceScanner.notifyNextScan = false;
    }
  }

  private static onScanStart() {
    NotificationServiceScanner.latestResultBeatmap = undefined;
    NotificationServiceScanner.latestResultPlaylist = undefined;
  }

  private static onBeatmapScanCompleted(result: BeatmapScannerResult): void {
    NotificationServiceScanner.latestResultBeatmap = result;
  }

  private static onPlaylistScanCompleted(result: PlaylistScannerResult): void {
    NotificationServiceScanner.latestResultPlaylist = result;
  }

  private static notifyScanResult() {
    const message = [];

    if (NotificationServiceScanner.latestResultBeatmap?.anyChange()) {
      message.push(NotificationServiceScanner.latestResultBeatmap.toString());
    }

    if (NotificationServiceScanner.latestResultPlaylist?.anyChange()) {
      message.push(NotificationServiceScanner.latestResultPlaylist.toString());
    }

    if (message.length > 0) {
      NotificationService.NotifyMessage(
        message.join(". "),
        "info",
        "find_in_page",
        10 * 1000
      );
    } else {
      NotificationService.NotifyMessage(
        "No change",
        "info",
        "find_in_page",
        2500
      );
    }
  }
}
