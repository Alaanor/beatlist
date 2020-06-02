export enum ColorblindMode {
  None = "None",
  GreyScale = "Grey scale",
}

function getShortNameFor(difficultyName: string) {
  switch (difficultyName) {
    case "easy":
      return "E";
    case "normal":
      return "N";
    case "hard":
      return "H";
    case "expert":
      return "X";
    case "expertPlus":
      return "+";
    default:
      return undefined;
  }
}

function getColorGreyScaled(difficultyName: string) {
  switch (difficultyName) {
    case "easy":
      return "grey lighten-1";
    case "normal":
      return "grey";
    case "hard":
      return "grey darken-1";
    case "expert":
      return "grey darken-2";
    case "expertPlus":
      return "grey darken-3";
    default:
      return undefined;
  }
}

export default {
  getShortNameFor,
  getColorGreyScaled,
};
