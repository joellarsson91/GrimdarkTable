import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { InputLabel } from "@mui/material";
import factionsData from "../factions.json"; // Import factions.json dynamically

interface Props {
  visibleComponents: string[]; // Array of visible faction names
  setVisibleComponents: React.Dispatch<React.SetStateAction<string[]>>; // Setter for visible factions
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
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedDetachment, setSelectedDetachment] = useState<string | null>(
    null
  );
  const [armyName, setArmyName] = useState<string>("");

  // Extract faction names dynamically from factions.json
  const factionNames = factionsData.map((faction) => faction.faction);

  // Get detachments for the selected faction
  const detachmentsForSelectedFaction =
    factionsData.find((faction) => faction.faction === selectedFaction)
      ?.detachments || [];

  const handleFactionChange = (event: SelectChangeEvent<string>) => {
    setSelectedFaction(event.target.value);
    setSelectedDetachment(null); // Reset detachment when faction changes
  };

  const handleDetachmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDetachment(event.target.value);
  };

  const handleNewArmyClick = () => {
    setOpenPopup(true);
  };

  const handleCheckboxChange = (factionName: string) => {
    setVisibleComponents((prevState) =>
      prevState.includes(factionName)
        ? prevState.filter((name) => name !== factionName)
        : [...prevState, factionName]
    );
  };

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
                Factions
              </a>
              <ul className="dropdown-menu">
                {factionNames.map((factionName) => (
                  <li key={factionName}>
                    <div className="form-check">
                      <input
                        className="checkbox"
                        checked={visibleComponents.includes(factionName)}
                        onChange={() => handleCheckboxChange(factionName)}
                        type="checkbox"
                        value={factionName}
                        id={`checkbox-${factionName}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`checkbox-${factionName}`}
                      >
                        {factionName}
                      </label>
                    </div>
                  </li>
                ))}
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
                <InputLabel>Faction</InputLabel>
                <Select
                  value={selectedFaction || ""}
                  onChange={handleFactionChange}
                >
                  {factionNames.map((factionName) => (
                    <MenuItem key={factionName} value={factionName}>
                      {factionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {detachmentsForSelectedFaction.length > 0 && (
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Detachment</InputLabel>
                  <Select
                    value={selectedDetachment || ""}
                    onChange={handleDetachmentChange}
                  >
                    {detachmentsForSelectedFaction.map((detachment, index) => (
                      <MenuItem key={index} value={detachment.name}>
                        {detachment.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                label="Army Name"
                fullWidth
                value={armyName}
                onChange={(e) => setArmyName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
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
