import Character, { CharacterType, LevelType } from "../Character";
import { Bowman } from "../characters/Bowman";
import { Daemon } from "../characters/Daemon";
import { Magician } from "../characters/Magician";
import { Swordsman } from "../characters/Swordsman";
import { Undead } from "../characters/Undead";
import { Vampire } from "../characters/Vampire";

describe("Class", () => {
  const levels: LevelType[] = [1, 2, 3, 4];
  const characterTypes: CharacterType[] = [
    "swordsman",
    "bowman",
    "magician",
    "daemon",
    "undead",
    "vampire",
  ];
  const characterClasses = [
    Bowman,
    Swordsman,
    Magician,
    Undead,
    Vampire,
    Daemon,
  ];

  characterTypes.forEach((type) => {
    levels.forEach((level) => {
      test(`Character should throw TypeError "Cannot construct Character instances directly"`, () => {
        expect(() => {
          new Character(level, type);
        }).toThrowError("Cannot construct Character instances directly");
      });
    });
  });

  characterClasses.forEach((character) => {
    levels.forEach((level) => {
      test(`${character.name} shouldn't throw TypeError "Cannot construct Character instances directly with level ${level}`, () => {
        expect(() => {
          new character(level);
        }).not.toThrowError();
      });
    });
  });
});
