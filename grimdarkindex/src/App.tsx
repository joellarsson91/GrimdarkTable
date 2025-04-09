import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import ArmySidebar from "./components/ArmySidebar";
import Unitcard from "./components/units/Unitcard";
import ArmyList from "./components/ArmyList"; // Import ArmyList component
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
  wargearOptions?: string[]; // Optional wargear options
  weapons?: {
    rangedWeapons?: { name: string; quantity: number }[];
    meleeWeapons?: { name: string; quantity: number }[];
  }; // Optional weapons property
  equipped?: { name: string; quantity: number; type: string }[]; // Add equipped property
  keywords?: {
    keywords: string[]; // Add the keywords array inside the keywords object
  }; // Optional keywords property
};

type Faction = {
  faction: string;
  armyRules: { name: string; rules: string }[]; // Replace 'rules' with 'armyRules'
  detachments: {
    name: string;
    detachmentRules: { rule: string }[];
    enhancements: { name: string; points: number; rules: string }[];
    stratagems: { name: string; description: string }[];
  }[];
  datasheets: Unit[];
};

const factions: Faction[] = (factionsData as any).map((faction: any) => ({
  ...faction,
  rules: faction.rules || [], // Add a default empty array for 'rules'
}));

function App() {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarExpanded, setArmySidebarExpanded] = useState(true);
  const [visibleFactions, setVisibleFactions] = useState<string[]>([]);
  const [armySidebarTitle, setArmySidebarTitle] = useState<string>("");
  const [selectedDetachment, setSelectedDetachment] = useState<string>(""); // Add selectedDetachment state
  const [detachmentTitle, setDetachmentTitle] = useState<string>(""); // New state for detachment title
  const [warlordId, setWarlordId] = useState<string | null>(null);
  const [armyCreated, setArmyCreated] = useState<boolean>(false); // Add armyCreated state

  useEffect(() => {}, [warlordId]);

  const updateSelectedDetachment: React.Dispatch<
    React.SetStateAction<string>
  > = (value) => {
    if (typeof value === "function") {
      setSelectedDetachment((prevState) => {
        const newValue = value(prevState);
        return newValue;
      });
    } else {
      setSelectedDetachment(value);
    }
  };

  const toggleArmySidebar = () => {
    setArmySidebarExpanded(!sidebarExpanded);
  };

  const toggleArmySidebarVisibility = () => {
    setSidebarVisible((prevVisible) => !prevVisible);
  };

  // Function to clear the army list
  const clearArmyList = () => {
    setSelectedUnits([]);
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
    wargearOptions: string[] = [],
    equipped: { name: string; quantity: number; type: string }[] = [],
    keywords: string[] = [] // Add keywords as a parameter
  ) => {
    const modelCount = numberOfModels[0];

    const defaultRangedWeapons = rangedWeapons.map((weapon) => {
      const equippedWeapon = equipped.find(
        (eq) =>
          eq.name.toLowerCase().trim() === weapon.name.toLowerCase().trim() &&
          eq.type === "ranged"
      );
      return {
        ...weapon,
        quantity: equippedWeapon ? equippedWeapon.quantity * modelCount : 0,
      };
    });

    const defaultMeleeWeapons = meleeWeapons.map((weapon) => {
      const equippedWeapon = equipped.find(
        (eq) =>
          eq.name.toLowerCase().trim() === weapon.name.toLowerCase().trim() &&
          eq.type === "melee"
      );
      return {
        ...weapon,
        quantity: equippedWeapon ? equippedWeapon.quantity * modelCount : 0,
      };
    });

    setSelectedUnits((prevSelectedUnits) => [
      ...prevSelectedUnits,
      {
        id: uuidv4(),
        name,
        category,
        pointCost,
        quantity: modelCount,
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
        wargearOptions,
        keywords, // Include keywords here
      },
    ]);
  };

  const updateWargearQuantity = (
    id: string,
    wargearIndex: number,
    increment: number,
    wargearType: "ranged" | "melee" // Strict type
  ) => {
    console.log("updateWargearQuantity called with:", {
      id,
      wargearType,
      wargearIndex,
      increment,
    });

    setSelectedUnits((prevSelectedUnits) => {
      const updatedUnits = prevSelectedUnits.map((unit) => {
        if (unit.id === id) {
          const updatedWeapons =
            wargearType === "ranged"
              ? unit.rangedWeapons.map((weapon, index) =>
                  index === wargearIndex
                    ? {
                        ...weapon,
                        quantity: Math.max(0, weapon.quantity + increment), // Remove upper limit
                      }
                    : weapon
                )
              : unit.meleeWeapons.map((weapon, index) =>
                  index === wargearIndex
                    ? {
                        ...weapon,
                        quantity: Math.max(0, weapon.quantity + increment), // Remove upper limit
                      }
                    : weapon
                );

          return {
            ...unit,
            [wargearType === "ranged" ? "rangedWeapons" : "meleeWeapons"]:
              updatedWeapons,
          };
        }
        return unit;
      });

      return updatedUnits;
    });
  };

  const updateUnitQuantity = (id: string, increment: number) => {
    setSelectedUnits((prevSelectedUnits) =>
      prevSelectedUnits.map((unit) => {
        if (unit.id === id) {
          const newIndex = Math.max(
            0,
            Math.min(
              unit.numberOfModels.length - 1,
              unit.currentIndex + increment
            )
          );

          return {
            ...unit,
            currentIndex: newIndex,
            quantity: unit.numberOfModels[newIndex], // Update quantity based on new index
          };
        }
        return unit;
      })
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
        setArmySidebarTitle={setArmySidebarTitle}
        setDetachmentTitle={setDetachmentTitle}
        clearArmyList={clearArmyList}
        selectedUnits={selectedUnits}
        setSelectedDetachment={setSelectedDetachment}
        detachmentTitle={detachmentTitle}
        warlordId={warlordId} // Pass warlordId here
        armyCreated={armyCreated} // Pass armyCreated state
        setArmyCreated={setArmyCreated} // Pass setArmyCreated function
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
          updateWargearQuantity={(id, wargearIndex, increment, wargearType) => {
            setSelectedUnits((prevSelectedUnits) =>
              prevSelectedUnits.map((unit) => {
                if (unit.id === id) {
                  const updatedWeapons =
                    wargearType === "ranged"
                      ? unit.rangedWeapons.map((weapon, index) =>
                          index === wargearIndex
                            ? {
                                ...weapon,
                                quantity: Math.max(
                                  0,
                                  weapon.quantity + increment
                                ),
                              }
                            : weapon
                        )
                      : unit.meleeWeapons.map((weapon, index) =>
                          index === wargearIndex
                            ? {
                                ...weapon,
                                quantity: Math.max(
                                  0,
                                  weapon.quantity + increment
                                ),
                              }
                            : weapon
                        );

                  return {
                    ...unit,
                    [wargearType === "ranged"
                      ? "rangedWeapons"
                      : "meleeWeapons"]: updatedWeapons,
                  };
                }
                return unit;
              })
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
          enhancementQuantities={selectedUnits
            .map((unit) => unit.enhancementQuantities)
            .flat()}
          expanded={sidebarVisible}
          toggleArmySidebar={toggleArmySidebar}
          toggleArmySidebarVisibility={toggleArmySidebarVisibility}
          armySidebarTitle={armySidebarTitle}
          detachmentTitle={detachmentTitle} // Pass the detachment title here
          warlordId={warlordId} // Pass warlordId here
          setWarlordId={setWarlordId} // Pass setWarlordId here
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
                            modelName: model.modelName || "Unknown Model",
                            count: model.count || "0",
                          })),
                          points: cost.points,
                        })),
                        rangedWeapons: unit.weapons?.rangedWeapons || [],
                        meleeWeapons: unit.weapons?.meleeWeapons || [],
                        wargearOptions: unit.wargearOptions || [],
                        equipped: unit.equipped || [],
                        keywords: unit.keywords?.keywords || [], // Access the keywords array
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
