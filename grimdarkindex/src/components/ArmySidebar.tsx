import React from "react";
import ArmyList from "./ArmyList";
import { SelectedUnit } from "../types";
import "./ArmySidebar.css"; // Import your CSS file for styling

interface Props {
  selectedUnits: SelectedUnit[];
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
  updateUnitQuantity: (id: string, increment: number) => void;
  removeUnit: (id: string) => void;
  updateWargearQuantity: (
    id: string,
    wargearIndex: number,
    increment: number,
    wargearType: "ranged" | "melee"
  ) => void;
  updateEnhancementQuantity: (
    id: string,
    enhancementIndex: number,
    increment: number
  ) => void;
  enhancementQuantities: number[];
  expanded: boolean;
  toggleArmySidebar: () => void;
  toggleArmySidebarVisibility: () => void;
  armySidebarTitle: string;
  detachmentTitle: string;
  detachmentEnhancements: { name: string; points: number; rules: string }[];
  warlordId: string | null;
  setWarlordId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const calculateTotalPoints = (
  selectedUnits: SelectedUnit[],
  detachmentEnhancements: { name: string; points: number; rules: string }[]
) => {
  return selectedUnits.reduce((totalPoints, unit) => {
    const unitPoints = unit.pointCost[unit.currentIndex];
    const enhancementPoints = unit.selectedEnhancement
      ? detachmentEnhancements.find(
          (enhancement) => enhancement.name === unit.selectedEnhancement
        )?.points || 0
      : 0;
    return totalPoints + unitPoints + enhancementPoints;
  }, 0);
};

const ArmySidebar: React.FC<Props> = ({
  selectedUnits,
  setSelectedUnits,
  updateUnitQuantity,
  removeUnit,
  updateWargearQuantity,
  updateEnhancementQuantity,
  enhancementQuantities,
  expanded,
  toggleArmySidebar,
  toggleArmySidebarVisibility,
  armySidebarTitle,
  detachmentTitle,
  detachmentEnhancements,
  warlordId,
  setWarlordId,
}) => {
  const ArmySidebarClass = expanded ? "sidebar expanded" : "sidebar minimized";

  return (
    <div className={ArmySidebarClass}>
      <div className="sidebar-button">
        <button
          className="material-symbols-outlined"
          onClick={toggleArmySidebarVisibility} // Hide the sidebar
          title="Hide Sidebar"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "24px", // Adjust the size of the icon
          }}
        >
          arrow_forward_ios
        </button>
      </div>

      <ArmyList
        selectedUnits={selectedUnits}
        setSelectedUnits={setSelectedUnits} // Pass the setter function
        updateUnitQuantity={updateUnitQuantity}
        removeUnit={removeUnit}
        updateWargearQuantity={(id, wargearIndex, increment, wargearType) => {
          if (wargearType === "ranged" || wargearType === "melee") {
            updateWargearQuantity(id, wargearIndex, increment, wargearType);
          } else {
            console.error(`Invalid wargearType: ${wargearType}`);
          }
        }}
        updateEnhancementQuantity={updateEnhancementQuantity}
        armySidebarTitle={armySidebarTitle}
        detachmentTitle={detachmentTitle}
        detachmentEnhancements={detachmentEnhancements} // Pass enhancements
        warlordId={warlordId}
        setWarlordId={setWarlordId}
      />

      <div className="total-points">
        <p>
          Total: {calculateTotalPoints(selectedUnits, detachmentEnhancements)}{" "}
          points
        </p>
      </div>
    </div>
  );
};

export default ArmySidebar;
