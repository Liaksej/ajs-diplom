import { LevelType } from "./Character";
import PositionedCharacter from "./PositionedCharacter";
import { Swordsman } from "./characters/Swordsman";
import { Bowman } from "./characters/Bowman";
import { Magician } from "./characters/Magician";
import { Undead } from "./characters/Undead";
import { Vampire } from "./characters/Vampire";
import { Daemon } from "./characters/Daemon";
import { ObjectForStore } from "./GameStateService";

export default class GameState {
  private _turn: "gamer" | "computer";
  private _level: LevelType;
  private _positions: PositionedCharacter[];
  private _isGameEnd: boolean;

  constructor() {
    this._turn = "gamer";
    this._level = 1;
    this._positions = [];
    this._isGameEnd = false;
  }

  get positions(): PositionedCharacter[] {
    return this._positions;
  }

  set positions(value: PositionedCharacter[]) {
    this._positions = value;
  }

  get level(): LevelType {
    return this._level;
  }

  set level(value: LevelType) {
    this._level = value;
  }

  get isGameEnd(): boolean {
    return this._isGameEnd;
  }

  set isGameEnd(value: boolean) {
    this._isGameEnd = value;
  }

  get turn(): "gamer" | "computer" {
    return this._turn;
  }

  set turn(value: "gamer" | "computer") {
    this._turn = value;
  }

  from(object: GameState) {
    this.turn = object._turn === "gamer" ? "computer" : "gamer";
  }

  loadData(objectForLoad: ObjectForStore) {
    this.turn = objectForLoad.turn;
    this.level = objectForLoad.level;
    this.isGameEnd = objectForLoad.isGameEnd;

    const characterClasses = {
      swordsman: Swordsman,
      bowman: Bowman,
      magician: Magician,
      undead: Undead,
      vampire: Vampire,
      daemon: Daemon,
    };
    this.positions = objectForLoad.positions.map((pos: PositionedCharacter) => {
      const CharacterClass = characterClasses[pos.character.type];
      if (!CharacterClass) {
        throw new Error(`Unknown character type: ${pos.character.type}`);
      }

      const character = new CharacterClass(pos.character.level);
      character.health = pos.character.health;
      character.attack = pos.character.attack;
      character.defence = pos.character.defence;
      return new PositionedCharacter(character, pos.position);
    });
  }
}
