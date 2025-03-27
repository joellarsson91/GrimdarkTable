import React, { useState, useEffect } from "react";
import "./Unitcard.css";

interface Props {
  unit: {
    name: string;
    pointCosts: {
      modelName: string;
      count: string;
      points: number;
    }[]; // Array of model counts and their respective points
  };
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    miscellaneous?: { name: string; quantity: number }[],
    rangedWeapons?: { name: string; quantity: number }[],
    meleeWeapons?: { name: string; quantity: number }[],
    enhancements?: { name: string; pointCost: number }[]
  ) => void;
}

const Unitcard: React.FC<Props> = ({ unit, addUnitToArmyList }) => {
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    const findImagePath = async () => {
      const path = `/images/${unit.name}.webp`; // All images are now .webp
      try {
        const response = await fetch(path, { method: "HEAD", cache: "no-store" });
        if (response.ok) {
          setImagePath(path); // Set the image path if the file exists
        } else {
          setImagePath(null); // No valid image found
        }
      } catch (error) {
        setImagePath(null); // Handle errors gracefully
      }
    };

    findImagePath();
  }, [unit.name]);

  return (
    <div className="unit-card">
      <h3 className="unit-name">{unit.name}</h3>
      <div className="unit-image">
        {imagePath ? (
          <img
            src={imagePath}
            alt={unit.name}
            style={{ width: "100%", height: "auto", maxWidth: "200px", maxHeight: "200px" }}
          />
        ) : (
          <p>Image missing</p> // Display "Image missing" if no image is found
        )}
      </div>
      <p className="unit-cost">
        Cost:
        <ul>
          {unit.pointCosts.map((cost, index) => (
            <li key={index}>
              {cost.count} models: {cost.points} pts
            </li>
          ))}
        </ul>
      </p>
      <button
        className="add-unit-button"
        onClick={() =>
          addUnitToArmyList(
            unit.name,
            "Troops", // Example category
            unit.pointCosts.map((cost) => cost.points), // Extract points
            unit.pointCosts.map((cost) => parseInt(cost.count.split("-")[0])) // Extract minimum model count
          )
        }
      >
        Add to Army
      </button>
    </div>
  );
};

export default Unitcard;