export interface DownloadUnitProgress {
  bytes: {
    total: number;
    received: number;
    percent: number; // 0 to 1
    speed: number; // bytes per ms
  },
  time: {
    startedAt: number;
    remaining: number; // in ms
  },
}

export function DownloadUnitProgressFactory(): DownloadUnitProgress {
  return {
    bytes: {
      total: 0,
      received: 0,
      percent: 0,
      speed: 0,
    },
    time: {
      startedAt: 0,
      remaining: 0,
    },
  } as DownloadUnitProgress;
}

function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}

export function FormatProgressSpeed(progress: DownloadUnitProgress): string {
  return `${formatBytes(progress.bytes.speed * 1000)}/s`;
}

export function FormatProgressReceived(progress: DownloadUnitProgress): string {
  return formatBytes(progress.bytes.received);
}

export function FormatProgressTotal(progress: DownloadUnitProgress): string {
  return formatBytes(progress.bytes.total);
}

export function FormatProgressState(progress: DownloadUnitProgress): string {
  const received = FormatProgressReceived(progress);
  const total = FormatProgressTotal(progress);

  return `${received} of ${total}`;
}

export function FormatProgressRemaining(progress: DownloadUnitProgress): string {
  const remaining = Math.ceil(progress.time.remaining / 1000);
  return `${remaining} second${remaining > 1 ? 's' : ''} remaining`;
}

export function FormatProgressAllInOne(progress: DownloadUnitProgress): string {
  return `${FormatProgressRemaining(progress)} - ${FormatProgressState(progress)}, ${FormatProgressSpeed(progress)}`;
}
