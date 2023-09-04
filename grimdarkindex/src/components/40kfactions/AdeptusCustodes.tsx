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
                name="Custodian Guard"
                pointCost={[180, 225, 405, 450]}
                numberOfModels={[4, 5, 9, 10]}
                unitImageUrl="custodianguard.webp"
                rangedWeapons={["Ranged Weapon 1", "Ranged Weapon 2"]}
                meleeWeapons={["Melee Weapon 1", "Melee Weapon 2"]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <Unitcard
              name="Custodian Warden"
              pointCost={[150, 300]}
              numberOfModels={[3, 6]}
              unitImageUrl="custodianwarden.jpeg"
              rangedWeapons={["Ranged Weapon 1", "Ranged Weapon 2"]}
              meleeWeapons={["Melee Weapon 1", "Melee Weapon 2"]}
              addUnitToArmyList={addUnitToArmyList}
            />
          </div>
          <div className="col-2">
            <Unitcard
              name="Prosecutor"
              pointCost={[40, 50, 60, 70, 80, 90, 100]}
              numberOfModels={[4, 5, 6, 7, 8, 9, 10]}
              unitImageUrl="prosecutor.jpeg"
              rangedWeapons={["Ranged Weapon 1", "Ranged Weapon 2"]}
              meleeWeapons={["Melee Weapon 1", "Melee Weapon 2"]}
              addUnitToArmyList={addUnitToArmyList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
