import React from "react";
import Unitcard from "../units/Unitcard";
export default function AdeptusCustodes() {
  return (
    <div>
      <div className="container text-center">
        <div className="row">
          <div className="col-2">
            <div>
              <Unitcard
                name="Custodian Guard"
                pointCost={45}
                numberOfModels={[4, 5, 9, 10]}
                unitImageUrl="custodianguard.webp"
              />
            </div>
          </div>
          <div className="col-2">
            <Unitcard
              name="Custodian Warden"
              pointCost={50}
              numberOfModels={[3, 6]}
              unitImageUrl="custodianwarden.jpeg"
            />
          </div>
          <div className="col-2">
            <Unitcard
              name="Prosecutor"
              pointCost={10}
              numberOfModels={[4, 5, 6, 7, 8, 9, 10]}
              unitImageUrl="prosecutor.jpeg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
