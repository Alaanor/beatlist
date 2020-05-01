import { remote } from "electron";
import semver from "semver";
import localforage from "localforage";
import store from "@/plugins/store";

export default class UpgradeCheckerService {
  public static async Initialize() {
    // @ts-ignore
    await store.restored;

    const previousVersion = this.getRegisteredAppVersion();
    const currentVersion = this.getElectronAppVersion();

    const isNewUser = previousVersion === undefined;
    const isNewVersion =
      previousVersion && semver.gt(currentVersion, previousVersion);

    if (isNewUser) {
      store.commit("modal/SET_NEW_USER_MODAL", true);
      store.commit("settings/SET_APP_VERSION", currentVersion);

      UpgradeCheckerService.cleanOldVuexCacheIfExist().then(() => {});
    }

    if (isNewVersion) {
      store.commit("modal/SET_NEW_VERSION_MODAL", true);
      store.commit("settings/SET_APP_VERSION", currentVersion);
    }
  }

  private static getRegisteredAppVersion(): string | undefined {
    return store.getters["settings/appVersion"];
  }

  private static getElectronAppVersion(): string {
    return remote.app.getVersion();
  }

  private static async cleanOldVuexCacheIfExist() {
    const oldCache = localforage.createInstance({ name: "localforage" });
    await oldCache.removeItem("vuex");
  }
}
