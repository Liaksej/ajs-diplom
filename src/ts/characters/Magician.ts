import Character from "../Character";
import { LevelType } from "../Character";

export class Magician extends Character {
  constructor(level: LevelType) {
    super(level, "magician");
    this.attack = 10;
    this.defence = 40;
  }
}
