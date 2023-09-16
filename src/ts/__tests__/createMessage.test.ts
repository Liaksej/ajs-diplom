jest.mock("../app", () => {
  return {};
});
import GamePlay from "../GamePlay";
import GameStateService from "../GameStateService";
import GameController from "../GameController";

import { Bowman } from "../characters/Bowman";

test("1 Method createMessage should create a correct message for character at given position", () => {
  const gameCtrl = new GameController(new GamePlay(), new GameStateService({}));
  gameCtrl["positions"] = [
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
  expect(gameCtrl["createToolpitMessage"](5)).toBe(
    "\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50",
  );
});

test("2 Method createMessage should create a correct message for character at given position", () => {
  const gameCtrl = new GameController(new GamePlay(), new GameStateService({}));
  gameCtrl["positions"] = [
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
  expect(gameCtrl["createToolpitMessage"](6)).toBe(
    "\u{1F396} undefined \u{2694} undefined \u{1F6E1} undefined \u{2764} undefined",
  );
});
