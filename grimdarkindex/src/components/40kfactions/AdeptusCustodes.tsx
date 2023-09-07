import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types";
import unitCategories from "../../unitCategories";

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons?: { name: string; quantity: number }[],
    meleeWeapons?: { name: string; quantity: number }[]
  ) => void;
}

export default function AdeptusCustodes({
  setSelectedUnits,
  addUnitToArmyList,
}: Props) {
  return (
    <div>
      <div className="container text-center">
        <div className="row">
          {/* Unit 1 */}
          <div className="col-2">
            <div>
              <Unitcard
                name="Custodian Guard"
                category={unitCategories.Battleline}
                pointCost={[180, 225, 405, 450]}
                numberOfModels={[4, 5, 9, 10]}
                unitImageUrl="custodianguard.webp"
                rangedWeapons={[
                  { name: "Guardian Spear", quantity: 4 },
                  { name: "Sentinel Blade", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 4 },
                  { name: "Sentinel Blade", quantity: 0 },
                  { name: "Misericordia", quantity: 0 },
                ]}
                miscellaneous={[
                  { name: "Vexilla", quantity: 0 },
                  { name: "Praesidium Shield", quantity: 0 },
                  { name: "Misericordia", quantity: 0 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          {/* Unit 2 */}
          <div className="col-2">
            <div>
              <Unitcard
                name="Custodian Warden"
                category={unitCategories.OtherUnits}
                pointCost={[150, 300]}
                numberOfModels={[3, 6]}
                unitImageUrl="custodianwarden.jpeg"
                rangedWeapons={[
                  { name: "Guardian Spear", quantity: 3 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 3 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                miscellaneous={[{ name: "Vexilla", quantity: 0 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          {/* Unit 3 */}
          <div className="col-2">
            <div>
              <Unitcard
                name="Prosecutor"
                category={unitCategories.Battleline}
                pointCost={[40, 50, 60, 70, 80, 90, 100]}
                numberOfModels={[4, 5, 6, 7, 8, 9, 10]}
                unitImageUrl="prosecutor.jpeg"
                rangedWeapons={[{ name: "Boltgun", quantity: 4 }]}
                meleeWeapons={[{ name: "Close combat weapon", quantity: 4 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          {/* Unit 4 */}
          <div className="col-2">
            <div>
              <Unitcard
                name="Allarus Custodian"
                category={unitCategories.OtherUnits}
                pointCost={[130, 190, 325, 390]}
                numberOfModels={[2, 3, 5, 6]}
                unitImageUrl="allaruscustodian.jpeg"
                rangedWeapons={[
                  { name: "Balistus Grenade Launcher", quantity: 2 },
                  { name: "Guardian Spear", quantity: 2 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 2 },
                  { name: "Castellan Axe", quantity: 0 },
                  { name: "Misericordia", quantity: 0 },
                ]}
                miscellaneous={[{ name: "Vexilla", quantity: 0 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          {/* Unit 5 */}
          <div className="col-2">
            <div>
              <Unitcard
                name="Blade Champion"
                category={unitCategories.Characters}
                pointCost={[100]}
                numberOfModels={[1]}
                unitImageUrl="bladechampion.webp"
                meleeWeapons={[{ name: "Vaultswords", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
