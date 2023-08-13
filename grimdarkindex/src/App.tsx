import React, { ReactNode, useState, useEffect, EffectCallback } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import AdeptusCustodes from "./components/40kfactions/AdeptusCustodes";

function App() {
  return (
    <div>
      <div className="row">
        <Navbar />
      </div>
      <AdeptusCustodes />
    </div>
  );
}

export default App;
