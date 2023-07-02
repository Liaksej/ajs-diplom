import GamePlay from "./GamePlay";
import themes from "./themes";

export default class GameController {
  gamePlay: GamePlay;
  stateService: any;
  constructor(gamePlay: GamePlay, stateService: any) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index: number) {
    // TODO: react to click
  }

  onCellEnter(index: number) {
    // TODO: react to mouse enter
  }

  onCellLeave(index: number) {
    // TODO: react to mouse leave
  }
}
