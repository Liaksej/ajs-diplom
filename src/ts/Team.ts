import Character, { CharacterType } from "./Character";
/**
 * Класс, представляющий персонажей команды
 * */

export default class Team {
  characters: Character[];
  constructor(characters: Character[]) {
    this.characters = characters;
  }

  static checkGamerCharacters(character: CharacterType) {
    return ["swordsman", "bowman", "magician"].includes(character);
  }

  static checkComputerCharacters(character: CharacterType) {
    return ["undead", "vampire", "daemon"].includes(character);
  }
}
