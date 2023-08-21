/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */

type CharacterType =
  | "generic"
  | "swordsman"
  | "bowman"
  | "magician"
  | "daemon"
  | "undead"
  | "vampire";

export type LevelType = 1 | 2 | 3 | 4;

interface CharacterInterface<T extends CharacterType, L extends LevelType> {
  level: L;
  attack: number;
  defence: number;
  health: number;
  type: T;
}
export default class Character<T extends CharacterType, L extends LevelType>
  implements CharacterInterface<T, L>
{
  public level: L;
  public attack: number;
  public defence: number;
  public health: number;
  public type: T;

  constructor(level: L, type: T) {
    if (type === "generic") {
      throw Error("Cannot create a generic type character");
    }

    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }
}
