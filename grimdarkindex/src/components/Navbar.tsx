import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { InputLabel } from "@mui/material";
import detachmentData from "../database/detachments.json";
import { Detachment, FactionDetachments, DetachmentData } from "../types";

interface Props {
  visibleComponents: { [key: string]: boolean };
  setVisibleComponents: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  sidebarVisible: boolean;
  sidebarExpanded: boolean;
  toggleArmySidebar: () => void;
  toggleArmySidebarVisibility: () => void;
}

const Navbar: React.FC<Props> = ({
  visibleComponents,
  setVisibleComponents,
  sidebarVisible,
  sidebarExpanded,
  toggleArmySidebar,
  toggleArmySidebarVisibility,
}: Props) => {
  const [factionNames, setFactionNames] = useState<string[]>(
    extractFactionNames()
  );
  const [openPopup, setOpenPopup] = useState(false);

  // Function to extract faction names from the JSON data
  function extractFactionNames() {
    const factionNames = Object.keys(detachmentData);
    return factionNames;
  }

  const gameSystems = ["Warhammer 40K", "Age of Sigmar", "Kill Team"];
  const [selectedGameSystem, setSelectedGameSystem] = useState<
    string | undefined
  >(
    "" // Initialize it as an empty string or undefined
  );
  // Function to handle game system change
  const handleGameSystemChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedGameSystem(event.target.value as string);
    // Conditionally show/hide the detachment dropdown based on the selected game system
    setShowDetachmentDropdown(event.target.value === "Warhammer 40K");
  };
  const [selectedFaction, setSelectedFaction] = useState("");

  // Function to handle faction change
  const handleFactionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedFaction = event.target.value as string;
    setSelectedFaction(selectedFaction);
  };

  const [showDetachmentDropdown, setShowDetachmentDropdown] = useState(false);
  // Function to handle detachment change
  const [selectedDetachment, setSelectedDetachment] = useState("");

  const handleDetachmentChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedDetachment = event.target.value as string;
    setSelectedDetachment(selectedDetachment);
  };
  // Function to handle the "New Army" button click
  const handleNewArmyClick = () => {
    setOpenPopup(true);
  };

  const handleCheckboxChange = (componentName: string) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName],
    }));
  };

  // Get the detachments associated with the selected faction
  const detachmentsForSelectedFaction =
    (detachmentData[selectedFaction] as Detachment) || [];

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="/images/toolbarlogo.png"
            alt="Bootstrap"
            width="100"
            height="40"
            className="rounded"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Game System
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Warhammer 40K
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Age of Sigmar
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Kill Team
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Faction
              </a>
              <ul className="dropdown-menu">
                <div className="row"></div>
                <li>
                  <div className="form-check">
                    <input
                      className="checkbox"
                      checked={visibleComponents.AgentsOfTheImperium}
                      onChange={() =>
                        handleCheckboxChange("AgentsOfTheImperium")
                      }
                      type="checkbox"
                      value="AgentsOfTheImperium"
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label">
                      Agents of the Imperium
                    </label>
                  </div>
                </li>
                <li>
                  <div className="form-check">
                    <input
                      className="checkbox"
                      checked={visibleComponents.AdeptusCustodes}
                      onChange={() => handleCheckboxChange("AdeptusCustodes")}
                      type="checkbox"
                      value="adeptuscustodes"
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label">Adeptus Custodes</label>
                  </div>
                </li>
                <li>
                  <div className="form-check">
                    <input
                      className="checkbox"
                      checked={visibleComponents.ChaosDaemons}
                      onChange={() => handleCheckboxChange("ChaosDaemons")}
                      type="checkbox"
                      value="chaosDaemons"
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label">Chaos Daemons</label>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            sx={{ marginLeft: 2 }}
            onClick={handleNewArmyClick}
          >
            New Army
          </Button>
          {/* Popup for creating a new army */}
          <Dialog
            open={openPopup}
            onClose={() => setOpenPopup(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Create a New Army</DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Game System</InputLabel>
                <Select
                  value={selectedGameSystem || ""} // Use an empty string as the default value
                  label="Game System"
                  onChange={handleGameSystemChange as any}
                >
                  {gameSystems.map((gameSystem, index) => (
                    <MenuItem key={index} value={gameSystem}>
                      {gameSystem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Faction</InputLabel>
                <Select
                  value={selectedFaction} // Use the selectedFaction state variable
                  onChange={(event) => setSelectedFaction(event.target.value)}
                >
                  {extractFactionNames().map((factionName, index) => (
                    <MenuItem key={index} value={factionName}>
                      {factionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {showDetachmentDropdown && (
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Detachment</InputLabel>
                  <Select
                    value={selectedDetachment}
                    onChange={handleDetachmentChange as any}
                  >
                    {Object.keys(detachmentsForSelectedFaction).map(
                      (detachmentName, index) => (
                        <MenuItem key={index} value={detachmentName}>
                          {detachmentName}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              )}
              <TextField
                label="Army Name"
                fullWidth
                // Add the state and handler for army name here
                sx={{ marginBottom: 2 }}
              />
              {/* Add a button to submit the new army */}
            </DialogContent>
          </Dialog>
        </div>
        {sidebarVisible ? (
          <button
            className="material-symbols-outlined"
            onClick={toggleArmySidebar}
          >
            {sidebarExpanded ? "check_box_outline_blank" : "dock_to_left"}
          </button>
        ) : (
          <button
            className="material-symbols-outlined"
            onClick={toggleArmySidebarVisibility}
          >
            dock_to_left
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
