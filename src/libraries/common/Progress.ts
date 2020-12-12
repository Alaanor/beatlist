import events from "events";

export const ON_PLUS_ONE: string = "plusOne";
export const ON_TOTAL_CHANGE: string = "totalChange";

export interface ProgressInterface {
  get(): { done: number; total: number };
  getRatio(): number;
}

export default class Progress implements ProgressInterface {
  private _done: number = 0;

  private _total: number = 0;

  private _eventEmitter: events.EventEmitter = new events.EventEmitter();

  public plusOne() {
    this._done += 1;
    this._eventEmitter.emit(ON_PLUS_ONE, this._done);
  }

  public setTotal(total: number) {
    if (total >= 0) {
      this._total = total;
      this._eventEmitter.emit(ON_TOTAL_CHANGE, this._total);
    }
  }

  public get(): { done: number; total: number } {
    return {
      done: this._done,
      total: this._total,
    };
  }

  public getRatio(): number {
    if (this._total === 0) {
      return 0;
    }

    return this._done / this._total;
  }

  public on(event: string | symbol, listener: (...args: any[]) => void) {
    this._eventEmitter.on(event, listener);
  }

  public onPlusOne(callback: () => void) {
    this._eventEmitter.on(ON_PLUS_ONE, callback);
  }

  public offPlusOne(callback: () => void) {
    this._eventEmitter.off(ON_PLUS_ONE, callback);
  }
}
