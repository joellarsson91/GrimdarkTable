export interface SelectedUnit {
  id: string;
  name: string;
  pointCost: number[];
  quantity: number;
  numberOfModels: number[];
  currentIndex: number;
  rangedWeapons: { name: string; quantity: number }[];
  meleeWeapons: { name: string; quantity: number }[];
  wargearQuantities: number[]; // Add this line for wargear quantities
}
