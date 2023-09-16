export default class GameState {
  turn: "gamer" | "computer";

  constructor() {
    this.turn = "gamer";
  }

  static from(object: GameState) {
    const gameState = new GameState();
    gameState.turn = object.turn === "gamer" ? "computer" : "gamer";

    return gameState;
  }
}
