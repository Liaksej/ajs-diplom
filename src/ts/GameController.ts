import GamePlay from "./GamePlay";
import themes from "./themes";
import PositionedCharacter from "./PositionedCharacter";
import Character, { CharacterType, LevelType } from "./Character";
import { Bowman } from "./characters/Bowman";
import { Swordsman } from "./characters/Swordsman";
import { Magican } from "./characters/Magican";
import { Undead } from "./characters/Undead";
import { Vampire } from "./characters/Vampire";
import { Daemon } from "./characters/Daemon";
import { generateTeam } from "./generators";

export default class GameController {
  gamePlay: GamePlay;
  stateService: any;

  constructor(gamePlay: GamePlay, stateService: any) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(this.creatEnemyTeams());
    this.gamePlay.redrawPositions(this.creatGamerTeams());
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

  creatEnemyTeams(): PositionedCharacter[] {
    const enemyAllowedTeamMembers = [Undead, Vampire, Daemon];
    const enemyTeamCells = this.getTeamCells(this.gamePlay.boardSize, "enemy");

    const enemyTeam = generateTeam(enemyAllowedTeamMembers, 1, 3);

    return enemyTeam.characters.map((enemyTeamMember) => {
      return new PositionedCharacter(
        enemyTeamMember,
        enemyTeamCells[Math.floor(Math.random() * enemyTeamCells.length)],
      );
    });
  }

  creatGamerTeams(): PositionedCharacter[] {
    const gamerAllowedTeamMembers = [Bowman, Swordsman, Magican];
    const gamerTeamCells = this.getTeamCells(this.gamePlay.boardSize, "gamer");

    const gamerTeam = generateTeam(gamerAllowedTeamMembers, 1, 3);

    return gamerTeam.characters.map((enemyTeamMember) => {
      return new PositionedCharacter(
        enemyTeamMember,
        gamerTeamCells[Math.floor(Math.random() * gamerTeamCells.length)],
      );
    });
  }

  private getTeamCells(rowCells: number, role: string) {
    let allCells = rowCells ** 2;
    const teamCells = [];
    const rows = allCells / rowCells;
    for (let i = 0; i < rows; i++) {
      if (role === "gamer") {
        teamCells.push(allCells - rowCells + 2, allCells - rowCells + 1);
      }
      if (role === "enemy") {
        teamCells.push(allCells, allCells - 1);
      }
      allCells = allCells - rowCells;
    }
    return teamCells;
  }
}
