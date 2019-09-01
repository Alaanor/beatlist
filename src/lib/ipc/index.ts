import PathResolver from './PathResolver';
import DownloadManager from './DownloadManager';

export default function registerIpc() {
  PathResolver.register();
  DownloadManager.register();
}
