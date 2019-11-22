import PathResolver from './PathResolver';
import DownloadManager from './DownloadManager';
import AutoScanSong from './AutoScanSong';
import BeatsaverLinkOpener from './BeatsaverLinkOpener';

export default function registerIpc() {
  PathResolver.register();
  DownloadManager.register();
  AutoScanSong.register();
  BeatsaverLinkOpener.register();
}
