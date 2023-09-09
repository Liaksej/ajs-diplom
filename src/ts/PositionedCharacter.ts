import Character from "./Character";
import { checkPass, checkAttack } from "./utils";
import { gamePlay } from "./app";

export default class PositionedCharacter {
  character: Character;
  position: number;
  attackField: number[];
  moveField: number[];
  constructor(character: Character, position: number) {
    this.character = character;
    this.position = position;
    this.attackField = checkAttack(
      this.character.type,
      gamePlay.boardSize,
      this.position,
    );
    this.moveField = checkPass(
      this.character.type,
      gamePlay.boardSize,
      this.position,
    );
  }

  changePosition(index: number) {
    if (index !== this.position) {
      this.position = index;
      this.attackField = checkAttack(
        this.character.type,
        gamePlay.boardSize,
        this.position,
      );
      this.moveField = checkPass(
        this.character.type,
        gamePlay.boardSize,
        this.position,
      );
    }
  }
}
