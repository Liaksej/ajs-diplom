import { checkAttack, checkPass } from "../utils"; // укажите правильный модуль

describe("checkPass function", () => {
  const boardSize = 8;

  test("Should return correct pass indices for swordsman (pass = 4) on second line from left wall", () => {
    const swordsmanPosition = 9;
    const expectedPassIndices = [
      0, 1, 2, 8, 9, 10, 11, 12, 13, 16, 17, 18, 25, 27, 33, 36, 41, 45,
    ]; // А тут укажите ожидаемые индексы.
    const passIndices = checkPass("swordsman", boardSize, swordsmanPosition);
    expect(passIndices.sort()).toEqual(expectedPassIndices.sort());
  });

  test("Should return correct pass indices for bowman (pass = 2) on second line from left wall", () => {
    const bowmanPosition = 56;
    const expectedPassIndices = [40, 42, 48, 49, 56, 57, 58];
    const passIndices = checkPass("bowman", boardSize, bowmanPosition);
    expect(passIndices.sort()).toEqual(expectedPassIndices.sort());
  });

  test("Should return correct pass indices for magician (pass = 1) on second line from left wall", () => {
    const magicianPosition = 17;
    const expectedPassIndices = [8, 9, 10, 16, 17, 18, 24, 25, 26];
    const passIndices = checkPass("magician", boardSize, magicianPosition);
    expect(passIndices.sort()).toEqual(expectedPassIndices.sort());
  });
});

describe("checkAttack function", () => {
  const boardSize = 8;

  test("Should return correct attack indices for daemon (attack = 4) on second line from right wall", () => {
    const daemonPosition = 6;
    const expectedAttackIndices = [
      2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 26, 27,
      28, 29, 30, 31, 34, 35, 36, 37, 38, 39,
    ];
    const attackIndices = checkAttack("daemon", boardSize, daemonPosition);
    expect(attackIndices.sort()).toEqual(expectedAttackIndices.sort());
  });

  test("Should return correct attack indices for vampire (attack = 2) on second line from right wall", () => {
    const vampirePosition = 31;
    const expectedAttackIndices = [
      13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47,
    ];
    const attackIndices = checkAttack("vampire", boardSize, vampirePosition);
    expect(attackIndices.sort()).toEqual(expectedAttackIndices.sort());
  });

  test("Should return correct attack indices for undead (attack = 1) on second line from right wall", () => {
    const undeadPosition = 63;
    const expectedAttackIndices = [54, 55, 62, 63];
    const attackIndices = checkAttack("undead", boardSize, undeadPosition);
    expect(attackIndices.sort()).toEqual(expectedAttackIndices.sort());
  });
});
