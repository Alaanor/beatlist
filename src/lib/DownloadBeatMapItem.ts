import ISongOnline from './data/ISongOnline';
import {DL_NEW_BEATMAP, DOWNLOAD_END_FOR_, UPDATE_DOWNLOAD_STATE_} from './ipc/DownloadManager';
import {ipcRenderer} from 'electron';
import DownloadState from './ipc/DownloadState';
import events from 'events';
import AdmZip from 'adm-zip';
import BeatSaber from './BeatSaber';
import store from '../store/store';

export default class DownloadBeatMapItem {

  public readonly beatmap: ISongOnline;

  private err: Error | undefined;
  private state: DownloadState;
  private completed: boolean = false;
  private eventEmitter = new events.EventEmitter();

  constructor(beatmap: ISongOnline) {
    this.beatmap = beatmap;
    this.err = undefined;
    this.state = {} as DownloadState;
  }

  public Install() {
    this.download();
    this.setListener();
    // this.updateState();
  }

  public on(event: string, listener: () => void) {
    this.eventEmitter.on(event, listener);
  }

  private download() {
    ipcRenderer.send(DL_NEW_BEATMAP, this);
  }

  private async handleExtract() {
    try {
      await this.extract();
      this.eventEmitter.emit('extracted')
    } catch (e) {
      this.err = e;
      console.log(e);
    }

    this.eventEmitter.emit('done');
  }

  private async extract() {
    const instPath = store.getters['settings/installationPath'];
    const inputPath = this.state.path;
    const outputPath = await new BeatSaber(instPath).CreateBeatMapFolder(this.beatmap);
    const zip = new AdmZip(inputPath);
    zip.extractAllTo(outputPath);
  }

  private setListener() {
    ipcRenderer.on(UPDATE_DOWNLOAD_STATE_ + this.beatmap.key, (event: any, state: DownloadState) => {
      this.state = state;
      this.eventEmitter.emit('update');
    });

    ipcRenderer.on(DOWNLOAD_END_FOR_ + this.beatmap.key, (event: any, state: DownloadState) => {
      ipcRenderer.removeAllListeners(UPDATE_DOWNLOAD_STATE_ + this.beatmap.key);
      ipcRenderer.removeAllListeners(DOWNLOAD_END_FOR_ + this.beatmap.key);
      this.eventEmitter.emit('downloaded');
      this.handleExtract();
    });
  }
}
