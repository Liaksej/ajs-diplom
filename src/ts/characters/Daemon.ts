import Character, { LevelType } from "../Character";

export class Daemon extends Character {
  passArea;
  attackArea;

  constructor(level: LevelType) {
    super(level, "daemon");
    this.attack = 10;
    this.defence = 10;
    this.levelUp(level);
    this.passArea = 1;
    this.attackArea = 4;
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
