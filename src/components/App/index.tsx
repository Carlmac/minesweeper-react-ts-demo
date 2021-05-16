import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import Button from "../Button";
import { Cell, CellState, CellValue, Face } from "../../types";
import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NUMBER_OF_BOMBS);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = () => {
      if (hasWon || hasLost) {
        return;
      }
      setFace(Face.Oh);
    };
    const handleMouseUp = () => {
      if (hasWon || hasLost) {
        return;
      }
      setFace(Face.Smile);
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hasWon, hasLost]);

  useEffect(() => {
    if (live && time < 999) {
      const timer = window.setInterval(() => {
        setTime(time + 1);
      }, 1000);
      return () => {
        window.clearInterval(timer);
      };
    }
  }, [live, time]);

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.Lost);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.Won);
    }
  }, [hasWon]);

  // 左键点击格子时的行为
  const handleCellClick = (rowParam: number, colParam: number) => {
    return () => {
      // 如果游戏已经结束，不响应点击
      if (hasWon || hasLost) {
        return;
      }

      let newCells = cells.slice();

      // 检查按的第一个格子是不是炸弹，是的话重新创建格子
      if (!live) {
        let isABomb = newCells[rowParam][colParam].value === CellValue.Bomb;
        while (isABomb) {
          newCells = generateCells();
          if (newCells[rowParam][colParam].value !== CellValue.Bomb) {
            isABomb = false;
            break;
          }
        }
        setLive(true);
      }

      const currentCell = newCells[rowParam][colParam];

      if ([CellState.Flagged, CellState.Visible].includes(currentCell.state)) {
        return;
      }

      if (currentCell.state === CellState.Flagged) {
        return;
      }

      if (currentCell.value === CellValue.Bomb) {
        // 爆炸
        setHasLost(true);
        newCells[rowParam][colParam].red = true;
        newCells = showAllBombs();
        setCells(newCells);
        return;
      } else if (currentCell.value === CellValue.None) {
        newCells = openMultipleCells(newCells, rowParam, colParam);
      } else {
        newCells[rowParam][colParam].state = CellState.Visible;
      }

      let safeOpenCellsExists = false;
      for (let row = 0; row < MAX_ROWS; row++) {
        for (let col = 0; col < MAX_COLS; col++) {
          const currentCell = newCells[row][col];

          if (
            currentCell.value !== CellValue.Bomb &&
            currentCell.state === CellState.Open
          ) {
            safeOpenCellsExists = true;
            break;
          }
        }
      }

      if (!safeOpenCellsExists) {
        newCells = newCells.map((row) =>
          row.map((cell) => {
            if (cell.value === CellValue.Bomb) {
              return {
                ...cell,
                state: CellState.Flagged,
              };
            }
            return cell;
          })
        );
        setHasWon(true);
      }

      setCells(newCells);
    };
  };

  // 右键点击格子时的行为
  const handleCellContext = (rowParam: number, colParam: number) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();

      if (!live) {
        return;
      }

      const currentCell = cells[rowParam][colParam];
      const currentCells = cells.slice();

      if (currentCell.state === CellState.Visible) {
        return;
      } else if (currentCell.state === CellState.Open) {
        currentCells[rowParam][colParam].state = CellState.Flagged;
        setCells(currentCells);
        setBombCounter(bombCounter - 1);
      } else if (currentCell.state === CellState.Flagged) {
        currentCells[rowParam][colParam].state = CellState.Open;
        setCells(currentCells);
        setBombCounter(bombCounter + 1);
      }
    };
  };

  // 点击笑脸时的行为
  const handleFaceClick = () => {
    setBombCounter(NUMBER_OF_BOMBS);
    setFace(Face.Smile);
    setTime(0);
    setLive(false);
    setHasLost(false);
    setHasWon(false);
    setCells(generateCells());
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          red={cell.red}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
        />
      ))
    );
  };

  // 显示所有炸弹
  const showAllBombs = () => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.Bomb) {
          return {
            ...cell,
            state: CellState.Visible,
          };
        }
        return cell;
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img">{face}</span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
