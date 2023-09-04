import React, { useState } from "react";
import { SelectedUnit } from "../types";

interface Props {
  selectedUnits: SelectedUnit[];
  updateUnitQuantity: (id: string, increment: number) => void;
  removeUnit: (id: string) => void;
  updateWargearQuantity: (
    id: string,
    wargearIndex: number,
    increment: number
  ) => void;
}

const ArmyList: React.FC<Props> = ({
  selectedUnits,
  updateUnitQuantity,
  removeUnit,
  updateWargearQuantity,
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
                className="btn btn-success btn-sm"
                onClick={() => updateUnitQuantity(unit.id, 1)}
              >
                +
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => updateUnitQuantity(unit.id, -1)}
              >
                -
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeUnit(unit.id)}
              >
                X
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowWargear(unit.id)}
              >
                Wargear
              </button>
            </div>
            {showWargear === unit.id && (
              <div>
                <h5>Ranged Weapons</h5>
                {unit.rangedWeapons.map((weapon, index) => (
                  <label key={index}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateWargearQuantity(unit.id, index, 1)}
                    >
                      +
                    </button>
                    {unit.wargearQuantities[index]}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateWargearQuantity(unit.id, index, -1)}
                      disabled={unit.wargearQuantities[index] <= 0}
                    >
                      -
                    </button>
                    {weapon}
                  </label>
                ))}

                <h5>Melee Weapons</h5>
                {unit.meleeWeapons.map((weapon, index) => (
                  <label key={index}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        updateWargearQuantity(
                          unit.id,
                          index + unit.rangedWeapons.length,
                          1
                        )
                      }
                    >
                      +
                    </button>
                    {unit.wargearQuantities[index + unit.rangedWeapons.length]}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        updateWargearQuantity(
                          unit.id,
                          index + unit.rangedWeapons.length,
                          -1
                        )
                      }
                      disabled={
                        unit.wargearQuantities[
                          index + unit.rangedWeapons.length
                        ] <= 0
                      }
                    >
                      -
                    </button>
                    {weapon}
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArmyList;
