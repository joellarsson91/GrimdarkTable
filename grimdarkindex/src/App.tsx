import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import ArmyList from "./components/ArmyList";
import AdeptusCustodes from "./components/40kfactions/AdeptusCustodes";
import AgentsOfTheImperium from "./components/40kfactions/AgentsOfTheImperium";
import ChaosDaemons from "./components/40kfactions/ChaosDaemons";
import ArmySidebar from "./components/ArmySidebar";
import Unitcard from "./components/units/Unitcard";
import { SelectedUnit } from "./types";
import { v4 as uuidv4 } from "uuid";
import Tyranids from "./components/40kfactions/Tyranids";

function App() {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [enhancementQuantities, setEnhancementQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [visibleComponents, setVisibleComponents] = useState<{
    [key: string]: boolean;
  }>({
    AdeptusCustodes: false,
    AgentsOfTheImperium: false,
    ChaosDaemons: false,
    // ...add other component names and set them to false
  });

  const [sidebarVisible, setArmySidebarVisible] = useState(false);
  const [sidebarExpanded, setArmySidebarExpanded] = useState(true);

  const toggleArmySidebar = () => {
    setArmySidebarExpanded(!sidebarExpanded);
  };

  const toggleArmySidebarVisibility = () => {
    setArmySidebarVisible(!sidebarVisible);
  };

  const updateUnitQuantity = (id: string, increment: number) => {
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
  };

  const updateWargearQuantity = (
    id: string,
    wargearIndex: number,
    increment: number
  ) => {
    setSelectedUnits((prevSelectedUnits) =>
      prevSelectedUnits.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              wargearQuantities: unit.wargearQuantities.map((quantity, index) =>
                index === wargearIndex
                  ? Math.max(0, quantity + increment) // Ensure quantity is not negative
                  : quantity
              ),
            }
          : unit
      )
    );
  };
  const updateEnhancementQuantity = (
    id: string,
    enhancementIndex: number,
    increment: number
  ) => {
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
  };

  const removeUnit = (id: string) => {
    setSelectedUnits((prevSelectedUnits) =>
      prevSelectedUnits.filter((unit) => unit.id !== id)
    );
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
        enhancements, // Corrected property name
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
        visibleComponents={visibleComponents}
        setVisibleComponents={setVisibleComponents}
        sidebarVisible={sidebarVisible}
        sidebarExpanded={sidebarExpanded}
        toggleArmySidebar={toggleArmySidebar}
        toggleArmySidebarVisibility={toggleArmySidebarVisibility}
      />

      {sidebarVisible && (
        <ArmySidebar
          selectedUnits={selectedUnits}
          updateUnitQuantity={updateUnitQuantity}
          removeUnit={removeUnit}
          updateWargearQuantity={updateWargearQuantity}
          updateEnhancementQuantity={updateEnhancementQuantity}
          expanded={sidebarExpanded}
          toggleArmySidebar={toggleArmySidebar}
          toggleArmySidebarVisibility={toggleArmySidebarVisibility} // Corrected this line
          enhancementQuantities={enhancementQuantities} // Add this line
        />
      )}

      {Object.keys(visibleComponents).map(
        (componentName) =>
          visibleComponents[componentName] && (
            <div key={componentName}>
              {getComponent(componentName, setSelectedUnits, addUnitToArmyList)}
            </div>
          )
      )}
    </div>
  );
}

function getComponent(
  componentName: string,
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>,
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[]
  ) => void
): JSX.Element | null {
  switch (componentName) {
    case "AgentsOfTheImperium":
      return (
        <AgentsOfTheImperium
          setSelectedUnits={setSelectedUnits}
          addUnitToArmyList={addUnitToArmyList}
        />
      );
    case "AdeptusCustodes":
      return (
        <AdeptusCustodes
          setSelectedUnits={setSelectedUnits}
          addUnitToArmyList={addUnitToArmyList}
        />
      );
    case "ChaosDaemons":
      return (
        <ChaosDaemons
          setSelectedUnits={setSelectedUnits}
          addUnitToArmyList={addUnitToArmyList}
        />
      );
    case "Tyranids":
      return (
        <Tyranids
          setSelectedUnits={setSelectedUnits}
          addUnitToArmyList={addUnitToArmyList}
        />
      );
    // ...add cases for other components
    default:
      return null;
  }
}

export default App;
