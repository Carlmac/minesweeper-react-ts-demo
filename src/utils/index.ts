import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";
// import React from "react";

// 获取周围 8 个格子的函数
const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  rightCell: Cell | null;
  bottomRightCell: Cell | null;
  bottomCell: Cell | null;
  bottomLeftCell: Cell | null;
  leftCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const rightCell =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    rightCell,
    bottomRightCell,
    bottomCell,
    bottomLeftCell,
    leftCell,
  };
};
export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  // 生成 9 x 9 个格子
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.None,
        // state: CellState.Visible, // to.do 测试完后改回 open
        state: CellState.Open,
      });
    }
  }

  // 随机生成 10 个地雷
  let bombsPlaced = 0;
  while (bombsPlaced < NUMBER_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    let currentCell = cells[randomRow][randomCol];

    if (currentCell.value !== CellValue.Bomb) {
      currentCell.value = CellValue.Bomb;
      bombsPlaced += 1;
    }
  }

  // 给没地雷的格子计算周围的地雷数
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];

      if (currentCell.value === CellValue.Bomb) {
        continue;
      }

      let numberOfBombs = 0;

      // 获取当前格子的周围8个格子
      const {
        topLeftCell,
        topCell,
        topRightCell,
        rightCell,
        bottomRightCell,
        bottomCell,
        bottomLeftCell,
        leftCell,
      } = grabAllAdjacentCells(cells, rowIndex, colIndex);

      // 检查它们有没有地雷
      if (topLeftCell && topLeftCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (topCell && topCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (topRightCell && topRightCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (rightCell && rightCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (bottomRightCell && bottomRightCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (bottomCell && bottomCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (bottomLeftCell && bottomLeftCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (leftCell && leftCell.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.Visible ||
    currentCell.state === CellState.Flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.Visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    rightCell,
    bottomRightCell,
    bottomCell,
    bottomLeftCell,
    leftCell,
  } = grabAllAdjacentCells(cells, rowParam, colParam);

  if (
    topLeftCell &&
    topLeftCell.state === CellState.Open &&
    topLeftCell.value !== CellValue.Bomb
  ) {
    if (topLeftCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.Visible;
    }
  }

  if (
    topCell &&
    topCell.state === CellState.Open &&
    topCell.value !== CellValue.Bomb
  ) {
    if (topCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.Visible;
    }
  }

  if (
    topRightCell &&
    topRightCell.state === CellState.Open &&
    topRightCell.value !== CellValue.Bomb
  ) {
    if (topRightCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.Visible;
    }
  }

  if (
    rightCell &&
    rightCell.state === CellState.Open &&
    rightCell.value !== CellValue.Bomb
  ) {
    if (rightCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.Visible;
    }
  }

  if (
    bottomRightCell &&
    bottomRightCell.state === CellState.Open &&
    bottomRightCell.value !== CellValue.Bomb
  ) {
    if (bottomRightCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.Visible;
    }
  }

  if (
    bottomCell &&
    bottomCell.state === CellState.Open &&
    bottomCell.value !== CellValue.Bomb
  ) {
    if (bottomCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.Visible;
    }
  }

  if (
    bottomLeftCell &&
    bottomLeftCell.state === CellState.Open &&
    bottomLeftCell.value !== CellValue.Bomb
  ) {
    if (bottomLeftCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.Visible;
    }
  }

  if (
    leftCell &&
    leftCell.state === CellState.Open &&
    leftCell.value !== CellValue.Bomb
  ) {
    if (leftCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.Visible;
    }
  }

  return newCells;
};
