import GameStateService from "../GameStateService";

describe("GameStateService", () => {
  let service: GameStateService;
  let mockStorage: Storage;

  beforeEach(() => {
    mockStorage = {
      getItem: jest.fn() as jest.MockedFunction<Storage["getItem"]>,
      setItem: jest.fn() as jest.MockedFunction<Storage["setItem"]>,
      clear: jest.fn() as jest.MockedFunction<Storage["clear"]>,
      removeItem: jest.fn() as jest.MockedFunction<Storage["removeItem"]>,
      key: jest.fn() as jest.MockedFunction<Storage["key"]>,
      length: 1,
    } as Storage;

    service = new GameStateService(mockStorage);
  });

  test("should load valid state from storage", () => {
    const validStateData =
      "eyJ0dXJuIjoiZ2FtZXIiLCJsZXZlbCI6MiwicG9zaXRpb25zIjpbeyJjaGFyYWN0ZXIiOnsibGV2ZWwiOjEsImF0dGFjayI6MTAsImRlZmVuY2UiOjEwLCJoZWFsdGgiOjUwLCJ0eXBlIjoiZGFlbW9uIn0sInBvc2l0aW9uIjozOSwiYXR0YWNrRmllbGQiOlszLDQsNSw2LDcsMTEsMTIsMTMsMTQsMTUsMTksMjAsMjEsMjIsMjMsMjcsMjgsMjksMzAsMzEsMzUsMzYsMzcsMzgsMzksNDMsNDQsNDUsNDYsNDcsNTEsNTIsNTMsNTQsNTUsNTksNjAsNjEsNjIsNjNdLCJtb3ZlRmllbGQiOlszMCwzMSwzOCwzOSw0Niw0N10sImJvYXJkU2l6ZSI6OH0seyJjaGFyYWN0ZXIiOnsibGV2ZWwiOjIsImF0dGFjayI6MTAsImRlZmVuY2UiOjEwLCJoZWFsdGgiOjQ2LCJ0eXBlIjoiZGFlbW9uIn0sInBvc2l0aW9uIjoxMywiYXR0YWNrRmllbGQiOlsxLDIsMyw0LDUsNiw3LDksMTAsMTEsMTIsMTMsMTQsMTUsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzMsMzQsMzUsMzYsMzcsMzgsMzksNDEsNDIsNDMsNDQsNDUsNDYsNDddLCJtb3ZlRmllbGQiOls0LDUsNiwxMiwxMywxNCwyMCwyMSwyMl0sImJvYXJkU2l6ZSI6OH0seyJjaGFyYWN0ZXIiOnsibGV2ZWwiOjEsImF0dGFjayI6NDAsImRlZmVuY2UiOjEwLCJoZWFsdGgiOjUwLCJ0eXBlIjoidW5kZWFkIn0sInBvc2l0aW9uIjo0NywiYXR0YWNrRmllbGQiOlszOCwzOSw0Niw0Nyw1NCw1NV0sIm1vdmVGaWVsZCI6WzExLDE1LDIwLDIzLDI5LDMxLDM4LDM5LDQzLDQ0LDQ1LDQ2LDQ3LDU0LDU1LDYxLDYzXSwiYm9hcmRTaXplIjo4fSx7ImNoYXJhY3RlciI6eyJsZXZlbCI6MiwiYXR0YWNrIjoxMCwiZGVmZW5jZSI6NDAsImhlYWx0aCI6NDUsInR5cGUiOiJtYWdpY2lhbiJ9LCJwb3NpdGlvbiI6MzQsImF0dGFja0ZpZWxkIjpbMCwxLDIsMyw0LDUsNiw4LDksMTAsMTEsMTIsMTMsMTQsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzIsMzMsMzQsMzUsMzYsMzcsMzgsNDAsNDEsNDIsNDMsNDQsNDUsNDYsNDgsNDksNTAsNTEsNTIsNTMsNTQsNTYsNTcsNTgsNTksNjAsNjEsNjJdLCJtb3ZlRmllbGQiOlsyNSwyNiwyNywzMywzNCwzNSw0MSw0Miw0M10sImJvYXJkU2l6ZSI6OH0seyJjaGFyYWN0ZXIiOnsibGV2ZWwiOjEsImF0dGFjayI6MjUsImRlZmVuY2UiOjI1LCJoZWFsdGgiOjUwLCJ0eXBlIjoiYm93bWFuIn0sInBvc2l0aW9uIjo1NiwiYXR0YWNrRmllbGQiOls0MCw0MSw0Miw0OCw0OSw1MCw1Niw1Nyw1OF0sIm1vdmVGaWVsZCI6WzQwLDQyLDQ4LDQ5LDU2LDU3LDU4XSwiYm9hcmRTaXplIjo4fSx7ImNoYXJhY3RlciI6eyJsZXZlbCI6MiwiYXR0YWNrIjoyNSwiZGVmZW5jZSI6MjUsImhlYWx0aCI6ODIuNSwidHlwZSI6ImJvd21hbiJ9LCJwb3NpdGlvbiI6NDAsImF0dGFja0ZpZWxkIjpbMjQsMjUsMjYsMzIsMzMsMzQsNDAsNDEsNDIsNDgsNDksNTAsNTYsNTcsNThdLCJtb3ZlRmllbGQiOlsyNCwyNiwzMiwzMyw0MCw0MSw0Miw0OCw0OSw1Niw1OF0sImJvYXJkU2l6ZSI6OH1dLCJpc0dhbWVFbmQiOmZhbHNlfQ==";
    (mockStorage.getItem as jest.Mock).mockReturnValue(validStateData);
    const ethalonObject = {
      isGameEnd: false,
      level: 2,
      positions: [
        {
          attackField: [
            3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29,
            30, 31, 35, 36, 37, 38, 39, 43, 44, 45, 46, 47, 51, 52, 53, 54, 55,
            59, 60, 61, 62, 63,
          ],
          boardSize: 8,
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          moveField: [30, 31, 38, 39, 46, 47],
          position: 39,
        },
        {
          attackField: [
            1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21,
            22, 23, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 41,
            42, 43, 44, 45, 46, 47,
          ],
          boardSize: 8,
          character: {
            attack: 10,
            defence: 10,
            health: 46,
            level: 2,
            type: "daemon",
          },
          moveField: [4, 5, 6, 12, 13, 14, 20, 21, 22],
          position: 13,
        },
        {
          attackField: [38, 39, 46, 47, 54, 55],
          boardSize: 8,
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          moveField: [
            11, 15, 20, 23, 29, 31, 38, 39, 43, 44, 45, 46, 47, 54, 55, 61, 63,
          ],
          position: 47,
        },
        {
          attackField: [
            0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20,
            21, 22, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 40,
            41, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59,
            60, 61, 62,
          ],
          boardSize: 8,
          character: {
            attack: 10,
            defence: 40,
            health: 45,
            level: 2,
            type: "magician",
          },
          moveField: [25, 26, 27, 33, 34, 35, 41, 42, 43],
          position: 34,
        },
        {
          attackField: [40, 41, 42, 48, 49, 50, 56, 57, 58],
          boardSize: 8,
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          moveField: [40, 42, 48, 49, 56, 57, 58],
          position: 56,
        },
        {
          attackField: [
            24, 25, 26, 32, 33, 34, 40, 41, 42, 48, 49, 50, 56, 57, 58,
          ],
          boardSize: 8,
          character: {
            attack: 25,
            defence: 25,
            health: 82.5,
            level: 2,
            type: "bowman",
          },
          moveField: [24, 26, 32, 33, 40, 41, 42, 48, 49, 56, 58],
          position: 40,
        },
      ],
      turn: "gamer",
    };

    const result = service.load();

    expect(result).toEqual(ethalonObject);
  });

  test("should throw error when no state in storage", () => {
    (mockStorage.getItem as jest.Mock).mockReturnValue(null);

    expect(() => service.load()).toThrowError(
      new Error("No state data found in storage"),
    );
  });

  test("should throw error when state data is invalid", () => {
    const invalidStateData = "invalid data";
    (mockStorage.getItem as jest.Mock).mockReturnValue(invalidStateData);

    expect(() => service.load()).toThrowError(new Error("Invalid state"));
  });
});
