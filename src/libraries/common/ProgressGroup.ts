import Progress, {
  ON_PLUS_ONE,
  ON_TOTAL_CHANGE,
  ProgressInterface,
} from "@/libraries/common/Progress";
import events from "events";

export default class ProgressGroup implements ProgressInterface {
  private _progresses: Progress[] = [];

  private _done: number = 0;

  private _total: number = 0;

  private _eventEmitter: events.EventEmitter = new events.EventEmitter();

  public AddProgresses(...progresses: Progress[]) {
    progresses.forEach((progress: Progress) => {
      this._progresses.push(progress);
      progress.on(ON_PLUS_ONE, () => this.plusOne());
      progress.on(ON_TOTAL_CHANGE, () => this.computeTotal());
    });

    this.computeTotal();
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

  private plusOne() {
    this._done += 1;
    this._eventEmitter.emit(ON_PLUS_ONE, this._done);
  }

  private computeTotal() {
    const sum = (previous: number, current: number) => previous + current;

    this._total = this._progresses
      .map((p: Progress) => p.get().total)
      .reduce(sum, 0);
  }

  public getNewOne(): Progress {
    const progress = new Progress();
    this.AddProgresses(progress);
    return progress;
  }

  public onPlusOne(callback: () => void) {
    this._eventEmitter.on(ON_PLUS_ONE, callback);
  }

  public offPlusOne(callback: () => void) {
    this._eventEmitter.off(ON_PLUS_ONE, callback);
  }
}
