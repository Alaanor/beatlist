import { ProgressInterface } from '@/libraries/common/Progress';

export interface ScannerInterface<T> {
  scanAll(progress?: ProgressInterface): void;
  scanOne(path: string): Promise<T>;
  result: ScannerResultInterface;
}

export interface ScannerResultInterface {
  toString(): string;
}

export default class ScannerService {

}
