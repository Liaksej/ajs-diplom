import Character from "../Character";
import { LevelType } from "../Character";

export class Vampire extends Character<"vampire", LevelType> {
  constructor(level: LevelType) {
    super(level, "vampire");
    this.attack = 25;
    this.defence = 25;
  }
}
