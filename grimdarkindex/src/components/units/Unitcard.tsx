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
    wargearOptions?: string[]; // Add wargearOptions as an optional property
    rangedWeapons?: { name: string; quantity: number }[]; // Add rangedWeapons as an optional property
    meleeWeapons?: { name: string; quantity: number }[]; // Add meleeWeapons as an optional property
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
    wargearOptions?: string[] // Add wargearOptions as an optional parameter
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
      <button
        className="add-unit-button"
        onClick={() =>
          addUnitToArmyList(
            unit.name,
            "Troops", // Example category
            unit.pointCosts.map((cost) => cost.points), // Extract points
            unit.pointCosts.map((cost) =>
              cost.models.reduce(
                (total, model) => total + parseInt(model.count),
                0
              )
            ), // Extract total model count
            unit.rangedWeapons?.map((weapon) => ({
              name: weapon.name,
              quantity: weapon.quantity, // Preserve the quantity property
            })) || [], // Transform rangedWeapons to include quantity
            unit.meleeWeapons?.map((weapon) => ({
              name: weapon.name,
              quantity: weapon.quantity, // Preserve the quantity property
            })) || [], // Transform meleeWeapons to include quantity
            [], // Default miscellaneous
            [], // Default enhancements
            unit.wargearOptions || [] // Pass wargear options if available
          )
        }
      >
        Add to Army
      </button>
    </div>
  );
};

export default Unitcard;
