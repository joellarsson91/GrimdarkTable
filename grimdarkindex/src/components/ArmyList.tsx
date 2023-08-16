import React from "react";
import { SelectedUnit } from "../types";

interface Props {
  selectedUnits: SelectedUnit[];
  updateUnitQuantity: (id: string, newQuantity: number) => void;
  removeUnit: (id: string) => void;
}

const ArmyList: React.FC<Props> = ({
  selectedUnits,
  updateUnitQuantity,
  removeUnit,
}) => {
  const calculateTotalPointCost = (unit: SelectedUnit): number => {
    if (unit.pointCost.length === 1) {
      return unit.pointCost[unit.quantity] * unit.quantity;
    } else {
      let total = 0;
      for (let i = 0; i < unit.quantity; i++) {
        total += unit.pointCost[i] || unit.pointCost[unit.pointCost.length - 1];
      }
      return total;
    }
  };

  return (
    <div>
      <h2>Army List</h2>
      <ul>
        {selectedUnits.map((unit) => (
          <li key={unit.id} className="army-list-item">
            <div className="army-list-unit">
              <span>
                <div className="army-list-quantity">
                  {unit.quantity} x {unit.name} -{" "}
                  {calculateTotalPointCost(unit)}p
                </div>
              </span>
              <button
                className="btn btn-success"
                onClick={() => updateUnitQuantity(unit.id, unit.quantity + 1)}
              >
                +
              </button>
              <button
                className="btn btn-danger"
                onClick={() => updateUnitQuantity(unit.id, unit.quantity - 1)}
              >
                -
              </button>
              <button
                className="btn btn-danger"
                onClick={() => removeUnit(unit.id)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArmyList;
