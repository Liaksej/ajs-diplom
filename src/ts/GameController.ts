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
import { getEuclideanDistance } from "./utils";
import Character, { LevelType } from "./Character";
import { gamePlay } from "./app";

export default class GameController {
  gamePlay: GamePlay;
  stateService: GameStateService;
  private positions: PositionedCharacter[];
  private gameState: GameState;
  private themesSelector = [
    themes.prairie,
    themes.desert,
    themes.arctic,
    themes.mountain,
  ];

  constructor(gamePlay: GamePlay, stateService: GameStateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.positions = [...this.creatEnemyTeams(2), ...this.creatGamerTeams(2)];
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(this.themesSelector[0]);
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    // TODO: load saved stated from stateService
  }

  private async onCellClick(index: number) {
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
      await this.causeDamage(selectedCharacter, position, index);
      return;
    }

    if (
      position === undefined &&
      selectedCharacter?.moveField.includes(index)
    ) {
      this.changeCell(selectedCharacter, index);
      return;
    }

    GamePlay.showError("Ошибка... Недопустимое действие");
    return;
  }

  private async causeDamage(
    selectedCharacter: PositionedCharacter,
    position: PositionedCharacter,
    index: number,
  ) {
    const damage = Math.max(
      selectedCharacter?.character.attack - position.character.defence,
      selectedCharacter?.character.attack * 0.1,
    );
    await this.gamePlay.showDamage(index, damage);

    position.character.health = position.character.health - damage;
    this.gamePlay.deselectAllCells();
    this.deathFitrator();
    this.newLevel();
    this.gamePlay.redrawPositions(this.positions);
    this.gameState = GameState.from(this.gameState);

    if (this.gameState.turn === "computer") {
      this.computerPass();
    }
  }

  private changeCell(selectedCharacter: PositionedCharacter, index: number) {
    selectedCharacter?.changePosition(index);
    this.gamePlay.deselectAllCells();
    this.gamePlay.redrawPositions(this.positions);
    this.gameState = GameState.from(this.gameState);

    if (this.gameState.turn === "computer") {
      this.computerPass();
    }
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

  private creatEnemyTeams(
    characters: number,
    maxLevel: LevelType = 1,
    survivedCharacters: Character[] = [],
  ): PositionedCharacter[] {
    const enemyAllowedTeamMembers = [Undead, Vampire, Daemon];
    const enemyTeamCells = this.getTeamCells(this.gamePlay.boardSize, "enemy");

    const enemyTeam = generateTeam(
      enemyAllowedTeamMembers,
      maxLevel,
      characters - survivedCharacters.length,
    );

    enemyTeam.characters.push(...survivedCharacters);

    return enemyTeam.characters.map((enemyTeamMember) => {
      const cell = enemyTeamCells.splice(
        Math.floor(Math.random() * enemyTeamCells.length),
        1,
      )[0];
      return new PositionedCharacter(enemyTeamMember, cell);
    });
  }

  private creatGamerTeams(
    characters: number,
    maxLevel: LevelType = 1,
    survivedCharacters: Character[] = [],
  ): PositionedCharacter[] {
    const gamerAllowedTeamMembers = [Bowman, Swordsman, Magician];
    const gamerTeamCells = this.getTeamCells(this.gamePlay.boardSize, "gamer");

    const gamerTeam = generateTeam(
      gamerAllowedTeamMembers,
      maxLevel,
      characters - survivedCharacters.length,
    );

    gamerTeam.characters.push(...survivedCharacters);

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
    const rows = (allCells + 1) / rowCells;
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

  private computerPass() {
    const gamer = this.positions.filter((position) =>
      ["bowman", "swordsman", "magician"].includes(position.character.type),
    );

    const computer = this.positions.filter((position) =>
      ["undead", "vampire", "daemon"].includes(position.character.type),
    );

    this.computerAttackLogic(gamer, computer) ||
      this.moveTowardsEnemy(gamer, computer);
  }

  private computerAttackLogic(
    gamer: PositionedCharacter[],
    computer: PositionedCharacter[],
  ) {
    let enemiesList: Array<PositionedCharacter[]> = [];

    computer.forEach((character) => {
      gamer.forEach((enemy) => {
        if (character.attackField.includes(enemy.position)) {
          enemiesList.push([character, enemy]);
        }
      });
    });

    if (enemiesList.length > 0) {
      enemiesList.forEach(([computerCharacter, gamerCharacter], index) => {
        if (
          enemiesList.length > 1 &&
          computerCharacter.character.health < gamerCharacter.character.health
        ) {
          enemiesList = enemiesList.filter((_item, i) => i !== index);
        }
      });
      enemiesList.forEach(([computerCharacter, gamerCharacter], index) => {
        if (
          enemiesList.length > 1 &&
          computerCharacter.character.attack < gamerCharacter.character.attack
        ) {
          enemiesList = enemiesList.filter((_item, i) => i !== index);
        }
      });
      enemiesList.forEach(([computerCharacter, gamerCharacter], index) => {
        if (
          enemiesList.length > 1 &&
          computerCharacter.character.defence < gamerCharacter.character.defence
        ) {
          enemiesList = enemiesList.filter((_item, i) => i !== index);
        }
      });
      const [computerCharacter, gamerCharacter] =
        enemiesList[Math.floor(Math.random() * enemiesList.length)];
      return this.causeDamage(
        computerCharacter,
        gamerCharacter,
        gamerCharacter.position,
      );
    }

    return null;
  }

  private moveTowardsEnemy(
    gamer: PositionedCharacter[],
    computer: PositionedCharacter[],
  ) {
    const boardSize = this.gamePlay.boardSize;

    const nearestEnemy: {
      enemy: PositionedCharacter | null;
      distance: number;
      computerPosition: PositionedCharacter | null;
    } = { enemy: null, distance: Infinity, computerPosition: null };

    computer.forEach((computerPosition) => {
      gamer.forEach((gamerPosition) => {
        const tempDistance = getEuclideanDistance(
          boardSize,
          computerPosition.position,
          gamerPosition.position,
        );

        if (nearestEnemy.distance > tempDistance) {
          nearestEnemy.distance = tempDistance;
          nearestEnemy.enemy = gamerPosition;
          nearestEnemy.computerPosition = computerPosition;
        }
      });
    });

    if (
      nearestEnemy.enemy !== null &&
      nearestEnemy.distance !== Infinity &&
      nearestEnemy.computerPosition !== null
    ) {
      const target = nearestEnemy.enemy?.position;
      let possiblePasses = nearestEnemy.computerPosition.moveField;

      if (typeof target === "number") {
        possiblePasses = possiblePasses.filter((point) =>
          this.gamePlay.checkEmptyCell(point),
        );

        const nearestPosition = possiblePasses.reduce((closest, point) => {
          const distanceToTarget = nearestEnemy.distance;
          const distanceToClosest = getEuclideanDistance(
            boardSize,
            closest,
            target,
          );

          return distanceToTarget < distanceToClosest ? point : closest;
        });
        this.changeCell(nearestEnemy.computerPosition, nearestPosition);
      }
    }
  }

  private deathFitrator() {
    this.positions = this.positions.filter(
      (position) => position.character.health > 0,
    );
  }

  private newLevel() {
    const chekEnemyTeam = this.positions.filter((position) =>
      ["undead", "daemon", "vampire"].includes(position.character.type),
    );
    const checkPlayerTeam = this.positions.filter((position) =>
      ["bowman", "swordsman", "magician"].includes(position.character.type),
    );
    if (
      (chekEnemyTeam.length === 0 && checkPlayerTeam.length > 0) ||
      (chekEnemyTeam.length > 0 && checkPlayerTeam.length === 0)
    ) {
      this.positions.forEach((position) => {
        position.character.levelUp();
        position.character.healthUp();
      });

      const nextLevel = this.positions[0].character.level;

      const restEnemyTeam = chekEnemyTeam.map((position) => {
        return position.character;
      });

      const restPlayerTeam = checkPlayerTeam.map((position) => {
        return position.character;
      });

      this.positions = [
        ...this.creatEnemyTeams(1 + nextLevel, nextLevel, restEnemyTeam),
        ...this.creatGamerTeams(1 + nextLevel, nextLevel, restPlayerTeam),
      ];
      this.gamePlay.changeTheme(this.themesSelector[nextLevel - 1]);
    }
  }
}
