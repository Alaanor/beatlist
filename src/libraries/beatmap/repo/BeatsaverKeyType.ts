export enum BeatsaverKeyType {
  Hash = 0,
  Key = 1,
}

export interface BeatsaverKey {
  type: BeatsaverKeyType,
  value: string,
}

export default {};
