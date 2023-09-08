import Character from "./Character";

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

// Расчет хода. Направление движения аналогично ферзю в шахматах. Персонажи разного типа могут ходить на разное расстояние (в базовом варианте можно перескакивать через других персонажей, т.е. как конь в шахматах, единственное правило - ходим по прямым и по диагонали):
//
// Мечники/Скелеты - 4 клетки в любом направлении
// Лучники/Вампиры - 2 клетки в любом направлении

// Маги/Демоны - 1 клетка в любом направлении
export function checkPass(
  character: { type: string },
  boardSize: number,
  position: number,
) {
  const pass = ["swordsman", "undead"].includes(character.type)
    ? 4
    : ["bowman", "vampire"].includes(character.type)
    ? 2
    : 1;

  const possiblePass = possibleActionArrayCleaner(pass, boardSize, position);

  return possiblePass.includes(position);
}

export function checkAttack(
  character: { type: string },
  boardSize: number,
  position: number,
) {
  const pass = ["swordsman", "undead"].includes(character.type)
    ? 1
    : ["bowman", "vampire"].includes(character.type)
    ? 2
    : 4;

  const possiblePass = possibleActionArrayCleaner(pass, boardSize, position);

  return possiblePass.includes(position);
}

function possibleActionArrayCleaner(
  pass: number,
  boardSize: number,
  position: number,
) {
  const possiblePassRaw: number[] = possibleActionArrayGenerator(
    pass,
    boardSize,
    position,
  );

  const possiblePass = possiblePassRaw.filter((index) => {
    if (index < 0 || index >= boardSize ** 2) {
      return false;
    }

    const diff = Math.abs(position - index);
    return !(diff % boardSize > pass || Math.floor(diff / boardSize) > pass);
  });

  possiblePass.includes(position);
  return possiblePass;
}

function possibleActionArrayGenerator(
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
  const iter: number[] = [];
  for (let i = 1; i <= pass; i++) {
    for (const dir of directions) {
      iter.push(position + dir * i);
    }
  }
  return iter;
}
