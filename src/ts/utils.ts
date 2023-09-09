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

export function checkPass(
  character: string,
  boardSize: number,
  position: number,
) {
  const pass = ["swordsman", "undead"].includes(character)
    ? 4
    : ["bowman", "vampire"].includes(character)
    ? 2
    : 1;

  const possiblePassRaw = possiblePassArrayGenerator(pass, boardSize, position);

  return possibleActionArrayCleaner(pass, boardSize, position, possiblePassRaw);
}

export function checkAttack(
  character: string,
  boardSize: number,
  position: number,
) {
  const pass = ["swordsman", "undead"].includes(character)
    ? 1
    : ["bowman", "vampire"].includes(character)
    ? 2
    : 4;

  const possibleAttackRaw = possibleAttackArrayGenerator(
    pass,
    boardSize,
    position,
  );

  return possibleActionArrayCleaner(
    pass,
    boardSize,
    position,
    possibleAttackRaw,
  );
}

function possibleActionArrayCleaner(
  pass: number,
  boardSize: number,
  position: number,
  possiblePassRaw: number[],
) {
  const x0 = position % boardSize;
  const y0 = Math.floor(position / boardSize);

  return possiblePassRaw.filter((index) => {
    if (index < 0 || index >= boardSize ** 2) {
      return false;
    }

    const x = index % boardSize;
    const y = Math.floor(index / boardSize);

    return Math.abs(x - x0) <= pass && Math.abs(y - y0) <= pass;
  });
}

function possiblePassArrayGenerator(
  pass: number,
  boardSize: number,
  position: number,
) {
  const directions = [
    -boardSize - 1,
    -boardSize,
    -boardSize + 1,
    -1,
    1,
    boardSize - 1,
    boardSize,
    boardSize + 1,
  ];
  const passArray: number[] = [];
  for (let i = 1; i <= pass; i++) {
    for (const dir of directions) {
      passArray.push(position + dir * i);
    }
  }
  return passArray;
}

function possibleAttackArrayGenerator(
  attack: number,
  boardSize: number,
  position: number,
) {
  const atackArray: number[] = [];
  for (let i = 1; i <= attack; i++) {
    for (let a = -attack; a <= attack; a++) {
      atackArray.push(position + a + i * boardSize);
    }
  }
  return atackArray;
}
