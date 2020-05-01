import {
  BeatSaverAPIResponse,
  BeatSaverAPIResponseStatus,
} from "@/libraries/net/beatsaver/BeatsaverAPI";

export default function mockResponseSuccess<T>(
  obj: T
): BeatSaverAPIResponse<T> {
  return {
    data: obj,
    status: BeatSaverAPIResponseStatus.ResourceFound,
  } as BeatSaverAPIResponse<T>;
}
