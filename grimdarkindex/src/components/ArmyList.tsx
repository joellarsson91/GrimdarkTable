import React, { useState, useEffect } from "react";
import { SelectedUnit } from "../types";
import "./ArmyList.css"; // Import your CSS file for styling

interface Props {
  selectedUnits: SelectedUnit[];
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>; // Add this
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
  armySidebarTitle: string;
  detachmentTitle?: string;
  detachmentEnhancements: { name: string; points: number; rules: string }[]; // Add enhancements
  warlordId: string | null; // Add warlordId
  setWarlordId: React.Dispatch<React.SetStateAction<string | null>>; // Add setWarlordId
}

const ArmyList: React.FC<Props> = ({
  selectedUnits,
  setSelectedUnits,
  updateUnitQuantity,
  removeUnit,
  updateWargearQuantity,
  updateEnhancementQuantity,
  armySidebarTitle,
  detachmentTitle, // Use detachmentTitle prop
  warlordId,
  setWarlordId,
  detachmentEnhancements,
}) => {
  const calculateTotalPointCost = (unit: SelectedUnit): number => {
    return unit.pointCost[unit.currentIndex];
  };

  const calculateTotalPoints = (): number => {
    return selectedUnits.reduce((total, unit) => {
      const basePoints = unit.pointCost[unit.currentIndex];
      const enhancementPoints = unit.selectedEnhancement
        ? detachmentEnhancements.find(
            (enhancement) => enhancement.name === unit.selectedEnhancement
          )?.points || 0
        : 0;
      return total + basePoints + enhancementPoints;
    }, 0);
  };

  const [showWargear, setShowWargear] = useState<string[]>([]);
  const [showEnhancements, setShowEnhancements] = useState<string[]>([]);
  const [enhancementQuantities, setEnhancementQuantities] = useState<{
    [id: string]: number;
  }>({});
  const [selectedEnhancements, setSelectedEnhancements] = useState<{
    [enhancementName: string]: string;
  }>({});

  const handleWarlordSelection = (unitId: string) => {
    setWarlordId((prevWarlordId) => {
      const newWarlordId = prevWarlordId === unitId ? null : unitId;
      return newWarlordId;
    });
  };

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
                      {unit.pointCost[unit.currentIndex] +
                        (unit.selectedEnhancement
                          ? detachmentEnhancements.find(
                              (enhancement) =>
                                enhancement.name === unit.selectedEnhancement
                            )?.points || 0
                          : 0)}
                      p
                    </div>
                  </span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateUnitQuantity(unit.id, 1)} // Increment
                    disabled={
                      unit.currentIndex >= unit.numberOfModels.length - 1
                    } // Disable if at max
                  >
                    +
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => updateUnitQuantity(unit.id, -1)} // Decrement
                    disabled={unit.currentIndex <= 0} // Disable if at min
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
                  {unit.keywords.some(
                    (keyword) => keyword.toLowerCase() === "character"
                  ) &&
                    !unit.keywords.some(
                      (keyword) => keyword.toLowerCase() === "epic hero"
                    ) && (
                      <button
                        className="btn btn-secondary btn-sm"
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
                  {unit.keywords.some(
                    (keyword) => keyword.toLowerCase() === "character"
                  ) &&
                    (warlordId === null || warlordId === unit.id) && ( // Only show the checkbox if no Warlord is selected or this unit is the Warlord
                      <label style={{ marginLeft: "10px" }}>
                        <input
                          type="checkbox"
                          checked={warlordId === unit.id}
                          onChange={() => handleWarlordSelection(unit.id)}
                        />
                        WL
                      </label>
                    )}
                </div>
                {showWargear.includes(unit.id) && (
                  <div>
                    {/* Ranged Weapons */}
                    {unit.rangedWeapons.length > 0 && (
                      <h3 className="army-list-section-title">
                        Ranged Weapons
                      </h3>
                    )}
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
                          disabled={weapon.quantity >= 99} // Disable when quantity is 99 or more
                        >
                          +
                        </button>
                        <span className="weapon-quantity">
                          {weapon.quantity}
                        </span>
                        {/* Fixed width */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateWargearQuantity(unit.id, index, -1, "ranged")
                          }
                          disabled={weapon.quantity <= 0}
                        >
                          -
                        </button>
                        <span className="army-list-item-text">
                          {weapon.name}
                        </span>
                      </div>
                    ))}

                    {/* Melee Weapons */}
                    {unit.meleeWeapons.length > 0 && (
                      <h3 className="army-list-section-title">Melee Weapons</h3>
                    )}
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
                          disabled={weapon.quantity >= 99} // Disable when quantity is 99 or more
                        >
                          +
                        </button>
                        <span className="weapon-quantity">
                          {weapon.quantity}
                        </span>
                        {/* Fixed width */}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateWargearQuantity(unit.id, index, -1, "melee")
                          }
                          disabled={weapon.quantity <= 0}
                        >
                          -
                        </button>
                        <span className="army-list-item-text">
                          {weapon.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {showEnhancements.includes(unit.id) && (
                  <div>
                    <h5 className="army-list-section-title">Enhancements</h5>
                    {detachmentEnhancements.length > 0 ? (
                      detachmentEnhancements.map((enhancement, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`${unit.id}-enhancement-${index}`}
                            checked={
                              unit.selectedEnhancement === enhancement.name
                            }
                            onChange={() => {
                              const isSelected =
                                unit.selectedEnhancement === enhancement.name;

                              // Update the enhancement quantity
                              updateEnhancementQuantity(
                                unit.id,
                                index,
                                isSelected ? -1 : 1
                              );

                              // Update the selected enhancement for the unit
                              unit.selectedEnhancement = isSelected
                                ? null
                                : enhancement.name;

                              // Update the global selectedEnhancements state
                              setSelectedEnhancements((prev) => {
                                const updated = { ...prev };
                                if (isSelected) {
                                  // Remove the enhancement from the global state
                                  delete updated[enhancement.name];
                                } else {
                                  // Assign the enhancement to the current unit
                                  updated[enhancement.name] = unit.id;
                                }
                                return updated;
                              });

                              // Trigger a re-render by updating the selected units
                              setSelectedUnits([...selectedUnits]);
                            }}
                            disabled={Boolean(
                              (!!unit.selectedEnhancement &&
                                unit.selectedEnhancement !==
                                  enhancement.name) || // Disable if another enhancement is selected for this unit
                                (selectedEnhancements[enhancement.name] &&
                                  selectedEnhancements[enhancement.name] !==
                                    unit.id) // Disable if this enhancement is selected by another unit
                            )}
                          />
                          <label
                            htmlFor={`${unit.id}-enhancement-${index}`}
                            className="army-list-item-text"
                          >
                            {enhancement.name} ({enhancement.points} points)
                          </label>
                        </div>
                      ))
                    ) : (
                      <p>No enhancements available for this detachment.</p>
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
