import Character, { LevelType } from "../Character";

export class Magician extends Character {
  passArea;
  attackArea;

  constructor(level: LevelType) {
    super(level, "magician");
    this.attack = 10;
    this.defence = 40;
    this.levelUp(level);
    this.passArea = 1;
    this.attackArea = 4;
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
