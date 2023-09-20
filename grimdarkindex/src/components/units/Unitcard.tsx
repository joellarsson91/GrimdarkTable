// Unitcard.tsx
import React from "react";
import { calculateUnitComposition, formatPointCost } from "../../helpers";

interface Props {
  name: string;
  category: string;
  pointCost: number[];
  numberOfModels: number[];
  unitImageUrl: string;
  rangedWeapons?: { name: string; quantity: number }[];
  meleeWeapons?: { name: string; quantity: number }[];
  miscellaneous?: { name: string; quantity: number }[];
  enhancements?: { name: string; pointCost: number }[]; // Add enhancements
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons?: { name: string; quantity: number }[],
    meleeWeapons?: { name: string; quantity: number }[],
    miscellaneous?: { name: string; quantity: number }[],
    enhancements?: { name: string; pointCost: number }[] // Pass enhancements to addUnitToArmyList
  ) => void;
}

const Unitcard: React.FC<Props> = ({
  name,
  category,
  pointCost,
  numberOfModels,
  unitImageUrl,
  rangedWeapons,
  meleeWeapons,
  miscellaneous,
  enhancements,
  addUnitToArmyList,
}) => {
  const handleAddToArmyList = () => {
    addUnitToArmyList(
      name,
      category,
      pointCost,
      numberOfModels,
      rangedWeapons,
      meleeWeapons,
      miscellaneous,
      enhancements
    );
  };

  // Use the calculateUnitComposition function to display the number of models
  const unitComposition = calculateUnitComposition(numberOfModels);
  const pointPerUnitComposition = formatPointCost(numberOfModels, pointCost);

  return (
    <div className="unit-card col-8">
      <div className="unit-card-content">
        <div className="rounded-border-gradient">
          <img
            src={"./images/" + unitImageUrl}
            alt={name}
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <h6>Point cost: </h6>
            <p>{pointPerUnitComposition}</p>
            <h6>Unit Composition: </h6>
            <p>{unitComposition}</p> {/* Display unit composition */}
          </div>
          <button className="btn btn-primary" onClick={handleAddToArmyList}>
            Add to Army List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unitcard;
