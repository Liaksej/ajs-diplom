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

  levelUp(): void;

  healthUp(): void;
}

export default class Character implements CharacterInterface {
  level: LevelType;
  attack: number;
  defence: number;
  health: number;
  type: CharacterType;

  constructor(level: LevelType, type: CharacterType) {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.levelUp = this.levelUp.bind(this);
    if (this.level > 1) this.levelUp();

    if (new.target === Character) {
      throw new TypeError("Cannot construct Character instances directly");
    }
  }

  levelUp(level?: LevelType) {
    for (let i = 1; i < (level || this.level + 1); i++) {
      this.attack = Math.max(
        this.attack,
        (this.attack * (80 + this.health)) / 100,
      );
    }
  }

  healthUp() {
    const upHeal = this.health + 80;
    this.health = upHeal > 100 ? 100 : upHeal;
    if (this.level < 4) {
      this.level = (this.level + 1) as LevelType;
    }
  }
}
