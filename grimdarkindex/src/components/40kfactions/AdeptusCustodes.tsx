import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types"; // Import the SelectedUnit type

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
}

export default function AdeptusCustodes({ setSelectedUnits }: Props) {
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
                name="Custodian Guard"
                pointCost={[180, 225, 405, 450]}
                numberOfModels={[4, 5, 9, 10]}
                unitImageUrl="custodianguard.webp"
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
              addUnitToArmyList={addUnitToArmyList}
            />
          </div>
          <div className="col-2">
            <Unitcard
              name="Prosecutor"
              pointCost={[40, 50, 60, 70, 80, 90, 100]}
              numberOfModels={[4, 5, 6, 7, 8, 9, 10]}
              unitImageUrl="prosecutor.jpeg"
              addUnitToArmyList={addUnitToArmyList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
