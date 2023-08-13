import React from "react";
let unitComposition: string;

interface Props {
  pointCost: number;
  numberOfModels: number[];
  name: string;
  unitImageUrl: string;
}

function Unitcard({ name, pointCost, numberOfModels, unitImageUrl }: Props) {
  for (let index = 0; index < numberOfModels.length; index++) {
    const element = numberOfModels[index];
    if (index == 0) {
      unitComposition = element.toString();
    } else {
      if (element !== numberOfModels[index - 1] + 1) {
        unitComposition += " , " + element;
      } else if (element == numberOfModels[index - 1] + 1) {
        if (element + 1 == numberOfModels[index + 1]) {
          continue;
        } else {
          unitComposition += " - " + element;
        }
      }
    }
  }

  return (
    <div className="card">
      <img
        src={"./images/" + unitImageUrl}
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <a href="#" className="btn btn-primary">
          {name}
        </a>
        <p className="card-text">{unitComposition}</p>
        <div className="card-footer text-body-secondary">{pointCost + "p"}</div>
      </div>
    </div>
  );
}

export default Unitcard;
