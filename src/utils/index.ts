import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";
import React from "react";

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
      const topLeftBomb =
        rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRightBomb =
        rowIndex > 0 && colIndex < MAX_COLS - 1
          ? cells[rowIndex - 1][colIndex + 1]
          : null;
      const rightBomb =
        colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomRightBomb =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
          ? cells[rowIndex + 1][colIndex + 1]
          : null;
      const bottomBomb =
        rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
      const bottomLeftBomb =
        rowIndex < MAX_ROWS - 1 && colIndex > 0
          ? cells[rowIndex + 1][colIndex - 1]
          : null;
      const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;

      // 检查它们有没有地雷
      if (topLeftBomb && topLeftBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (topBomb && topBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (topRightBomb && topRightBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (rightBomb && rightBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (bottomRightBomb && bottomRightBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (bottomBomb && bottomBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (bottomLeftBomb && bottomLeftBomb.value === CellValue.Bomb) {
        numberOfBombs += 1;
      }
      if (leftBomb && leftBomb.value === CellValue.Bomb) {
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
