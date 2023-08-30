import Character from "../Character";
import { LevelType } from "../Character";

export class Bowman extends Character {
  constructor(level: LevelType) {
    super(level, "bowman");
    this.attack = 25;
    this.defence = 25;
  }
}
