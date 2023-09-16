/**
 * Entry point of app: don't change this
 */
import GamePlay from "./GamePlay";
import GameController from "./GameController";
import GameStateService from "./GameStateService";

export const BOARD_SIZE = 8;

export const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector("#game-container"));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
