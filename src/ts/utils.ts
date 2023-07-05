/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index: number, boardSize: number) {
  // TODO: ваш код будет тут
  const leftArray = [...Array(boardSize - 2)].map((element, index) => {
    element = boardSize + boardSize * index;
    return element;
  });

  const rightArray = [...Array(boardSize - 2)].map((element, index) => {
    element = boardSize * index + boardSize * 2 - 1;
    return element;
  });

  const topArray = [...Array(boardSize - 2)].map((element, index) => {
    element = index + 1;
    return element;
  });

  const bottomArray = [...Array(boardSize - 2)].map((element, index) => {
    element = boardSize ** 2 - boardSize + index + 1;
    return element;
  });

  if (leftArray.includes(index)) return "left";
  if (rightArray.includes(index)) return "right";
  if (topArray.includes(index)) return "top";
  if (bottomArray.includes(index)) return "bottom";
  if (index === 0) return "top-left";
  if (index === boardSize ** 2 - 1) return "bottom-right";
  if (index === boardSize - 1) return "top-right";
  if (index === boardSize ** 2 - boardSize) return "bottom-left";
  return "center";
}

export function calcHealthLevel(health: number) {
  if (health < 15) {
    return "critical";
  }

  if (health < 50) {
    return "normal";
  }

  return "high";
}
