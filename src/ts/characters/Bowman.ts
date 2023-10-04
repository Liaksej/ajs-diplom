import Character, { LevelType } from "../Character";

export class Bowman extends Character {
  passArea;
  attackArea;

  constructor(level: LevelType) {
    super(level, "bowman");
    this.attack = 25;
    this.defence = 25;
    this.levelUp(level);
    this.passArea = 2;
    this.attackArea = 2;
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
