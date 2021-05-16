import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import Button from "../Button";
import { Cell, CellState, CellValue, Face } from "../../types";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(10);

  useEffect(() => {
    const handleMouseDown = () => {
      setFace(Face.Oh);
    };
    const handleMouseUp = () => {
      setFace(Face.Smile);
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

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

  const handleCellClick = (rowParam: number, colParam: number) => {
    return () => {
      if (!live) {
        setLive(true);
      }

      const currentCell = cells[rowParam][colParam];
      let newCells = cells.slice();

      if ([CellState.Flagged, CellState.Visible].includes(currentCell.state)) {
        return;
      }

      if (currentCell.state === CellState.Flagged) {
        return;
      }

      if (currentCell.value === CellValue.Bomb) {
        // 爆炸
      } else if (currentCell.value === CellValue.None) {
        newCells = openMultipleCells(newCells, rowParam, colParam);
        setCells(newCells);
      } else {
        newCells[rowParam][colParam].state = CellState.Visible;
        setCells(newCells);
      }
    };
  };

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

  const handleFaceClick = () => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
        />
      ))
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
