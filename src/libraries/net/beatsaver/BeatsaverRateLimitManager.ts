import store from "@/plugins/store";

export default class BeatsaverRateLimitManager {
  public static HasHitRateLimit(): boolean {
    const resetDate = this.GetResetDate();

    if (resetDate === undefined) {
      return false;
    }

    return resetDate > new Date();
  }

  public static GetResetDate(): Date | undefined {
    return store.getters["appState/beatsaverRateLimit"];
  }

  public static GetRemainingSeconds(): number {
    const reset = this.GetResetDate();
    if (reset === undefined) return 0;
    return Math.ceil((reset.getTime() - new Date().getTime()) / 1000);
  }

  public static NotifyRateLimit(reset: Date) {
    store.commit("appState/SET_BEATSAVER_RATE_LIMIT", reset);
  }
}
