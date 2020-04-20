export interface Differences<T> {
  removed: T[],
  added: T[],
  kept: T[],
}

export function computeDifference<T>(olds: T[], news: T[]) {
  const difference = {} as Differences<T>;

  difference.added = news.filter((fresh: T) => !olds
    .find((old: T) => old === fresh));

  difference.kept = news.filter((fresh: T) => olds
    .find((old: T) => old === fresh));

  difference.removed = olds.filter((old: T) => !news
    ?.find((fresh: T) => fresh === old));

  return difference;
}
