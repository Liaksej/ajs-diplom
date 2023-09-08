import GamePlay from "./GamePlay";
import themes from "./themes";
import PositionedCharacter from "./PositionedCharacter";
import { Bowman } from "./characters/Bowman";
import { Swordsman } from "./characters/Swordsman";
import { Magician } from "./characters/Magician";
import { Undead } from "./characters/Undead";
import { Vampire } from "./characters/Vampire";
import { Daemon } from "./characters/Daemon";
import { generateTeam } from "./generators";
import GameStateService from "./GameStateService";
import cursors from "./cursors";

export default class GameController {
  gamePlay: GamePlay;
  stateService: GameStateService;
  private positions: PositionedCharacter[];

  constructor(gamePlay: GamePlay, stateService: GameStateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.positions = [...this.creatEnemyTeams(), ...this.creatGamerTeams()];
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  private onCellClick(index: number) {
    if (
      this.positions.some(
        (position) =>
          position.position === index &&
          ["swordsman", "bowman", "magician"].includes(position.character.type),
      )
    ) {
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError("Ошибка... Выберите своего персонажа");
    }
  }

  private onCellEnter(index: number) {
    const position = this.positions.find(
      (position) => position.position === index,
    );
    if (position) {
      this.gamePlay.deselectEmptyCell();
      this.gamePlay.showCellTooltip(this.createToolpitMessage(index), index);

      if (
        ["swordsman", "bowman", "magician"].includes(position.character.type)
      ) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (this.gamePlay.checkSelectedCell()) {
        if (["daemon", "vampire", "undead"].includes(position.character.type)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectEnemyCell(index);
        }
      }
    } else if (
      this.gamePlay.checkSelectedCell() &&
      this.gamePlay.checkEmptyCell(index)
    ) {
      this.gamePlay.deselectEnemyCell();
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectEmptyCell(index);
    }
    // TODO: Если ход не допустим, показывать этот кейс.
    // else if () {
    //   this.gamePlay.setCursor(cursors.notallowed);
    // }
    else {
      this.gamePlay.setCursor(cursors.auto);
      this.gamePlay.deselectEnemyCell();
    }
  }

  private onCellLeave(index: number) {
    this.gamePlay.hideCellTooltip(index);
  }

  private createToolpitMessage(index: number): string {
    const position = this.positions.find(
      (position) => position.position === index,
    );

    return `\u{1F396} ${position?.character.level} \u{2694} ${position?.character.attack} \u{1F6E1} ${position?.character.defence} \u{2764} ${position?.character.health}`;
  }

  private creatEnemyTeams(): PositionedCharacter[] {
    const enemyAllowedTeamMembers = [Undead, Vampire, Daemon];
    const enemyTeamCells = this.getTeamCells(8, "enemy");

    const enemyTeam = generateTeam(enemyAllowedTeamMembers, 1, 3);

    return enemyTeam.characters.map((enemyTeamMember) => {
      const cell = enemyTeamCells.splice(
        Math.floor(Math.random() * enemyTeamCells.length),
        1,
      )[0];
      return new PositionedCharacter(enemyTeamMember, cell);
    });
  }

  private creatGamerTeams(): PositionedCharacter[] {
    const gamerAllowedTeamMembers = [Bowman, Swordsman, Magician];
    const gamerTeamCells = this.getTeamCells(8, "gamer");

    const gamerTeam = generateTeam(gamerAllowedTeamMembers, 1, 3);

    return gamerTeam.characters.map((gamerTeamMember) => {
      const cell = gamerTeamCells.splice(
        Math.floor(Math.random() * gamerTeamCells.length),
        1,
      )[0];
      return new PositionedCharacter(gamerTeamMember, cell);
    });
  }

  private getTeamCells(rowCells: number, role: string) {
    let allCells = rowCells ** 2 - 1;
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
