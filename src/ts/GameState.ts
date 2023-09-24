import { LevelType } from "./Character";
import PositionedCharacter from "./PositionedCharacter";
import { Swordsman } from "./characters/Swordsman";
import { Bowman } from "./characters/Bowman";
import { Magician } from "./characters/Magician";
import { Undead } from "./characters/Undead";
import { Vampire } from "./characters/Vampire";
import { Daemon } from "./characters/Daemon";
import { ObjectForStore } from "./GameStateService";

type team = "gamer" | "computer";

export default class GameState {
  private _turn: "gamer" | "computer";
  private _level: LevelType;
  private _positions: PositionedCharacter[];
  private _isGameEnd: boolean;
  private previousScores: { gamer: number; computer: number };
  private _maxScore: { gamer: number; computer: number };

  constructor() {
    this._turn = "gamer";
    this._level = 1;
    this._positions = [];
    this._isGameEnd = false;
    this.previousScores = { gamer: 0, computer: 0 };
    this._maxScore = {
      gamer: 0,
      computer: 0,
    };
  }

  get maxScore(): { gamer: number; computer: number } {
    return this._maxScore;
  }

  set maxScore(value: { gamer: number; computer: number }) {
    this._maxScore = value;
  }

  async setPreviousScores() {
    this.previousScores = {
      gamer: await this.calculateOverallScore(this.positions, "gamer"),
      computer: await this.calculateOverallScore(this.positions, "computer"),
    };
  }

  async getMaxScore(): Promise<void> {
    const newScores = {
      gamer: await this.calculateOverallScore(this.positions, "gamer"),
      computer: await this.calculateOverallScore(this.positions, "computer"),
    };

    const maxScore = this.maxScore;
    let scoreGamer = maxScore.gamer;
    let scoreComputer = maxScore.computer;

    if (newScores.gamer < this.previousScores.gamer) {
      scoreComputer += this.previousScores.gamer - newScores.gamer;
    } else if (newScores.computer < this.previousScores.computer) {
      scoreGamer += this.previousScores.computer - newScores.computer;
    } else return;

    this.previousScores = newScores;

    this.maxScore = { gamer: scoreGamer, computer: scoreComputer };
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
    this.maxScore = objectForLoad.maxScore;

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
  private async calculateOverallScore(
    positionedCharacters: PositionedCharacter[],
    team: team,
    healthWeight = 0.1,
    attackWeight = 0.2,
    levelWeight = 0.7,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const worker: Worker = new Worker(
        new URL("./worker.ts", import.meta.url),
      );

      worker.postMessage({
        positionedCharacters,
        team,
        healthWeight,
        attackWeight,
        levelWeight,
      });

      worker.onmessage = (event: MessageEvent) => {
        resolve(event.data);
      };

      worker.onerror = (err: ErrorEvent) => {
        reject(err);
      };
    });
  }
}
