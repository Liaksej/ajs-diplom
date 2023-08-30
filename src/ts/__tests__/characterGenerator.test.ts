import { characterGenerator } from "../generators";
import { Bowman } from "../characters/Bowman";
import { Swordsman } from "../characters/Swordsman";
import { Magician } from "../characters/Magician";

describe("testing CharacterGenerator function", () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const iteration = Math.floor(Math.random() * 100);

  const character = characterGenerator(playerTypes, 2);

  for (let i = 0; i < iteration; i++) {
    test("Return instance of the classes Bowman Swordsman, Magician", () => {
      const result = character.next().value;
      expect(
        result.type === "bowman" ||
          result.type === "swordsman" ||
          result.type === "magician",
      ).toBeTruthy();
    });
  }
});
