import { calcTileType } from "./utils";

it.each([
  ["top-left", [0, 8]],
  ["top-right", [7, 8]],
  ["top", [5, 7]],
  ["bottom-left", [42, 7]],
  ["bottom-right", [80, 9]],
  ["bottom", [98, 10]],
  ["right", [29, 6]],
  ["left", [5, 5]],
  ["center", [10, 8]],
])("calcTileType(%s)", (result, values) => {
  expect(calcTileType(values[0], values[1])).toBe(result);
});
