import GamePlay from "./GamePlay";
import themes from "./themes";
import PositionedCharacter from "./PositionedCharacter";

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

  creatTeams() {
    const gamerTeam;
    const enemyTeam;
    const gamerTeamCells: number[] = getTeamCells(64, 8, "gamer");
    const enemyTeamCells: number[] = getTeamCells(64, 8, "enemy");

    function getTeamCells(allCells: number, rowCells: number, role: string) {
      const teamCells: number[] = [];
      const rows = allCells / rowCells;
      for (let i = 0; i < rows; i++) {
        if (role === "gamer") {
          teamCells.push(...[allCells - rowCells - 2, allCells - rowCells - 2]);
        }
        if (role === "enemy") {
          teamCells.push(...[allCells, allCells - 1]);
        }
      }
      allCells = allCells - rowCells;
      return teamCells;
    }
  }
}
