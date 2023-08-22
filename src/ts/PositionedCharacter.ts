import Character, { CharacterType, LevelType } from "./Character";

export default class PositionedCharacter {
  character: Character<CharacterType, LevelType>;
  position: number;
  constructor(
    character: Character<CharacterType, LevelType>,
    position: number,
  ) {
    this.character = character;
    this.position = position;
  }
}
