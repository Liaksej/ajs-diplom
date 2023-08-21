import Character from "../Character";
import { LevelType } from "../Character";

export class Daemon extends Character<"daemon", LevelType> {
  constructor(level: LevelType) {
    super(level, "daemon");
    this.attack = 10;
    this.defence = 10;
  }
}
