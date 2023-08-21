import Character from "../Character";
import { LevelType } from "../Character";

export class Swordsman extends Character<"swordsman", LevelType> {
  constructor(level: LevelType) {
    super(level, "swordsman");
    this.attack = 40;
    this.defence = 10;
  }
}
