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
                name="Callidus Assassin"
                pointCost={[115]}
                numberOfModels={[1]}
                unitImageUrl="callidusassassin.jpeg"
                rangedWeapons={["Ranged Weapon 1", "Ranged Weapon 2"]}
                meleeWeapons={["Melee Weapon 1", "Melee Weapon 2"]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Exaction Squad"
                pointCost={[35, 75]}
                numberOfModels={[5, 11]}
                unitImageUrl="exactionsquad.webp"
                rangedWeapons={[
                  "Arbites combat shotgun",
                  "Arbites grenade launcher - frag",
                  "Arbites grenade launcher - krak",
                  "Arbites shotpistol",
                  "Executioner shotgun",
                  "Heavy stubber",
                  "Webber",
                ]}
                meleeWeapons={[
                  "Close combat weapon",
                  "Excruciator maul",
                  "Mechanical bite",
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
