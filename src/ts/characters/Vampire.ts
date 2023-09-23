import Character, { LevelType } from "../Character";

export class Vampire extends Character {
  constructor(level: LevelType) {
    super(level, "vampire");
    this.attack = 25;
    this.defence = 25;
    this.levelUp(level);
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
