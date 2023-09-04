import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types"; // Import the SelectedUnit type

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
  addUnitToArmyList: (
    name: string,
    pointCost: number[],
    numberOfModels: number[]
  ) => void;
}

export default function AgentsOfTheImperium({
  setSelectedUnits,
  addUnitToArmyList,
}: Props) {
  return (
    <div>
      <div className="container text-center">
        <div className="row">
          <div className="col-2">
            <div>
              <Unitcard
                name="Flamers"
                pointCost={[75, 130]}
                numberOfModels={[3, 6]}
                unitImageUrl="flamers.jpeg"
                rangedWeapons={["Ranged Weapon 1", "Ranged Weapon 2"]}
                meleeWeapons={["Melee Weapon 1", "Melee Weapon 2"]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
