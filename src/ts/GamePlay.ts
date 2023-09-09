import { calcHealthLevel, calcTileType } from "./utils";
import PositionedCharacter from "./PositionedCharacter";

export default class GamePlay {
  boardSize: number;
  container: HTMLElement | null;
  boardEl: HTMLElement | null;
  cells: HTMLElement[];
  private cellClickListeners: ((index: number) => void)[];
  private cellEnterListeners: ((index: number) => void)[];
  private cellLeaveListeners: ((index: number) => void)[];
  private newGameListeners: EventListener[];
  private saveGameListeners: EventListener[];
  private loadGameListeners: EventListener[];
  [key: string]: any;

  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container: HTMLElement | null) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("container is not HTMLElement");
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme: string) {
    this.checkBinding();

    if (this.container instanceof HTMLElement) {
      this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

      this.newGameEl = this.container.querySelector("[data-id=action-restart]");
      this.saveGameEl = this.container.querySelector("[data-id=action-save]");
      this.loadGameEl = this.container.querySelector("[data-id=action-load]");

      this.newGameEl.addEventListener("click", (event: Event) =>
        this.onNewGameClick(event),
      );
      this.saveGameEl.addEventListener("click", (event: Event) =>
        this.onSaveGameClick(event),
      );
      this.loadGameEl.addEventListener("click", (event: Event) =>
        this.onLoadGameClick(event),
      );

      this.boardEl = this.container.querySelector("[data-id=board]");

      this.boardEl?.classList.add(theme);
      for (let i = 0; i < this.boardSize ** 2; i += 1) {
        const cellEl = document.createElement("div");
        cellEl.classList.add(
          "cell",
          "map-tile",
          `map-tile-${calcTileType(i, this.boardSize)}`,
        );
        cellEl.addEventListener("mouseenter", (event) =>
          this.onCellEnter(event),
        );
        cellEl.addEventListener("mouseleave", (event) =>
          this.onCellLeave(event),
        );
        cellEl.addEventListener("click", (event) => this.onCellClick(event));
        this.boardEl?.appendChild(cellEl);
      }

      if (this.boardEl) {
        this.cells = Array.from(this.boardEl.children) as HTMLElement[];
      }
    }
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions: PositionedCharacter[]) {
    for (const cell of this.cells) {
      cell.innerHTML = "";
    }

    for (const position of positions) {
      const cellEl = this.boardEl?.children[position.position];
      const charEl = document.createElement("div");
      charEl.classList.add("character", position.character.type);

      const healthEl = document.createElement("div");
      healthEl.classList.add("health-level");

      const healthIndicatorEl = document.createElement("div");
      healthIndicatorEl.classList.add(
        "health-level-indicator",
        `health-level-indicator-${calcHealthLevel(position.character.health)}`,
      );
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl?.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback: (index: number) => void) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback: (index: number) => void) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback: (index: number) => void) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback: never): void {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback: never) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback: never): void {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event: Event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget as HTMLElement);
    this.cellEnterListeners.forEach((o: (index: number) => void) =>
      o.call(null, index),
    );
  }

  onCellLeave(event: Event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget as HTMLElement);
    this.cellLeaveListeners.forEach((o: (index: number) => void) =>
      o.call(null, index),
    );
  }

  onCellClick(event: Event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget as HTMLElement);
    this.cellClickListeners.forEach((o: (index: number) => void) =>
      o.call(null, index),
    );
  }

  onNewGameClick(event: Event) {
    event.preventDefault();
    this.newGameListeners.forEach((o: any) => o.call(null));
  }

  onSaveGameClick(event: Event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o: any) => o.call(null));
  }

  onLoadGameClick(event: Event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o: any) => o.call(null));
  }

  static showError(message: string) {
    alert(message);
  }

  // static showMessage(message: string) {
  //   alert(message);
  // }

  selectCell(index: number, color = "yellow") {
    this.deselectCell();
    this.cells[index].classList.add("selected", `selected-${color}`);
  }

  selectEnemyCell(index: number, color = "red") {
    this.deselectEnemyCell();
    this.cells[index].classList.add("selected", `selected-${color}`);
  }

  selectEmptyCell(index: number, color = "green") {
    this.deselectEmptyCell();
    this.cells[index].classList.add("selected", `selected-${color}`);
  }

  private deselectCell() {
    this.cells.forEach((o) => o.classList.remove("selected"));
  }

  deselectEnemyCell() {
    const enemyCells = this.cells.filter((o) =>
      o.classList.contains("selected-red"),
    );
    enemyCells.forEach((o) => o.classList.remove("selected"));
  }

  deselectEmptyCell() {
    const emptyCell = this.cells.filter((o) =>
      o.classList.contains("selected-green"),
    );
    emptyCell.forEach((o) => o.classList.remove("selected"));
  }

  showCellTooltip(message: string, index: number) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index: number) {
    this.cells[index].title = "";
  }

  showDamage(index: number, damage: any): Promise<void> {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement("span");
      damageEl.textContent = damage;
      damageEl.classList.add("damage");
      cell.appendChild(damageEl);

      damageEl.addEventListener("animationend", () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor: string) {
    if (this.boardEl) {
      this.boardEl.style.cursor = cursor;
    }
  }

  checkSelectedCell() {
    return this.cells.some((o) => o.classList.contains("selected"));
  }

  findSelectedCell() {
    return this.cells
      .map((o, i) => {
        return o.classList.contains("selected") ? i : null;
      })
      .filter((x) => x !== null);
  }

  checkEmptyCell(index: number) {
    return this.cells[index].childElementCount === 0;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error("GamePlay not bind to DOM");
    }
  }
}
