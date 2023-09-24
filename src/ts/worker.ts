import PositionedCharacter from "./PositionedCharacter";

self.onmessage = (event) => {
  const {
    positionedCharacters,
    team,
    healthWeight,
    attackWeight,
    levelWeight,
  } = event.data;

  let totalScore;
  if (team === "gamer") {
    totalScore = positionedCharacters
      .filter((positionedCharacter: PositionedCharacter) =>
        ["swordsman", "magician", "bowman"].includes(
          positionedCharacter.character.type,
        ),
      )
      .reduce((total: number, character: PositionedCharacter) => {
        total += healthWeight * character.character.health;
        total += total + attackWeight * character.character.attack;
        total += total + levelWeight * character.character.level;
        return total;
      }, 0);
  } else {
    totalScore = positionedCharacters
      .filter((positionedCharacter: PositionedCharacter) =>
        ["undead", "vampire", "daemon"].includes(
          positionedCharacter.character.type,
        ),
      )
      .reduce((total: number, character: PositionedCharacter) => {
        total += healthWeight * character.character.health;
        total += total + attackWeight * character.character.attack;
        total += total + levelWeight * character.character.level;
        return total;
      }, 0);
  }

  totalScore;

  self.postMessage(totalScore);
};
