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

  public static NotifyRateLimit(reset: Date) {
    store.commit("appState/SET_BEATSAVER_RATE_LIMIT", reset);
  }
}
