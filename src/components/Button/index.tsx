import React from "react";
import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  state: CellState;
  value: CellValue;
  row: number;
  col: number;
}

const Button: React.FC<ButtonProps> = ({ state, value, row, col }) => {
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
      } value-${value}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
