import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types"; // Import the SelectedUnit type

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
}

export default function ChaosDaemons({ setSelectedUnits }: Props) {
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
                name="Flamers"
                pointCost={[75, 130]}
                numberOfModels={[3, 6]}
                unitImageUrl="flamers.jpeg"
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
