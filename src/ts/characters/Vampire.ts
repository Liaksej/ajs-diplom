import Character, { LevelType } from "../Character";

export class Vampire extends Character {
  passArea;
  attackArea;
  constructor(level: LevelType) {
    super(level, "vampire");
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
