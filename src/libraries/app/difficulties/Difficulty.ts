import Easy from "./Easy";
import Normal from "./Normal";
import Hard from "./Hard";
import Expert from "./Expert";
import ExpertPlus from "./ExpertPlus";
import DifficultyInformation from "./DifficultyInformation";
import { ColorMode } from "../ColorMode";

export const EASY = new Easy();
export const NORMAL = new Normal();
export const HARD = new Hard();
export const EXPERT = new Expert();
export const EXPERTPLUS = new ExpertPlus();

export function getDifficulty(
  difficulty: string
): DifficultyInformation | undefined {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "e":
      return EASY;
    case "normal":
    case "n":
      return NORMAL;
    case "hard":
    case "h":
      return HARD;
    case "expert":
    case "x":
      return EXPERT;
    case "expertplus":
    case "+":
      return EXPERTPLUS;
    default:
      return undefined;
  }
}

export function getColor(
  difficulty: DifficultyInformation,
  colorMode: ColorMode
): string {
  switch (colorMode) {
    case ColorMode.Greyscale:
      return difficulty.colorGrayscaled;
    case ColorMode.None:
    default:
      return difficulty.color;
  }
}

export default {
  getDifficulty,
  getColor,
};
