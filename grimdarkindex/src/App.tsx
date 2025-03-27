import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import ArmySidebar from "./components/ArmySidebar";
import Unitcard from "./components/units/Unitcard";
import { SelectedUnit } from "./types";
import { v4 as uuidv4 } from "uuid";
import factionsData from "./factions.json"; // Import factions.json dynamically

// Define the structure of a unit
type Unit = {
  name: string;
  unitComposition: string;
  pointCosts: {
    modelName: string;
    count: string;
    points: number;
  }[]; // Array of model counts and their respective points
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
    miscellaneous: { name: string; quantity: number }[] = [],
    rangedWeapons: { name: string; quantity: number }[] = [],
    meleeWeapons: { name: string; quantity: number }[] = [],
    enhancements: { name: string; pointCost: number }[] = []
  ) => {
    setSelectedUnits((prevSelectedUnits) => [
      ...prevSelectedUnits,
      {
        id: uuidv4(),
        name,
        category,
        pointCost,
        quantity: numberOfModels[0],
        numberOfModels: [...numberOfModels],
        currentIndex: 0,
        rangedWeapons,
        meleeWeapons,
        miscellaneous,
        wargearQuantities: new Array(
          rangedWeapons.length + meleeWeapons.length
        ).fill(0),
        enhancementQuantities: new Array(enhancements.length).fill(0),
        enhancements,
      },
    ]);

    // Set sidebarVisible to true when adding the first unit
    if (selectedUnits.length === 0) {
      setArmySidebarVisible(true);
    }
  };

  const calculateTotalPoints = () => {
    return selectedUnits.reduce((totalPoints, unit) => {
      const unitPoints = unit.pointCost[unit.currentIndex];
      return totalPoints + unitPoints;
    }, 0);
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
                        pointCosts: unit.pointCosts || [], // Ensure pointCosts is valid
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
