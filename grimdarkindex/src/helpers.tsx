// helpers.ts (or any appropriate file name)

export function calculateUnitComposition(numberOfModels: number[]): string {
  let unitComposition = "";

  for (let index = 0; index < numberOfModels.length; index++) {
    const element = numberOfModels[index];
    if (index === 0) {
      unitComposition = element.toString();
    } else {
      if (element !== numberOfModels[index - 1] + 1) {
        unitComposition += ", " + element;
      } else if (element === numberOfModels[index - 1] + 1) {
        if (element + 1 !== numberOfModels[index + 1]) {
          unitComposition += " - " + element;
        }
      }
    }
  }

  return unitComposition;
}

export function formatPointCost(
  numberOfModels: number[],
  pointCost: number[]
): string {
  let pointsDisplayed = "";

  for (let index = 0; index < numberOfModels.length; index++) {
    const element = numberOfModels[index];
    if (index === 0) {
      pointsDisplayed = pointCost[0].toString() + "p";
    } else {
      if (element !== numberOfModels[index - 1] + 1) {
        pointsDisplayed += ", " + pointCost[index].toString() + "p";
      } else if (element === numberOfModels[index - 1] + 1) {
        if (element + 1 !== numberOfModels[index + 1]) {
          pointsDisplayed += " - " + pointCost[index].toString() + "p";
        }
      }
    }
  }

  return pointsDisplayed;
}
