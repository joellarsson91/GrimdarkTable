import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import ArmySidebar from "./components/ArmySidebar";
import Unitcard from "./components/units/Unitcard";
import { SelectedUnit } from "./types";
import { v4 as uuidv4 } from "uuid";
import factionsData from "./factions.json"; // Import factions.json dynamically

type Unit = {
  name: string;
  unitComposition: string;
  pointCosts: {
    models: {
      modelName: string;
      count: string;
    }[];
    points: number;
  }[]; // Array of model counts and their respective points
  wargearOptions?: string[]; // Add wargearOptions as an optional property
  rangedWeapons?: { name: string; quantity: number }[]; // Add rangedWeapons as an optional property
  meleeWeapons?: { name: string; quantity: number }[]; // Add meleeWeapons as an optional property
};

// Define the structure of a faction
type Faction = {
  faction: string;
  rules: string[];
  detachments: string[];
  datasheets: Unit[];
};

const factions: Faction[] = factionsData as Faction[];

function App() {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [sidebarVisible, setArmySidebarVisible] = useState(false);
  const [sidebarExpanded, setArmySidebarExpanded] = useState(true);
  const [visibleFactions, setVisibleFactions] = useState<string[]>([]);

  const toggleArmySidebar = () => {
    setArmySidebarExpanded(!sidebarExpanded);
  };

  const toggleArmySidebarVisibility = () => {
    setArmySidebarVisible(!sidebarVisible);
  };

  const addUnitToArmyList = (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons: { name: string; quantity: number }[] = [],
    meleeWeapons: { name: string; quantity: number }[] = [],
    miscellaneous: { name: string; quantity: number }[] = [],
    enhancements: { name: string; pointCost: number }[] = [],
    wargearOptions: string[] = []
  ) => {
    // Initialize all weapons with a quantity of 0
    const defaultRangedWeapons = rangedWeapons.map((weapon) => ({
      name: weapon.name,
      quantity: 0,
    }));
    const defaultMeleeWeapons = meleeWeapons.map((weapon) => ({
      name: weapon.name,
      quantity: 0,
    }));

    setSelectedUnits((prevSelectedUnits) => [
      ...prevSelectedUnits,
      {
        id: uuidv4(),
        name,
        category,
        pointCost,
        quantity: numberOfModels[0], // Add the minimum number of models
        numberOfModels: [...numberOfModels],
        currentIndex: 0,
        rangedWeapons: defaultRangedWeapons,
        meleeWeapons: defaultMeleeWeapons,
        miscellaneous,
        wargearQuantities: new Array(
          rangedWeapons.length + meleeWeapons.length
        ).fill(0),
        enhancementQuantities: new Array(enhancements.length).fill(0),
        enhancements,
        wargearOptions, // Include wargearOptions in the unit structure
      },
    ]);

    // Set sidebarVisible to true when adding the first unit
    setArmySidebarVisible(true);
  };

  const calculateTotalPoints = () => {
    return selectedUnits.reduce((totalPoints, unit) => {
      const unitPoints = unit.pointCost[unit.currentIndex];
      return totalPoints + unitPoints;
    }, 0);
  };

  const updateWargearQuantity = (
    id: string,
    weaponType: "ranged" | "melee",
    weaponIndex: number,
    increment: number
  ) => {
    setSelectedUnits((prevSelectedUnits) =>
      prevSelectedUnits.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              [weaponType]: unit[weaponType].map((weapon, index) =>
                index === weaponIndex
                  ? {
                      ...weapon,
                      quantity: Math.max(0, weapon.quantity + increment),
                    }
                  : weapon
              ),
            }
          : unit
      )
    );
  };

  return (
    <div>
      <Navbar
        visibleComponents={visibleFactions}
        setVisibleComponents={setVisibleFactions}
        sidebarVisible={sidebarVisible}
        sidebarExpanded={sidebarExpanded}
        toggleArmySidebar={toggleArmySidebar}
        toggleArmySidebarVisibility={toggleArmySidebarVisibility}
      />

      {sidebarVisible && (
        <ArmySidebar
          selectedUnits={selectedUnits}
          updateUnitQuantity={(id, increment) => {
            setSelectedUnits((prevSelectedUnits) =>
              prevSelectedUnits.map((unit) =>
                unit.id === id
                  ? {
                      ...unit,
                      currentIndex: Math.max(
                        0,
                        Math.min(
                          unit.numberOfModels.length - 1,
                          unit.currentIndex + increment
                        )
                      ),
                    }
                  : unit
              )
            );
          }}
          removeUnit={(id) => {
            setSelectedUnits((prevSelectedUnits) =>
              prevSelectedUnits.filter((unit) => unit.id !== id)
            );
          }}
          updateWargearQuantity={(id, wargearIndex, increment) => {
            setSelectedUnits((prevSelectedUnits) =>
              prevSelectedUnits.map((unit) =>
                unit.id === id
                  ? {
                      ...unit,
                      wargearQuantities: unit.wargearQuantities.map(
                        (quantity, index) =>
                          index === wargearIndex
                            ? Math.max(0, quantity + increment)
                            : quantity
                      ),
                    }
                  : unit
              )
            );
          }}
          updateEnhancementQuantity={(id, enhancementIndex, increment) => {
            setSelectedUnits((prevSelectedUnits) =>
              prevSelectedUnits.map((unit) =>
                unit.id === id
                  ? {
                      ...unit,
                      enhancementQuantities: unit.enhancementQuantities.map(
                        (quantity, index) =>
                          index === enhancementIndex
                            ? Math.max(0, quantity + increment)
                            : quantity
                      ),
                    }
                  : unit
              )
            );
          }}
          enhancementQuantities={selectedUnits.map(
            (unit) => unit.enhancementQuantities
          )}
          expanded={sidebarExpanded}
          toggleArmySidebar={toggleArmySidebar}
          toggleArmySidebarVisibility={toggleArmySidebarVisibility}
        />
      )}

      {visibleFactions.map((factionName) => (
        <div key={factionName}>
          {factions
            .filter((faction) => faction.faction === factionName)
            .map((faction) => (
              <div key={faction.faction}>
                <h2>{faction.faction}</h2>
                <div className="unit-card-container">
                  {faction.datasheets.map((unit) => (
                    <Unitcard
                      key={unit.name}
                      unit={{
                        name: unit.name,
                        pointCosts: unit.pointCosts.map((cost) => ({
                          models: cost.models.map((model) => ({
                            modelName: model.modelName || "Unknown Model", // Fallback for undefined modelName
                            count: model.count || "0", // Fallback for undefined count
                          })),
                          points: cost.points,
                        })), // Transform pointCosts to match the expected structure
                        rangedWeapons: unit.weapons?.rangedWeapons || [], // Pass ranged weapons
                        meleeWeapons: unit.weapons?.meleeWeapons || [], // Pass melee weapons
                        wargearOptions: unit.wargearOptions || [], // Pass wargearOptions if available
                      }}
                      addUnitToArmyList={addUnitToArmyList}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default App;
