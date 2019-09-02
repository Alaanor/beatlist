import {ipcMain, app, BrowserWindow, DownloadItem} from 'electron';
import DownloadBeatMapItem from '../DownloadBeatMapItem';
import BeatSaverAPI from '../BeatSaverAPI';
import DownloadState from './DownloadState';
import ISongOnline from '../data/ISongOnline';
import path from 'path';

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
    this.RegisterDownloadListener();
  }

  private static readonly ongoingDl = new Map<ISongOnline, DownloadItem>();
  private static readonly readyToStartDl = new Map<string, ISongOnline>();

  private static async DlNewBeatMap(dlItem: DownloadBeatMapItem): Promise<DownloadItem | undefined> {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return undefined;
    }

    const url = BeatSaverAPI.getDownloadUrlFor(dlItem.beatmap);
    win.webContents.downloadURL(url);
    this.readyToStartDl.set(url, dlItem.beatmap);
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

  private static RegisterDownloadListener() {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return;
    }

    win.webContents.session.on('will-download', (event, item: DownloadItem, webContents) => {
      const beatmap = this.readyToStartDl.get(item.getURLChain()[0]);

      if (!beatmap) {
        return;
      }

      this.readyToStartDl.delete(item.getURL());
      this.ongoingDl.set(beatmap, item);

      const savePath = path.join(app.getPath('temp'), `${beatmap.key}.zip`);
      item.setSavePath(savePath);

      item.on('updated', (ev, state: string) => {
        if (state === 'progressing') {
          this.SendDownloadState(UPDATE_DOWNLOAD_STATE_ + beatmap.key, item);
        }
      });

      item.once('done', (ev, state: string) => {
        if (state === 'completed') {
          this.SendDownloadState(DOWNLOAD_END_FOR_ + beatmap.key, item);
          this.ongoingDl.delete(beatmap);
        }
      });
    });
  }
}
