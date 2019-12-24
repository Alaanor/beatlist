export enum ProgressStatus {
  NotStarted = 0,
  Running = 1,
  Completed = 2,
}

export default class Progress {
  public status = ProgressStatus.NotStarted;

  public done: number = 0;

  public total: number = 0;

  public getRatio(): number {
    if (this.total === 0) {
      return 0;
    }

    return this.done / this.total;
  }
}
