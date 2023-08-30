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

export type CharacterType =
  | "swordsman"
  | "bowman"
  | "magician"
  | "daemon"
  | "undead"
  | "vampire";

export type LevelType = 1 | 2 | 3 | 4;

export interface CharacterInterface {
  level: LevelType;
  attack: number;
  defence: number;
  health: number;
  type: CharacterType;
}
export default class Character implements CharacterInterface {
  public level: LevelType;
  public attack: number;
  public defence: number;
  public health: number;
  public type: CharacterType;

  constructor(level: LevelType, type: CharacterType) {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;

    if (new.target === Character) {
      throw new TypeError("Cannot construct Character instances directly");
    }
  }
}
