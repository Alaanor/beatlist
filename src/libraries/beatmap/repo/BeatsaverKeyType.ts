export enum BeatsaverKeyType {
  Hash = "hash",
  Key = "key",
}

export interface BeatsaverKey {
  type: BeatsaverKeyType;
  value: string;
}

export function toStrKey(key: BeatsaverKey) {
  return `${key.type.toUpperCase()}@${key.value.toUpperCase()}`;
}

export default {};
