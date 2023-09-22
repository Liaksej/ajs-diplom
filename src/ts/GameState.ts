import { LevelType } from "./Character";
import PositionedCharacter from "./PositionedCharacter";

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
}
