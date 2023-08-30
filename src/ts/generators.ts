import Character, {
  CharacterInterface,
  CharacterType,
  LevelType,
} from "./Character";
import Team from "./Team";
import { Bowman } from "./characters/Bowman";
import { Swordsman } from "./characters/Swordsman";
import { Magician } from "./characters/Magician";
import { Undead } from "./characters/Undead";
import { Daemon } from "./characters/Daemon";
import { Vampire } from "./characters/Vampire";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */

type AllowedTypes = Array<
  | typeof Bowman
  | typeof Swordsman
  | typeof Magician
  | typeof Undead
  | typeof Daemon
  | typeof Vampire
>;

export function* characterGenerator(
  allowedTypes: AllowedTypes,
  maxLevel: LevelType,
): Generator {
  while (true) {
    const randomNumber = Math.floor(Math.random() * allowedTypes.length);
    const randomLevel = (Math.floor(Math.random() * maxLevel) + 1) as LevelType;
    const character: CharacterInterface = new allowedTypes[randomNumber](
      randomLevel,
    );
    yield character;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(
  allowedTypes: AllowedTypes,
  maxLevel: LevelType,
  characterCount: number,
) {
  const team: CharacterInterface<CharacterType, LevelType>[] = [];
  for (let i = 0; i < characterCount; i++) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    team.push(character!);
  }
  return new Team(team);
}
