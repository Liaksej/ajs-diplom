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
  public turn: "gamer" | "computer";
  public level: LevelType;
  public positions: PositionedCharacter[];
  public isGameEnd: boolean;
  private previousScores: { gamer: number; computer: number };
  public maxScore: { gamer: number; computer: number };

  constructor() {
    this.turn = "gamer";
    this.level = 1;
    this.positions = [];
    this.isGameEnd = false;
    this.previousScores = { gamer: 0, computer: 0 };
    this.maxScore = {
      gamer: 0,
      computer: 0,
    };
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

  from(object: GameState) {
    this.turn = object.turn === "gamer" ? "computer" : "gamer";
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
