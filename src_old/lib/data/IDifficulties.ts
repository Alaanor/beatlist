export default interface IDifficulties {
  easy: boolean;
  normal: boolean;
  hard: boolean;
  expert: boolean;
  expertPlus: boolean;

  [difficulty: string]: boolean;
}
