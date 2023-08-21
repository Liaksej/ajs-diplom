import Character from "../Character";
import { LevelType } from "../Character";

export class Magican extends Character<"magician", LevelType> {
  constructor(level: LevelType) {
    super(level, "magician");
    this.attack = 10;
    this.defence = 40;
  }
}
