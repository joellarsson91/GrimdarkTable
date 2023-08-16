import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types"; // Import the SelectedUnit type

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
}

export default function AgentsOfTheImperium({ setSelectedUnits }: Props) {
  const addUnitToArmyList = (unit: SelectedUnit) => {
    setSelectedUnits((prevSelectedUnits) => [...prevSelectedUnits, unit]);
  };

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
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
