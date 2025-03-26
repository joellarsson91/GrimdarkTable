import React from "react";
import "./Unitcard.css";

interface Props {
  unit: {
    name: string;
    unitComposition: string;
    pointCost: number[]; // Assuming the cost is an array of numbers
  };
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    miscellaneous?: { name: string; quantity: number }[],
    rangedWeapons?: { name: string; quantity: number }[],
    meleeWeapons?: { name: string; quantity: number }[],
    enhancements?: { name: string; pointCost: number }[]
  ) => void;
}

const Unitcard: React.FC<Props> = ({ unit, addUnitToArmyList }) => {
  return (
    <div className="unit-card">
      <h3 className="unit-name">{unit.name}</h3>
      <p className="unit-composition">{unit.unitComposition}</p>
      <p className="unit-cost">
        Cost: {unit.pointCost.length > 0 ? `${unit.pointCost[0]} pts` : "N/A"}
      </p>
      <button
        className="add-unit-button"
        onClick={() =>
          addUnitToArmyList(
            unit.name,
            "Troops", // Example category
            unit.pointCost,
            [5] // Example number of models
          )
        }
      >
        Add to Army
      </button>
    </div>
  );
};

export default Unitcard;
