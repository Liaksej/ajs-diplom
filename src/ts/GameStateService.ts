export default class GameStateService {
  storage: any;
  constructor(storage: any) {
    this.storage = storage;
  }

  save(state: any) {
    this.storage.setItem("state", JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem("state"));
    } catch (e) {
      throw new Error("Invalid state");
    }
  }
}
