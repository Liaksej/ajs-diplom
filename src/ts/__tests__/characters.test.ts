import { Bowman } from "../characters/Bowman";
import { Daemon } from "../characters/Daemon";
import { Magician } from "../characters/Magician";
import { Swordsman } from "../characters/Swordsman";
import { Undead } from "../characters/Undead";
import { Vampire } from "../characters/Vampire";
import { LevelType } from "../Character";

describe("Bowman class", () => {
  it("should have correct initial properties for level 1", () => {
    const bowman = new Bowman(1);
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);
    expect(bowman.level).toBe(1);
    expect(bowman.type).toBe("bowman");
    // другие свойства...
  });
});

test.each([
  ["Bowman class", Bowman, 25, 25, 1, "bowman"],
  ["Swordsman class", Swordsman, 40, 10, 1, "swordsman"],
  ["Magician class", Magician, 10, 40, 1, "magician"],
  ["Daemon class", Daemon, 10, 10, 1, "daemon"],
  ["Vampire class", Vampire, 25, 25, 1, "vampire"],
  ["Undead class", Undead, 40, 10, 1, "undead"],
])(
  "%s should have correct initial properties for level 1",
  (_: string, character, at: number, def: number, lev: number, ty: string) => {
    const testedClass = new character(lev as LevelType);
    expect([
      testedClass.attack,
      testedClass.defence,
      testedClass.level,
      testedClass.type,
    ]).toEqual([at, def, lev, ty]);
  },
);
