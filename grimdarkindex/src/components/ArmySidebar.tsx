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
  expanded: boolean;
}

const calculateTotalPoints = (selectedUnits: SelectedUnit[]) => {
  return selectedUnits.reduce((totalPoints, unit) => {
    const unitPoints = unit.pointCost[unit.currentIndex];
    return totalPoints + unitPoints;
  }, 0);
};

const ArmySidebar: React.FC<Props> = ({
  selectedUnits,
  updateUnitQuantity,
  removeUnit,
  updateWargearQuantity,
  expanded,
}) => {
  const ArmySidebarClass = expanded ? "sidebar expanded" : "sidebar minimized";

  return (
    <div className={ArmySidebarClass}>
      <ArmyList
        selectedUnits={selectedUnits}
        updateUnitQuantity={updateUnitQuantity}
        removeUnit={removeUnit}
        updateWargearQuantity={updateWargearQuantity}
      />
      <div className="total-points">
        <p>Total: {calculateTotalPoints(selectedUnits)} points</p>
      </div>
    </div>
  );
};

export default ArmySidebar;
