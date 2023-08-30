import { generateTeam } from "../generators";
import { Bowman } from "../characters/Bowman";
import { Swordsman } from "../characters/Swordsman";
import { Magician } from "../characters/Magician";

const playerTypes = [Bowman, Swordsman, Magician];

describe("testing CharacterGenerator function", () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const characterCount = 80;

  const team = generateTeam(playerTypes, 3, characterCount);

  for (const teamMember of team.characters) {
    test("Level values below maxLevel 4 for every team member", () => {
      expect(teamMember.level <= 3).toBeTruthy();
    });
  }

  test("Number of characters in the team is equal to 80", () => {
    expect(team.characters.length).toEqual(80);
  });
});
