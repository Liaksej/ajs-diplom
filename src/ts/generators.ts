import Character, { CharacterType, LevelType } from "./Character";
import Team from "./Team";

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

type AllowedTypes = Character<CharacterType, LevelType>[];

export function* characterGenerator(
  allowedTypes: AllowedTypes,
  maxLevel: LevelType,
) {
  while (true) {
    const randomNumber = Math.floor(Math.random() * allowedTypes.length);
    if (allowedTypes[randomNumber].level <= maxLevel) {
      yield allowedTypes[randomNumber];
    }
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
  const team: AllowedTypes = [];
  for (let i = 0; i < characterCount; i++) {
    characterGenerator(allowedTypes, maxLevel);
  }
  return new Team(team);
}
