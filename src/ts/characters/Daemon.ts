import Character, { LevelType } from "../Character";

export class Daemon extends Character {
  constructor(level: LevelType) {
    super(level, "daemon");
    this.attack = 10;
    this.defence = 10;
    this.levelUp(level);
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
