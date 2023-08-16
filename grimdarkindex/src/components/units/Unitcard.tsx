import React, { useState } from "react";
import { SelectedUnit } from "../../types";
import { v4 as uuidv4 } from "uuid"; // Import the uuidv4 function

interface Props {
  pointCost: number[];
  numberOfModels: number[];
  name: string;
  unitImageUrl: string;
  addUnitToArmyList: (unit: SelectedUnit) => void;
}

function calculateUnitComposition(numberOfModels: number[]): string {
  let unitComposition = "";

  for (let index = 0; index < numberOfModels.length; index++) {
    const element = numberOfModels[index];
    if (index === 0) {
      unitComposition = element.toString();
    } else {
      if (element !== numberOfModels[index - 1] + 1) {
        unitComposition += ", " + element;
      } else if (element === numberOfModels[index - 1] + 1) {
        if (element + 1 !== numberOfModels[index + 1]) {
          unitComposition += " - " + element;
        }
      }
    }
  }

  return unitComposition;
}

function Unitcard({
  name,
  pointCost,
  numberOfModels,
  unitImageUrl,
  addUnitToArmyList,
}: Props) {
  const handleAddToArmyList = () => {
    const newUnit: SelectedUnit = {
      id: uuidv4(),
      name,
      pointCost,
      quantity: numberOfModels[0],
      numberOfModels: [...numberOfModels],
      currentIndex: 0,
    };
    addUnitToArmyList(newUnit);
  };

  function formatPointCost(
    numberOfModels: number[],
    pointCost: number[]
  ): string {
    let pointsDisplayed = "";

    for (let index = 0; index < numberOfModels.length; index++) {
      const element = numberOfModels[index];
      if (index === 0) {
        pointsDisplayed = pointCost[0].toString() + "p";
      } else {
        if (element !== numberOfModels[index - 1] + 1) {
          pointsDisplayed += ", " + pointCost[index].toString() + "p";
        } else if (element === numberOfModels[index - 1] + 1) {
          if (element + 1 !== numberOfModels[index + 1]) {
            pointsDisplayed += " - " + pointCost[index].toString() + "p";
          }
        }
      }
    }
    return pointsDisplayed;
  }

  const unitComposition = calculateUnitComposition(numberOfModels);

  return (
    <div className="card">
      <h5 className="card-title">{name}</h5>
      <img
        src={"./images/" + unitImageUrl}
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <div>
          <button className="btn btn-success" onClick={handleAddToArmyList}>
            +
          </button>
        </div>
        <p className="card-text">{unitComposition}</p>
        <div className="card-footer text-body-secondary">
          {formatPointCost(numberOfModels, pointCost)}
        </div>
      </div>
    </div>
  );
}

export default Unitcard;
