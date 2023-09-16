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
import GameState from "./GameState";

export default class GameController {
  gamePlay: GamePlay;
  stateService: GameStateService;
  private positions: PositionedCharacter[];
  private gameState: GameState;

  constructor(gamePlay: GamePlay, stateService: GameStateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.positions = [...this.creatEnemyTeams(), ...this.creatGamerTeams()];
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    // TODO: load saved stated from stateService
  }

  private onCellClick(index: number) {
    const selectedCharacter = this.getSelectedCharacter();
    const position = this.getPosition(index);

    if (
      position &&
      ["swordsman", "bowman", "magician"].includes(position.character.type)
    ) {
      this.gamePlay.selectCell(index);
      return;
    }

    if (
      position &&
      selectedCharacter?.attackField.includes(index) &&
      ["undead", "vampire", "daemon"].includes(position.character.type)
    ) {
      // TODO: здесь организовать ход урона и редроу
      return;
    }

    if (
      position === undefined &&
      selectedCharacter?.moveField.includes(index)
    ) {
      selectedCharacter?.changePosition(index);
      this.gamePlay.deselectAllCells();
      this.gamePlay.redrawPositions(this.positions);
      this.gameState = GameState.from(this.gameState);
      return;
    }

    GamePlay.showError("Ошибка... Недопустимое действие");
    return;
  }

  private onCellEnter(index: number) {
    const position = this.getPosition(index);
    const selected = this.getSelectedCharacter();

    if (position) {
      this.gamePlay.showCellTooltip(this.createToolpitMessage(index), index);

      if (
        ["swordsman", "bowman", "magician"].includes(position.character.type)
      ) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (selected) {
        if (
          this.gamePlay.checkSelectedCell() &&
          ["daemon", "vampire", "undead"].includes(position.character.type)
        ) {
          if (selected.attackField.includes(index)) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectEnemyCell(index);
          }
        }
      }
    } else if (selected && this.gamePlay.checkEmptyCell(index)) {
      if (selected.moveField.includes(index)) {
        this.gamePlay.deselectEnemyCell();
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectEmptyCell(index);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
      this.gamePlay.deselectEnemyCell();
    }
  }

  private onCellLeave(index: number) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.deselectEmptyCell();
  }

  private getPosition(index: number) {
    return this.positions.find((position) => position.position === index);
  }

  private getSelectedCharacter() {
    return this.positions.find((position) =>
      this.gamePlay.findSelectedCell().includes(position.position),
    );
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
