import DifficultyInformation from "./DifficultyInformation";

export default class Hard implements DifficultyInformation {
  char = "H";

  string = "Hard";

  order = 3;

  color = "orange";

  colorGrayscaled = "grey darken-1";
}
