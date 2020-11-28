import Easy from "./Easy";
import Expert from "./Expert";
import ExpertPlus from "./ExpertPlus";
import Hard from "./Hard";
import Normal from "./Normal";
import DifficultyData from "./DifficultyData";
import { ColorblindMode } from "../DifficultyLabels";

export function getDifficulty(difficulty: string): DifficultyData | undefined {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "e":
      return new Easy();
    case "normal":
    case "n":
      return new Normal();
    case "hard":
    case "h":
      return new Hard();
    case "expert":
    case "x":
      return new Expert();
    case "expertplus":
    case "+":
      return new ExpertPlus();
    default:
      return undefined;
  }
}

export function getColor(
  difficulty: DifficultyData,
  colorMode: ColorblindMode
): string {
  switch (colorMode) {
    case ColorblindMode.Greyscale:
      return difficulty.colorGrayscaled;
    case ColorblindMode.None:
    default:
      return difficulty.color;
  }
}
