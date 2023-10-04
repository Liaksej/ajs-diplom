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
import { getEuclideanDistance, getTeamCells } from "./utils";
import Character, { LevelType } from "./Character";
import Team from "./Team";

export default class GameController {
  gamePlay: GamePlay;
  stateService: GameStateService;
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
    this.gameState = new GameState();
    this.gameState.level = 1;
    this.gameState.isGameEnd = false;
    this.gameState.positions = [
      ...this.creatEnemyTeams(2, this.gameState.level),
      ...this.creatGamerTeams(2, this.gameState.level),
    ];
  }
  async init() {
    this.gamePlay.drawUi(this.themesSelector[0]);
    this.gamePlay.redrawPositions(this.gameState.positions);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    await this.gameState.setPreviousScores();
    await this.updateMaxScores();
  }

  private async onCellClick(index: number) {
    if (this.gameState.isGameEnd) return;

    const selectedCharacter = this.getSelectedCharacter();
    const position = this.getPosition(index);

    if (position && Team.checkGamerCharacters(position.character.type)) {
      this.gamePlay.selectCell(index);
      return;
    }

    if (
      position &&
      selectedCharacter?.attackField.includes(index) &&
      Team.checkComputerCharacters(position.character.type)
    ) {
      return this.causeDamage(selectedCharacter, position, index);
    }

    if (
      position === undefined &&
      selectedCharacter?.moveField.includes(index)
    ) {
      await this.changeCell(selectedCharacter, index);
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
    const charactersCount = this.gameState.positions.length;
    this.gameState.positions = this.gameState.positions.filter(
      (position) => position.character.health > 0,
    );
    await this.newLevel();
    this.gamePlay.redrawPositions(this.gameState.positions);
    await this.updateMaxScores();

    this.selectedCellsChecker(charactersCount);
    this.gameState.from(this.gameState);

    if (this.gameState.turn === "computer") {
      this.computerPass();
    }
  }

  private async changeCell(
    selectedCharacter: PositionedCharacter,
    index: number,
  ) {
    selectedCharacter?.changePosition(index);
    if (Team.checkGamerCharacters(selectedCharacter?.character.type)) {
      this.gamePlay.deselectAllCells();
      this.gamePlay.selectCell(index);
    }
    this.gameState.from(this.gameState);
    this.gamePlay.redrawPositions(this.gameState.positions);
    await this.updateMaxScores();

    if (this.gameState.turn === "computer") {
      this.computerPass();
    }
  }

  private onCellEnter(index: number) {
    if (this.gameState.isGameEnd) return;
    const position = this.getPosition(index);
    const selected = this.getSelectedCharacter();

    if (position) {
      this.gamePlay.showCellTooltip(this.createTooltipMessage(index), index);

      if (Team.checkGamerCharacters(position.character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (selected) {
        if (
          this.gamePlay.checkSelectedCell() &&
          Team.checkComputerCharacters(position.character.type)
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
    return this.gameState.positions.find(
      (position) => position.position === index,
    );
  }

  private getSelectedCharacter() {
    return this.gameState.positions.find((position) =>
      this.gamePlay.findSelectedCell().includes(position.position),
    );
  }

  private createTooltipMessage(index: number): string {
    const position = this.gameState.positions.find(
      (position) => position.position === index,
    );

    return `\u{1F396} ${position?.character.level} \u{2694} ${position?.character.attack} \u{1F6E1} ${position?.character.defence} \u{2764} ${position?.character.health}`;
  }

  private creatEnemyTeams(
    characters: number,
    maxLevel: LevelType,
  ): PositionedCharacter[] {
    const enemyAllowedTeamMembers = [Undead, Vampire, Daemon];
    const enemyTeamCells = getTeamCells(this.gamePlay.boardSize, "enemy");

    const enemyTeam = generateTeam(
      enemyAllowedTeamMembers,
      maxLevel,
      characters,
    );

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
    maxLevel: LevelType,
    survivedCharacters: Character[] = [],
  ): PositionedCharacter[] {
    const gamerAllowedTeamMembers = [Bowman, Swordsman, Magician];
    const gamerTeamCells = getTeamCells(this.gamePlay.boardSize, "gamer");

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

  /**
   * Executes the computer's turn in the game by selecting a target and performing an attack or movement action.
   *
   * @private
   * @function computerPass
   */
  private computerPass() {
    const gamer = this.gameState.positions.filter((position) =>
      Team.checkGamerCharacters(position.character.type),
    );

    const computer = this.gameState.positions.filter((position) =>
      Team.checkComputerCharacters(position.character.type),
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

  /**
   * Moves the computer-controlled characters towards the nearest enemy character.
   *
   * @param {PositionedCharacter[]} gamer - The array containing the player-controlled characters.
   * @param {PositionedCharacter[]} computer - The array containing the computer-controlled characters.
   *
   * @return {void}
   */
  private async moveTowardsEnemy(
    gamer: PositionedCharacter[],
    computer: PositionedCharacter[],
  ): Promise<void> {
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
      const target = nearestEnemy.enemy.position;
      let possiblePasses = nearestEnemy.computerPosition.moveField;

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
      await this.changeCell(nearestEnemy.computerPosition, nearestPosition);
      this.selectedCellsChecker();
    }
  }

  /**
   * Checks if all selected cells are valid based on the number of heroes and game state.
   *
   * @param {number} [numberOfHeroes] - The number of heroes.
   * @returns {void}
   */
  private selectedCellsChecker(numberOfHeroes?: number): void {
    if (
      numberOfHeroes &&
      this.gameState.positions.length < numberOfHeroes &&
      this.gamePlay.checkSelectedEmptyCell()
    ) {
      return this.gamePlay.deselectAllCells();
    }

    if (this.gamePlay.checkSelectedemptyEnemyCell()) {
      return this.gamePlay.deselectEnemyCell();
    }
  }
  private async newLevel() {
    const checkEnemyTeam = this.gameState.positions.filter((position) =>
      Team.checkComputerCharacters(position.character.type),
    );
    const checkPlayerTeam = this.gameState.positions.filter((position) =>
      Team.checkGamerCharacters(position.character.type),
    );
    if (checkPlayerTeam.length === 0) {
      return this.gameOver();
    }
    if (checkEnemyTeam.length === 0) {
      if (this.gameState.level === 4) {
        return this.gameOver();
      }

      this.gameState.level = (this.gameState.level + 1) as LevelType;
      const nextLevel = this.gameState.level as LevelType;

      this.gameState.positions.forEach((position) => {
        position.character.levelUp(nextLevel);
        position.character.healthUp();
      });

      this.gameState.turn = "computer";

      const restPlayerTeam = checkPlayerTeam.map((position) => {
        return position.character;
      });

      this.gameState.positions = [
        ...this.creatEnemyTeams(1 + nextLevel, nextLevel),
        ...this.creatGamerTeams(1 + nextLevel, nextLevel, restPlayerTeam),
      ];
      this.gamePlay.changeTheme(this.themesSelector[nextLevel - 1]);
      await this.gameState.setPreviousScores();

      this.gamePlay.deselectAllCells();
    }
  }

  private gameOver() {
    this.gameState.isGameEnd = true;
    this.gamePlay.deselectAllCells();
    this.gamePlay.setCursor(cursors.auto);
    this.gameState.positions = [];
  }

  private async newGame() {
    this.gameState = new GameState();
    this.gameState.positions = [
      ...this.creatEnemyTeams(2, this.gameState.level),
      ...this.creatGamerTeams(2, this.gameState.level),
    ];
    this.gamePlay.changeTheme(this.themesSelector[0]);
    this.gamePlay.redrawPositions(this.gameState.positions);
    await this.gameState.setPreviousScores();
    await this.updateMaxScores();
    this.gamePlay.deselectAllCells();
  }

  private onSaveGame() {
    const objectForSave = {
      turn: this.gameState.turn,
      level: this.gameState.level,
      positions: this.gameState.positions,
      isGameEnd: this.gameState.isGameEnd,
      maxScore: this.gameState.maxScore,
    };

    this.stateService.save(objectForSave);
  }

  private async onLoadGame() {
    this.gameState.loadData(this.stateService.load());

    this.gamePlay.deselectAllCells();
    this.gamePlay.redrawPositions(this.gameState.positions);
    await this.gameState.setPreviousScores();
    await this.updateMaxScores();
    this.gamePlay.changeTheme(this.themesSelector[this.gameState.level - 1]);
  }

  private async updateMaxScores() {
    await this.gameState.getMaxScore();

    this.gamePlay.drawScore(this.gameState.maxScore);
  }
}
