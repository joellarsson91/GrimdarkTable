import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types"; // Import the SelectedUnit type

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
  addUnitToArmyList: (
    name: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons: { name: string; quantity: number }[], // Updated rangedWeapons
    meleeWeapons: { name: string; quantity: number }[] // Updated meleeWeapons
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
                rangedWeapons={[{ name: "Neural Shredder", quantity: 1 }]}
                meleeWeapons={[
                  { name: "Phase sword and poison blades", quantity: 1 },
                ]}
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
                  { name: "Arbites combat shotgun", quantity: 5 },
                  { name: "Arbites grenade launcher", quantity: 0 },
                  { name: "Arbites shotpistol", quantity: 5 },
                  { name: "Executioner shotgun", quantity: 0 },
                  { name: "Heavy stubber", quantity: 0 },
                  { name: "Webber", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Close combat weapon", quantity: 5 },
                  { name: "Excruciator maul", quantity: 0 },
                  { name: "Mechanical bite", quantity: 0 },
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
