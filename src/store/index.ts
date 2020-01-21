import settings, { SettingsStoreState } from './settings';
import beatmap, { BeatmapStoreState } from './beatmap';
import playlist, { PlaylistStoreState } from './playlist';
import notification, { NotificationStoreState } from './notification';
import appState, { AppStateStoreState } from './appState';
import download, { DownloadStoreState } from '@/store/download';

export interface StoreState {
  settings: SettingsStoreState,
  beatmap: BeatmapStoreState,
  playlist: PlaylistStoreState,
  notification: NotificationStoreState,
  appState: AppStateStoreState,
  download: DownloadStoreState,
}

export default {
  settings,
  beatmap,
  playlist,
  notification,
  appState,
  download,
};
