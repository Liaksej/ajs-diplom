import Character from "../Character";
import { LevelType } from "../Character";

export class Undead extends Character<"undead", LevelType> {
  constructor(level: LevelType) {
    super(level, "undead");
    this.attack = 40;
    this.defence = 10;
  }
}
