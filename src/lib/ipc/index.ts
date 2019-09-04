import PathResolver from './PathResolver';
import DownloadManager from './DownloadManager';
import AutoScanSong from './AutoScanSong';

export default function registerIpc() {
  PathResolver.register();
  DownloadManager.register();
  AutoScanSong.register();
}
