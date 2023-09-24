jest.mock("../app", () => {
  return {};
});
import GamePlay from "../GamePlay";
import GameStateService from "../GameStateService";
import GameController from "../GameController";
import GameState from "../GameState";

import { Bowman } from "../characters/Bowman";

jest.mock("../GameState", () => {
  return jest.fn().mockImplementation(() => {
    return { calculateOverallScore: () => Promise.resolve(100) };
  });
});

test("1 Method createMessage should create a correct message for character at given position", () => {
  const gameCtrl = new GameController(
    new GamePlay(),
    new GameStateService({} as Storage),
  );
  gameCtrl["gameState"].positions = [
    {
      character: new Bowman(1),
      position: 5,
      boardSize: 8,
      moveField: [1, 2, 3, 4, 5],
      attackField: [1, 2, 3, 4, 5],
      changePosition() {
        return;
      },
    },
  ];
  expect(gameCtrl["createTooltipMessage"](5)).toBe(
    "\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50",
  );
});

test("2 Method createMessage should create a correct message for character at given position", () => {
  const gameCtrl = new GameController(
    new GamePlay(),
    new GameStateService({} as Storage),
  );
  gameCtrl["gameState"].positions = [
    {
      character: new Bowman(1),
      position: 5,
      boardSize: 8,
      moveField: [1, 2, 3, 4, 5],
      attackField: [1, 2, 3, 4, 5],
      changePosition() {
        return;
      },
    },
  ];
  expect(gameCtrl["createTooltipMessage"](6)).toBe(
    "\u{1F396} undefined \u{2694} undefined \u{1F6E1} undefined \u{2764} undefined",
  );
});
