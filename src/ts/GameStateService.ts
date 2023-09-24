import { LevelType } from "./Character";
import PositionedCharacter from "./PositionedCharacter";

export interface ObjectForStore {
  turn: "gamer" | "computer";
  level: LevelType;
  positions: PositionedCharacter[];
  isGameEnd: boolean;
  maxScore: { gamer: number; computer: number };
}

export default class GameStateService {
  storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  save(state: ObjectForStore) {
    try {
      const data = JSON.stringify(state);

      const binaryArray = new Uint8Array(new ArrayBuffer(data.length));
      for (let i = 0; i < data.length; i++) {
        binaryArray[i] = data.charCodeAt(i);
      }
      const base64Data = btoa(
        String.fromCharCode.apply(null, Array.from(binaryArray)),
      );
      this.storage.setItem("state", base64Data);
    } catch (e) {
      throw new Error("Failed to save state: " + e);
    }
  }

  load() {
    const base64Data = this.storage.getItem("state");

    if (!base64Data) {
      throw new Error("No state data found in storage");
    }

    try {
      const binaryState = atob(base64Data);
      const length = binaryState.length;
      const binaryArray = new Uint8Array(new ArrayBuffer(length));
      for (let i = 0; i < length; i++) {
        binaryArray[i] = binaryState.charCodeAt(i);
      }
      const data = new TextDecoder().decode(binaryArray);
      return JSON.parse(data);
    } catch (e) {
      throw new Error("Invalid state");
    }
  }
}
