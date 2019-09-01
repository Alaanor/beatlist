import {ipcMain, app, BrowserWindow} from 'electron';
import {download} from 'electron-dl';
import DownloadBeatMapItem from '../DownloadBeatMapItem';
import BeatSaverAPI from '../BeatSaverAPI';
import DownloadItem = Electron.DownloadItem;
import DownloadState from '@/lib/ipc/DownloadState';

const namespace = 'downloadManager_';
export const DL_NEW_BEATMAP = namespace + 'dl_new_beatmap';
export const GET_DOWNLOAD_STATE_ = 'get_download_state_';
export const UPDATE_DOWNLOAD_STATE_ = 'udpate_download_state_';
export const DOWNLOAD_END_FOR_ = 'download_end_for_';

export default class DownloadManager {

  public static register(): void {
    ipcMain.on(DL_NEW_BEATMAP, async (event: any, dlItem: DownloadBeatMapItem) => {
      await this.DlNewBeatMap(dlItem);
    });
  }

  private static async DlNewBeatMap(dlItem: DownloadBeatMapItem): Promise<DownloadItem | undefined> {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return undefined;
    }

    const url = BeatSaverAPI.getDownloadUrlFor(dlItem.beatmap);
    return await download(win, url, {
      directory: app.getPath('temp'),
      filename: `${dlItem.beatmap.key}.zip`,
      onStarted: DownloadManager.onDownloadStarted(dlItem.beatmap.key),
    });
  }

  private static onDownloadStarted(key: string) {
    return (item: DownloadItem) => {
      item.on('updated', (event, state) => {
        if (state === 'progressing') {
          this.SendDownloadState(UPDATE_DOWNLOAD_STATE_ + key, item);
        }
      });

      item.once('done', (ev: any, state: string) => {
        if (state === 'completed') {
          this.SendDownloadState(DOWNLOAD_END_FOR_ + key, item);
        }
      });
    };
  }

  private static SendDownloadState(channel: string, item: DownloadItem) {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return;
    }

    win.webContents.send(channel, this.GetDownloadState(item));
  }

  private static GetDownloadState(dl: DownloadItem) {
    return {
      path: dl.getSavePath(),
      state: dl.getState(),
      totalBytes: dl.getTotalBytes(),
      receivedBytes: dl.getReceivedBytes(),
    } as DownloadState;
  }
}
