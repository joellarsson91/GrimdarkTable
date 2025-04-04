import React, { useState, useEffect } from "react";
import { SelectedUnit } from "../types";
import "./ArmyList.css"; // Import your CSS file for styling

interface Props {
  selectedUnits: SelectedUnit[];
  updateUnitQuantity: (id: string, increment: number) => void;
  removeUnit: (id: string) => void;
  updateWargearQuantity: (
    id: string,
    wargearIndex: number,
    increment: number,
    wargearType: string
  ) => void;
  updateEnhancementQuantity: (
    id: string,
    enhancementIndex: number,
    increment: number
  ) => void;
  armySidebarTitle: string; // Prop for the army title
  detachmentTitle?: string; // Add detachmentTitle as a prop
}

const ArmyList: React.FC<Props> = ({
  selectedUnits,
  updateUnitQuantity,
  removeUnit,
  updateWargearQuantity,
  updateEnhancementQuantity,
  armySidebarTitle,
  detachmentTitle, // Use detachmentTitle prop
}) => {
  console.log("ArmyList.tsx - detachmentTitle:", detachmentTitle);

  const calculateTotalPointCost = (unit: SelectedUnit): number => {
    return unit.pointCost[unit.currentIndex];
  };

  const [showWargear, setShowWargear] = useState<string[]>([]);
  const [showEnhancements, setShowEnhancements] = useState<string[]>([]);
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

  const toggleWargear = (unitId: string) => {
    setShowWargear((prevShowWargear) =>
      prevShowWargear.includes(unitId)
        ? prevShowWargear.filter((id) => id !== unitId)
        : [...prevShowWargear, unitId]
    );
  };

  return (
    <div className="army-list-container">
      <h2 className="armylist-title">{armySidebarTitle || "Army List"}</h2>
      {detachmentTitle && (
        <p className="armylist-detachment">{detachmentTitle}</p>
      )}
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
                    onClick={() => toggleWargear(unit.id)}
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
                    {/* Ranged Weapons */}
                    {unit.rangedWeapons.length > 0 && <h3>Ranged Weapons</h3>}
                    {unit.rangedWeapons.map((weapon, index) => (
                      <div
                        key={index}
                        className="weapon-item"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            updateWargearQuantity(unit.id, index, 1, "ranged")
                          }
                        >
                          +
                        </button>
                        <span style={{ margin: "0 8px" }}>{weapon.quantity}</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateWargearQuantity(unit.id, index, -1, "ranged")
                          }
                          disabled={weapon.quantity <= 0}
                        >
                          -
                        </button>
                        <span style={{ marginLeft: "8px" }}>{weapon.name}</span>
                      </div>
                    ))}

                    {/* Melee Weapons */}
                    {unit.meleeWeapons.length > 0 && <h3>Melee Weapons</h3>}
                    {unit.meleeWeapons.map((weapon, index) => (
                      <div
                        key={index}
                        className="weapon-item"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            updateWargearQuantity(unit.id, index, 1, "melee")
                          }
                        >
                          +
                        </button>
                        <span style={{ margin: "0 8px" }}>{weapon.quantity}</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateWargearQuantity(unit.id, index, -1, "melee")
                          }
                          disabled={weapon.quantity <= 0}
                        >
                          -
                        </button>
                        <span style={{ marginLeft: "8px" }}>{weapon.name}</span>
                      </div>
                    ))}
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
                                setEnhancementQuantities((prevQuantities) => ({
                                  ...prevQuantities,
                                  [id]: (prevQuantities[id] || 0) + 1,
                                }));
                              }}
                            >
                              +
                            </button>
                            {currentQuantity}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                if (enhancementQuantities[id] > 0) {
                                  updateEnhancementQuantity(
                                    unit.id,
                                    enhancementIndex,
                                    -1
                                  );
                                  setEnhancementQuantities(
                                    (prevQuantities) => ({
                                      ...prevQuantities,
                                      [id]: prevQuantities[id] - 1,
                                    })
                                  );
                                }
                              }}
                              disabled={enhancementQuantities[id] <= 0}
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
