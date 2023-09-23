import Character from "./Character";
/**
 * Класс, представляющий персонажей команды
 * */

export default class Team {
  characters: Character[];
  constructor(characters: Character[]) {
    this.characters = characters;
  }
}
