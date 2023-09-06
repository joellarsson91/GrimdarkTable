import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types";

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
  addUnitToArmyList: (
    name: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons: { name: string; quantity: number }[],
    meleeWeapons: { name: string; quantity: number }[]
  ) => void;
}

export default function ChaosDaemons({
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
                rangedWeapons={[
                  { name: "Ranged Weapon 1", quantity: 1 },
                  { name: "Ranged Weapon 2", quantity: 1 },
                ]}
                meleeWeapons={[
                  { name: "Melee Weapon 1", quantity: 1 },
                  { name: "Melee Weapon 2", quantity: 1 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
