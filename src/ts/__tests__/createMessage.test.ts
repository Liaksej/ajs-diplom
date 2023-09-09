import GameController from "../GameController";
import GamePlay from "../GamePlay";
import GameStateService from "../GameStateService";
import { Bowman } from "../characters/Bowman";

let gameCtrl: GameController;
let gamePlay: GamePlay;
let stateService: GameStateService;

beforeAll(() => {
  gameCtrl = new GameController(gamePlay, stateService);
});

test("Method createMessage should create a correct message for character at given position", () => {
  gameCtrl["positions"] = [
    {
      character: new Bowman(1),
      position: 5,
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

test("Method createMessage should create a correct message for character at given position", () => {
  gameCtrl["positions"] = [
    {
      character: new Bowman(1),
      position: 5,
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
