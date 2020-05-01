export interface BeatsaverBeatmap {
  metadata: Metadata;
  stats: Stats;
  description: string;
  key: string;
  name: string;
  uploaded: Date;
  hash: string;
  directDownload: string;
  downloadURL: string;
  coverURL: string;
}

export interface Metadata {
  difficulties: DifficultiesSimple;
  characteristics: Characteristic[];
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
  bpm: number;
}

export interface Characteristic {
  name: string;
  difficulties: DifficultiesDetailed;
}

export interface DifficultiesDetailed {
  easy: Difficulty;
  normal: Difficulty;
  hard: Difficulty;
  expert: Difficulty;
  expertPlus: Difficulty;
}

export interface Difficulty {
  duration: number;
  length: number;
  bombs: number;
  notes: number;
  obstacles: number;
  njs: number;
  njsOffset: number;
}

export interface DifficultiesSimple {
  easy: boolean;
  normal: boolean;
  hard: boolean;
  expert: boolean;
  expertPlus: boolean;

  [difficulty: string]: boolean;
}

export interface Stats {
  downloads: number;
  plays: number;
  downVotes: number;
  upVotes: number;
  heat: number;
  rating: number;

  [stat: string]: number;
}

export interface BeatsaverPage {
  docs: BeatsaverBeatmap[];
  totalDocs: number;
  lastPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

// Dumb and quick check if the object is kinda what we expect, doesn't fully validate it
export function isBeatsaverBeatmap(beatmap: any): beatmap is BeatsaverBeatmap {
  return (
    "metadata" in beatmap &&
    "stats" in beatmap &&
    "key" in beatmap &&
    "hash" in beatmap &&
    "name" in beatmap
  );
}
