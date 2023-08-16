import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import ArmyList from "./components/ArmyList";
import AdeptusCustodes from "./components/40kfactions/AdeptusCustodes";
import AgentsOfTheImperium from "./components/40kfactions/AgentsOfTheImperium";
import ChaosDaemons from "./components/40kfactions/ChaosDaemons";
import { SelectedUnit } from "./types";

function App() {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [visibleComponents, setVisibleComponents] = useState<{
    [key: string]: boolean;
  }>({
    AdeptusCustodes: false,
    AgentsOfTheImperium: false,
    ChaosDaemons: false,
    // ...add other component names and set them to false
  });

  const updateUnitQuantity = (id: string, newQuantity: number) => {
    setSelectedUnits((prevSelectedUnits) =>
      prevSelectedUnits.map((unit) =>
        unit.id === id ? { ...unit, quantity: newQuantity } : unit
      )
    );
  };

  const removeUnit = (id: string) => {
    setSelectedUnits((prevSelectedUnits) =>
      prevSelectedUnits.filter((unit) => unit.id !== id)
    );
  };

  return (
    <div>
      <Navbar
        visibleComponents={visibleComponents}
        setVisibleComponents={setVisibleComponents}
      />
      {Object.keys(visibleComponents).map(
        (componentName) =>
          visibleComponents[componentName] && (
            <div key={componentName}>
              {getComponent(componentName, setSelectedUnits)}
            </div>
          )
      )}
      {selectedUnits.length > 0 && (
        <ArmyList
          selectedUnits={selectedUnits}
          updateUnitQuantity={updateUnitQuantity}
          removeUnit={removeUnit}
        />
      )}
    </div>
  );
}

function getComponent(
  componentName: string,
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>
): JSX.Element | null {
  switch (componentName) {
    case "AgentsOfTheImperium":
      return <AgentsOfTheImperium setSelectedUnits={setSelectedUnits} />;
    case "AdeptusCustodes":
      return <AdeptusCustodes setSelectedUnits={setSelectedUnits} />;
    case "ChaosDaemons":
      return <ChaosDaemons setSelectedUnits={setSelectedUnits} />;
    // ...add cases for other components
    default:
      return null;
  }
}

export default App;
