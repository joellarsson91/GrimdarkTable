import React, { useState, useEffect } from "react";
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

  const [showWargear, setShowWargear] = useState<string[]>([]);
  const [rangedQuantities, setRangedQuantities] = useState<{
    [id: string]: number;
  }>({});
  const [meleeQuantities, setMeleeQuantities] = useState<{
    [id: string]: number;
  }>({});
  const [miscQuantities, setMiscQuantities] = useState<{
    [id: string]: number;
  }>({});

  useEffect(() => {
    // Initialize showWargear state with an empty array
    setShowWargear([]);
  }, []); // This empty array as the second argument means this effect runs once after mounting

  // Group units by category
  const groupedUnits: { [category: string]: SelectedUnit[] } = {};
  selectedUnits.forEach((unit) => {
    if (!groupedUnits[unit.category]) {
      groupedUnits[unit.category] = [];
    }
    groupedUnits[unit.category].push(unit);
  });

  return (
    <div style={{ maxHeight: "800px", overflowY: "auto" }}>
      <h2>Army List</h2>
      {Object.keys(groupedUnits).map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3>{category}</h3>
          <ul>
            {groupedUnits[category].map((unit, index) => (
              <li className="army-list-item" key={unit.id}>
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
                    onClick={() => {
                      // Toggle wargear visibility for the clicked unit
                      setShowWargear((prevShowWargear) => {
                        if (prevShowWargear.includes(unit.id)) {
                          return prevShowWargear.filter((id) => id !== unit.id);
                        } else {
                          return [...prevShowWargear, unit.id];
                        }
                      });
                    }}
                  >
                    Wargear
                  </button>
                </div>
                {showWargear.includes(unit.id) && (
                  <div>
                    {unit.miscellaneous && unit.miscellaneous.length > 0 && (
                      <div>
                        <h5>Ranged Weapons</h5>
                        {unit.miscellaneous.map((miscItem, index) => {
                          const wargearIndex =
                            index +
                            unit.meleeWeapons.length +
                            unit.rangedWeapons.length;
                          const id = `${unit.id}-misc-${wargearIndex}`;
                          const initialQuantity = miscItem.quantity;
                          const currentQuantity =
                            miscQuantities[id] !== undefined
                              ? miscQuantities[id]
                              : initialQuantity;

                          return (
                            <label key={index}>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                  updateWargearQuantity(
                                    unit.id,
                                    wargearIndex,
                                    1
                                  );
                                  setMiscQuantities({
                                    ...miscQuantities,
                                    [id]: currentQuantity + 1,
                                  });
                                }}
                              >
                                +
                              </button>
                              {currentQuantity}
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  if (currentQuantity > 0) {
                                    updateWargearQuantity(
                                      unit.id,
                                      wargearIndex,
                                      -1
                                    );
                                    setMiscQuantities({
                                      ...miscQuantities,
                                      [id]: currentQuantity - 1,
                                    });
                                  } else {
                                    setMiscQuantities({
                                      ...miscQuantities,
                                      [id]: 0,
                                    });
                                  }
                                }}
                                disabled={currentQuantity <= 0}
                              >
                                -
                              </button>
                              {miscItem.name}
                            </label>
                          );
                        })}
                      </div>
                    )}
                    <h5>Melee Weapons</h5>
                    {unit.rangedWeapons.map((weapon, index: number) => {
                      const wargearIndex = index;
                      const id = `${unit.id}-ranged-${wargearIndex}`;
                      const initialQuantity = weapon.quantity;
                      const currentQuantity =
                        rangedQuantities[id] !== undefined
                          ? rangedQuantities[id]
                          : initialQuantity;

                      return (
                        <label key={index}>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => {
                              updateWargearQuantity(unit.id, wargearIndex, 1);
                              setRangedQuantities({
                                ...rangedQuantities,
                                [id]: currentQuantity + 1,
                              });
                            }}
                          >
                            +
                          </button>
                          {currentQuantity}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (currentQuantity > 0) {
                                updateWargearQuantity(
                                  unit.id,
                                  wargearIndex,
                                  -1
                                );
                                setRangedQuantities({
                                  ...rangedQuantities,
                                  [id]: currentQuantity - 1,
                                });
                              } else {
                                setRangedQuantities({
                                  ...rangedQuantities,
                                  [id]: 0,
                                });
                              }
                            }}
                            disabled={currentQuantity <= 0}
                          >
                            -
                          </button>
                          {weapon.name}
                        </label>
                      );
                    })}
                    {unit.meleeWeapons.map((weapon, index: number) => {
                      const wargearIndex = index + unit.meleeWeapons.length;
                      const id = `${unit.id}-melee-${wargearIndex}`;
                      const initialQuantity = weapon.quantity;
                      const currentQuantity =
                        meleeQuantities[id] !== undefined
                          ? meleeQuantities[id]
                          : initialQuantity;

                      return (
                        <div>
                          {index === 0 && <h5>Miscellaneous</h5>}
                          <label key={index}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                updateWargearQuantity(unit.id, wargearIndex, 1);
                                setMeleeQuantities({
                                  ...meleeQuantities,
                                  [id]: currentQuantity + 1,
                                });
                              }}
                            >
                              +
                            </button>
                            {currentQuantity}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (currentQuantity > 0) {
                                  updateWargearQuantity(
                                    unit.id,
                                    wargearIndex,
                                    -1
                                  );
                                  setMeleeQuantities({
                                    ...meleeQuantities,
                                    [id]: currentQuantity - 1,
                                  });
                                } else {
                                  setMeleeQuantities({
                                    ...meleeQuantities,
                                    [id]: 0,
                                  });
                                }
                              }}
                              disabled={currentQuantity <= 0}
                            >
                              -
                            </button>
                            {weapon.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ArmyList;
