import React, { useState, useEffect } from "react";
import "./Unitcard.css";

interface Props {
  unit: {
    name: string;
    pointCosts: {
      models: {
        modelName: string;
        count: string; // Number of models (e.g., "4" or "5")
      }[];
      points: number; // Points for the corresponding count
    }[]; // Array of model counts and their respective points
    wargearOptions?: string[]; // Optional wargear options
    rangedWeapons?: { name: string; quantity: number }[]; // Optional ranged weapons
    meleeWeapons?: { name: string; quantity: number }[]; // Optional melee weapons
    equipped?: { name: string; quantity: number; type: string }[]; // Optional equipped array
    keywords?: string[]; // Add the keywords property
  };
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons?: { name: string; quantity: number }[],
    meleeWeapons?: { name: string; quantity: number }[],
    miscellaneous?: { name: string; quantity: number }[],
    enhancements?: { name: string; pointCost: number }[],
    wargearOptions?: string[],
    equipped?: { name: string; quantity: number; type: string }[],
    keywords?: string[]
  ) => void;
}

const Unitcard: React.FC<Props> = ({ unit, addUnitToArmyList }) => {
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    const findImagePath = async () => {
      const path = `/images/${unit.name}.webp`; // All images are now .webp
      try {
        const response = await fetch(path, {
          method: "HEAD",
          cache: "no-store",
        });
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

  const handleAddUnit = () => {
    const numberOfModels: number[] = [];
    const pointCosts: number[] = [];

    unit.pointCosts.forEach((cost) => {
      cost.models.forEach((model) => {
        const count = model.count;
        if (count.includes("-")) {
          // Handle ranges like "6-10"
          const [min, max] = count.split("-").map(Number);
          for (let i = min; i <= max; i++) {
            numberOfModels.push(i);
            pointCosts.push(cost.points); // Assign the same point cost for all counts in the range
          }
        } else {
          // Handle single numbers like "5"
          numberOfModels.push(parseInt(count, 10));
          pointCosts.push(cost.points);
        }
      });
    });

    addUnitToArmyList(
      unit.name,
      "Troops", // Example category
      pointCosts, // Pass the expanded point costs
      numberOfModels, // Pass the expanded number of models
      unit.rangedWeapons || [],
      unit.meleeWeapons || [],
      [], // Miscellaneous
      [], // Enhancements
      unit.wargearOptions || [],
      unit.equipped || [],
      unit.keywords || [] // Pass keywords
    );
  };

  return (
    <div className="unit-card">
      <h3 className="unit-name">{unit.name}</h3>
      <div className="unit-image">
        {imagePath ? (
          <img
            src={imagePath}
            alt={unit.name}
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "200px",
              maxHeight: "200px",
            }}
          />
        ) : (
          <p>Image missing</p> // Display "Image missing" if no image is found
        )}
      </div>
      <p className="unit-cost">
        <strong>Cost:</strong>
        <ul>
          {unit.pointCosts
            .sort((a, b) => a.points - b.points) // Sort by points (lowest to highest)
            .map((cost, index) => (
              <li key={index}>
                {cost.models
                  .map((model) => `${model.count} ${model.modelName}`)
                  .join(" & ")}
                : {cost.points} pts
              </li>
            ))}
        </ul>
      </p>
      <button className="add-unit-button" onClick={handleAddUnit}>
        Add to Army
      </button>
    </div>
  );
};

export default Unitcard;
