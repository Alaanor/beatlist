export interface DownloadOperation {
  Start(): Promise<void>;
  OnCompleted(callback: (result: any) => void): void;
  isCompleted: boolean;
}
