export function getColorFor(name: string) {
  switch (name) {
    case "easy":
      return "green";
    case "normal":
      return "blue";
    case "hard":
      return "orange";
    case "expert":
      return "red";
    case "expertPlus":
      return "purple";
    default:
      return undefined;
  }
}

export function getWeightFor(name: string) {
  switch (name) {
    case "easy":
      return 1;
    case "normal":
      return 2;
    case "hard":
      return 3;
    case "expert":
      return 4;
    case "expertPlus":
      return 5;
    default:
      return undefined;
  }
}

export function getNameFor(name: string) {
  switch (name) {
    case "easy":
      return "Easy";
    case "normal":
      return "Normal";
    case "hard":
      return "Hard";
    case "expert":
      return "Expert";
    case "expertPlus":
      return "Expert+";
    default:
      return undefined;
  }
}

export function getShortNameFor(name: string) {
  switch (name) {
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

export const listOfDifficulties = [
  "easy",
  "normal",
  "hard",
  "expert",
  "expertPlus",
];
