import Character from "./Character";
import { checkPass, checkAttack } from "./utils";
import { BOARD_SIZE } from "./app";

export default class PositionedCharacter {
  character: Character;
  position: number;
  attackField: number[];
  moveField: number[];
  boardSize: number;
  constructor(character: Character, position: number) {
    this.character = character;
    this.position = position;
    this.boardSize = BOARD_SIZE;
    this.attackField = checkAttack(
      this.character.type,
      this.boardSize,
      this.position,
    );
    this.moveField = checkPass(
      this.character.type,
      this.boardSize,
      this.position,
    );
  }

  changePosition(index: number) {
    if (index !== this.position) {
      this.position = index;
      this.attackField = checkAttack(
        this.character.type,
        this.boardSize,
        this.position,
      );
      this.moveField = checkPass(
        this.character.type,
        this.boardSize,
        this.position,
      );
    }
  }
}
