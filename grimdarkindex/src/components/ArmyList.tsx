import React, { useState } from "react";
import { SelectedUnit } from "../types";

interface Props {
  selectedUnits: SelectedUnit[];
  updateUnitQuantity: (id: string, increment: number) => void;
  removeUnit: (id: string) => void;
}

const ArmyList: React.FC<Props> = ({
  selectedUnits,
  updateUnitQuantity,
  removeUnit,
}) => {
  const calculateTotalPointCost = (unit: SelectedUnit): number => {
    return unit.pointCost[unit.currentIndex];
  };

  const [showWargear, setShowWargear] = useState<null | string>(null);

  return (
    <div>
      <h2>Army List</h2>
      <ul>
        {selectedUnits.map((unit) => (
          <li key={unit.id} className="army-list-item">
            <div className="army-list-unit">
              <span>
                <div className="army-list-quantity">
                  {unit.numberOfModels[unit.currentIndex]} x {unit.name} -{" "}
                  {calculateTotalPointCost(unit)}p
                </div>
              </span>
              <button
                className="btn btn-success"
                onClick={() => updateUnitQuantity(unit.id, 1)}
              >
                +
              </button>
              <button
                className="btn btn-danger"
                onClick={() => updateUnitQuantity(unit.id, -1)}
              >
                -
              </button>
              <button
                className="btn btn-danger"
                onClick={() => removeUnit(unit.id)}
              >
                X
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowWargear(unit.id)}
              >
                Wargear
              </button>
            </div>
            {showWargear === unit.id && (
              <div>
                <h3>Wargear</h3>
                <ul>
                  {unit.rangedWeapons.map((weapon, index) => (
                    <li key={index}>
                      <label>
                        <input type="checkbox" defaultChecked={index === 0} />
                        {weapon}
                      </label>
                    </li>
                  ))}
                  {unit.meleeWeapons.map((weapon, index) => (
                    <li key={index}>
                      <label>
                        <input type="checkbox" defaultChecked={index === 0} />
                        {weapon}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArmyList;
