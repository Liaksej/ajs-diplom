import Character, { LevelType } from "../Character";

export class Magician extends Character {
  constructor(level: LevelType) {
    super(level, "magician");
    this.attack = 10;
    this.defence = 40;
    this.levelUp(level);
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
