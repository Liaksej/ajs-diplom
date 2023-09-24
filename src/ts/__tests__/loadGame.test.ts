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
      "eyJ0dXJuIjoiZ2FtZXIiLCJsZXZlbCI6MSwicG9zaXRpb25zIjpbeyJjaGFyYWN0ZXIiOnsibGV2ZWwiOjEsImF0dGFjayI6MjUsImRlZmVuY2UiOjI1LCJoZWFsdGgiOjQyLjUsInR5cGUiOiJ2YW1waXJlIn0sInBvc2l0aW9uIjozLCJhdHRhY2tGaWVsZCI6WzEsMiwzLDQsNSw5LDEwLDExLDEyLDEzLDE3LDE4LDE5LDIwLDIxXSwibW92ZUZpZWxkIjpbMSwyLDMsNCw1LDEwLDExLDEyLDE3LDE5LDIxXSwiYm9hcmRTaXplIjo4fSx7ImNoYXJhY3RlciI6eyJsZXZlbCI6MSwiYXR0YWNrIjoxMCwiZGVmZW5jZSI6NDAsImhlYWx0aCI6NTAsInR5cGUiOiJtYWdpY2lhbiJ9LCJwb3NpdGlvbiI6NTcsImF0dGFja0ZpZWxkIjpbMjQsMjUsMjYsMjcsMjgsMjksMzIsMzMsMzQsMzUsMzYsMzcsNDAsNDEsNDIsNDMsNDQsNDUsNDgsNDksNTAsNTEsNTIsNTMsNTYsNTcsNTgsNTksNjAsNjFdLCJtb3ZlRmllbGQiOls0OCw0OSw1MCw1Niw1Nyw1OF0sImJvYXJkU2l6ZSI6OH0seyJjaGFyYWN0ZXIiOnsibGV2ZWwiOjEsImF0dGFjayI6MjUsImRlZmVuY2UiOjI1LCJoZWFsdGgiOjQwLCJ0eXBlIjoiYm93bWFuIn0sInBvc2l0aW9uIjoyMSwiYXR0YWNrRmllbGQiOlszLDQsNSw2LDcsMTEsMTIsMTMsMTQsMTUsMTksMjAsMjEsMjIsMjMsMjcsMjgsMjksMzAsMzEsMzUsMzYsMzcsMzgsMzldLCJtb3ZlRmllbGQiOlszLDUsNywxMiwxMywxNCwxOSwyMCwyMSwyMiwyMywyOCwyOSwzMCwzNSwzNywzOV0sImJvYXJkU2l6ZSI6OH1dLCJpc0dhbWVFbmQiOmZhbHNlLCJtYXhTY29yZSI6eyJnYW1lciI6MTQ5LjgsImNvbXB1dGVyIjozLjk5OTk5OTk5OTk5OTk4Nn19";
    (mockStorage.getItem as jest.Mock).mockReturnValue(validStateData);
    const ethalonObject = {
      turn: "gamer",
      level: 1,
      positions: [
        {
          character: {
            level: 1,
            attack: 25,
            defence: 25,
            health: 42.5,
            type: "vampire",
          },
          position: 3,
          attackField: [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 17, 18, 19, 20, 21],
          moveField: [1, 2, 3, 4, 5, 10, 11, 12, 17, 19, 21],
          boardSize: 8,
        },
        {
          character: {
            level: 1,
            attack: 10,
            defence: 40,
            health: 50,
            type: "magician",
          },
          position: 57,
          attackField: [
            24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44,
            45, 48, 49, 50, 51, 52, 53, 56, 57, 58, 59, 60, 61,
          ],
          moveField: [48, 49, 50, 56, 57, 58],
          boardSize: 8,
        },
        {
          character: {
            level: 1,
            attack: 25,
            defence: 25,
            health: 40,
            type: "bowman",
          },
          position: 21,
          attackField: [
            3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 27, 28, 29,
            30, 31, 35, 36, 37, 38, 39,
          ],
          moveField: [
            3, 5, 7, 12, 13, 14, 19, 20, 21, 22, 23, 28, 29, 30, 35, 37, 39,
          ],
          boardSize: 8,
        },
      ],
      isGameEnd: false,
      maxScore: {
        gamer: 149.8,
        computer: 3.999999999999986,
      },
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
