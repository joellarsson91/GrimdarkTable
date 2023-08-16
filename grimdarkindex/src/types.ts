export interface SelectedUnit {
  id: string; // Add id field to uniquely identify units
  name: string;
  pointCost: number[];
  quantity: number;
  numberOfModels: number[];
  currentIndex: number;
}
