// types.ts

// ...

export interface SelectedUnit {
  id: string;
  name: string;
  category: string;
  pointCost: number[];
  quantity: number;
  numberOfModels: number[];
  currentIndex: number;
  rangedWeapons: { name: string; quantity: number }[];
  meleeWeapons: { name: string; quantity: number }[];
  miscellaneous: { name: string; quantity: number }[]; // Add the 'miscellaneous' property
  wargearQuantities: number[];
  enhancements?: { name: string; pointCost: number }[];
  enhancmentQuantities: number[];
}
