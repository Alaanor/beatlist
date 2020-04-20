import { ProgressInterface } from '@/libraries/common/Progress';

export interface ScannerInterface<T> {
  scanAll(progress?: ProgressInterface): Promise<ScannerResultInterface>;

  scanOne(path: string): Promise<T>;

  result: ScannerResultInterface;
}

export interface ScannerResultInterface {
  anyChange(): boolean;

  toString(): string;
}
