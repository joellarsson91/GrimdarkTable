import React, { useState, useEffect } from "react";
import { SelectedUnit } from "../types";

interface Props {
  selectedUnits: SelectedUnit[];
  updateUnitQuantity: (id: string, increment: number) => void;
  removeUnit: (id: string) => void;
  updateEnhancementQuantity: (
    id: string,
    enhancementIndex: number,
    increment: number
  ) => void;
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
  updateEnhancementQuantity,
}) => {
  const calculateTotalPointCost = (unit: SelectedUnit): number => {
    return unit.pointCost[unit.currentIndex];
  };

  const [showWargear, setShowWargear] = useState<string[]>([]);
  const [showEnhancements, setShowEnhancements] = useState<string[]>([]);
  const [rangedQuantities, setRangedQuantities] = useState<{
    [id: string]: number;
  }>({});
  const [meleeQuantities, setMeleeQuantities] = useState<{
    [id: string]: number;
  }>({});
  const [miscQuantities, setMiscQuantities] = useState<{
    [id: string]: number;
  }>({});
  const [enhancementQuantities, setEnhancementQuantities] = useState<{
    [id: string]: number;
  }>({});

  useEffect(() => {
    // Initialize showWargear and showEnhancements states with an empty array
    setShowWargear([]);
    setShowEnhancements([]);
  }, []);

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
      <h2 className="armylist-headers">Army List</h2>
      {Object.keys(groupedUnits).map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3 className="armylist-headers">{category}</h3>
          <ul>
            {groupedUnits[category].map((unit, index) => (
              <div className="army-list-item" key={unit.id}>
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
                      setShowWargear((prevShowWargear) =>
                        prevShowWargear.includes(unit.id)
                          ? prevShowWargear.filter((id) => id !== unit.id)
                          : [...prevShowWargear, unit.id]
                      );
                    }}
                  >
                    Wargear
                  </button>
                  {unit.enhancements.length > 0 && (
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => {
                        setShowEnhancements((prevShowEnhancements) =>
                          prevShowEnhancements.includes(unit.id)
                            ? prevShowEnhancements.filter(
                                (id) => id !== unit.id
                              )
                            : [...prevShowEnhancements, unit.id]
                        );
                      }}
                    >
                      Enhancements
                    </button>
                  )}
                </div>
                {showWargear.includes(unit.id) && (
                  <div>
                    {unit.miscellaneous.length > 0 && (
                      <div>
                        <h5 className="wargear-headers">Ranged Weapons</h5>
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
                    {unit.rangedWeapons.length > 0 && (
                      <div>
                        <h5 className="wargear-headers">Melee Weapons</h5>
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
                                  updateWargearQuantity(
                                    unit.id,
                                    wargearIndex,
                                    1
                                  );
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
                      </div>
                    )}
                    {unit.meleeWeapons.length > 0 && (
                      <div>
                        <h5 className="wargear-headers">Miscellaneous</h5>
                        {unit.meleeWeapons.map((weapon, index: number) => {
                          const wargearIndex = index + unit.meleeWeapons.length;
                          const id = `${unit.id}-melee-${wargearIndex}`;
                          const initialQuantity = weapon.quantity;
                          const currentQuantity =
                            meleeQuantities[id] !== undefined
                              ? meleeQuantities[id]
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
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {showEnhancements.includes(unit.id) && (
                  <div>
                    <h5>Enhancements</h5>
                    {unit.enhancements && unit.enhancements.length > 0 ? (
                      unit.enhancements.map((enhancement, index) => {
                        const enhancementIndex = index;
                        const id = `${unit.id}-enhancement-${enhancementIndex}`;
                        const initialQuantity = 0; // Assuming initial quantity is zero
                        const pointCost = enhancement.pointCost;
                        const currentQuantity =
                          enhancementQuantities[id] !== undefined
                            ? enhancementQuantities[id]
                            : initialQuantity;

                        return (
                          <label key={index}>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                updateEnhancementQuantity(
                                  unit.id,
                                  enhancementIndex,
                                  1
                                );
                                setEnhancementQuantities({
                                  ...enhancementQuantities,
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
                                  updateEnhancementQuantity(
                                    unit.id,
                                    enhancementIndex,
                                    -1
                                  );
                                  setEnhancementQuantities({
                                    ...enhancementQuantities,
                                    [id]: currentQuantity - 1,
                                  });
                                } else {
                                  setEnhancementQuantities({
                                    ...enhancementQuantities,
                                    [id]: 0,
                                  });
                                }
                              }}
                              disabled={currentQuantity <= 0}
                            >
                              -
                            </button>
                            {enhancement.name} ({pointCost} points)
                          </label>
                        );
                      })
                    ) : (
                      <p>No enhancements available for this unit.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ArmyList;
