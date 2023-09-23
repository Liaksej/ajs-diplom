import Character, { LevelType } from "../Character";

export class Undead extends Character {
  constructor(level: LevelType) {
    super(level, "undead");
    this.attack = 40;
    this.defence = 10;
    this.levelUp(level);
  }

  levelUp(level: LevelType) {
    super.levelUp(level);
  }
}
