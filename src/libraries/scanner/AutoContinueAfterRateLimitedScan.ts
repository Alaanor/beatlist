import ScannerService from "@/libraries/scanner/ScannerService";
import BeatsaverRateLimitManager from "@/libraries/net/beatsaver/BeatsaverRateLimitManager";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";
import { BeatsaverItemLoadError } from "@/libraries/beatmap/repo/BeatsaverItem";

export default class AutoContinueAfterRateLimitedScan {
  public static register(): void {
    ScannerService.onScanCompleted(this.onScanCompleted);
  }

  private static onScanCompleted(): void {
    if (BeatsaverRateLimitManager.HasHitRateLimit()) {
      // We requested a scan and the scan hit a rate limit.
      // There's prolly entry that got rate-limited in the cache
      const hasRateLimitEntryCached = Array.from(
        BeatsaverCachedLibrary.GetAllInvalid().values()
      ).find((entry) => {
        return (
          entry.loadState.errorType ===
          BeatsaverItemLoadError.BeatsaverRateLimited
        );
      });

      if (hasRateLimitEntryCached) {
        // Ok so we got a rate limit entry after a scan, let's start
        // another scan automatically after the reset
        const remainingSeconds = BeatsaverRateLimitManager.GetRemainingSeconds();
        setTimeout(() => {
          ScannerService.ScanAll().then();
        }, 1000 * remainingSeconds);
      }
    }
  }
}
