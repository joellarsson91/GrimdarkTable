export interface SelectedUnit {
  id: string;
  name: string;
  pointCost: number[];
  quantity: number;
  numberOfModels: number[];
  currentIndex: number;
  rangedWeapons: string[];
  meleeWeapons: string[];
  wargearQuantities: number[]; // Add this line for wargear quantities
}
