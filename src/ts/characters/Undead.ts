import Character, { LevelType } from "../Character";

export class Undead extends Character {
  passArea = 4;
  attackArea = 1;

  constructor(level: LevelType) {
    super(level, "undead");
    this.attack = 40;
    this.defence = 10;
    this.levelUp(level);
    this.passArea = 4;
    this.attackArea = 1;
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
