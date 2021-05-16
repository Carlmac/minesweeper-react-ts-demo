import React from "react";
import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  state: CellState;
  value: CellValue;
  red?: boolean;
  row: number;
  col: number;

  onClick(rowParam: number, colParam: number): (...args: any[]) => void;

  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({
  state,
  value,
  red,
  row,
  col,
  onClick,
  onContext,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.Visible) {
      if (value === CellValue.Bomb) {
        return <span role="img">💣</span>;
      } else if (value === CellValue.None) {
        return null;
      }
      return <span>{value}</span>;
    } else if (state === CellState.Flagged) {
      return <span role="img">🚩</span>;
    }
    return null;
  };

  return (
    <div
      className={`Button ${
        state === CellState.Visible ? "visible" : ""
      } value-${value} ${red ? "red" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
