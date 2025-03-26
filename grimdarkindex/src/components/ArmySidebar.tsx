import React from "react";
import ArmyList from "./ArmyList";
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
  updateEnhancementQuantity: (
    id: string,
    enhancementIndex: number,
    increment: number
  ) => void;
  enhancementQuantities: number[][]; // Ensure this matches the type passed from App.tsx
  expanded: boolean;
  toggleArmySidebar: () => void;
  toggleArmySidebarVisibility: () => void;
}

const ArmySidebar: React.FC<Props> = ({
  selectedUnits,
  updateUnitQuantity,
  removeUnit,
  updateWargearQuantity,
  updateEnhancementQuantity,
  enhancementQuantities,
  expanded,
  toggleArmySidebar,
  toggleArmySidebarVisibility,
}) => {
  const ArmySidebarClass = expanded ? "sidebar expanded" : "sidebar minimized";

  const calculateTotalPoints = (selectedUnits: SelectedUnit[]) => {
    return selectedUnits.reduce((totalPoints, unit) => {
      const unitPoints = unit.pointCost[unit.currentIndex];
      const enhancementPoints = unit.enhancements.reduce(
        (enhancementTotal, enhancement, index) =>
          enhancementTotal +
          enhancement.pointCost * (unit.enhancementQuantities[index] || 0),
        0
      );
      return totalPoints + unitPoints + enhancementPoints;
    }, 0);
  };

  return (
    <div className={ArmySidebarClass}>
      <div className="sidebar-button">
        <button
          className="material-symbols-outlined"
          onClick={expanded ? toggleArmySidebar : toggleArmySidebarVisibility}
        >
          {expanded ? "check_box_outline_blank" : "dock_to_left"}
        </button>
      </div>
      <ArmyList
        selectedUnits={selectedUnits}
        updateUnitQuantity={updateUnitQuantity}
        removeUnit={removeUnit}
        updateWargearQuantity={updateWargearQuantity}
        updateEnhancementQuantity={updateEnhancementQuantity}
      />
      <div>
        {/* Render selected units and their enhancement quantities */}
        {selectedUnits.map((unit, index) => (
          <div key={unit.id}>
            <h3>{unit.name}</h3>
            <p>Enhancements:</p>
            {enhancementQuantities[index].map((quantity, enhancementIndex) => (
              <div key={enhancementIndex}>
                <span>
                  Enhancement {enhancementIndex + 1}: {quantity}
                </span>
                <button
                  onClick={() =>
                    updateEnhancementQuantity(unit.id, enhancementIndex, 1)
                  }
                >
                  +
                </button>
                <button
                  onClick={() =>
                    updateEnhancementQuantity(unit.id, enhancementIndex, -1)
                  }
                >
                  -
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="total-points">
        <p>Total: {calculateTotalPoints(selectedUnits)} points</p>
      </div>
    </div>
  );
};

export default ArmySidebar;
