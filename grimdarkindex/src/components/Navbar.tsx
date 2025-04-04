import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Add, Download } from "@mui/icons-material"; // Import Download icon
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { InputLabel } from "@mui/material";
import factionsData from "../factions.json";
import html2canvas from "html2canvas";
import { calculateTotalPoints } from "./ArmySidebar"; // Adjust the path as needed
import { SelectedUnit } from "../types";

type Detachment = {
  name: string;
};

type Faction = {
  faction: string;
  armyRules: { name: string; rules: string }[];
  detachments: Detachment[];
  datasheets: any[];
};

const factions: Faction[] = factionsData as Faction[];

interface Props {
  visibleComponents: string[];
  setVisibleComponents: React.Dispatch<React.SetStateAction<string[]>>;
  sidebarVisible: boolean;
  sidebarExpanded: boolean;
  toggleArmySidebar: () => void;
  toggleArmySidebarVisibility: () => void;
  setArmySidebarTitle: React.Dispatch<React.SetStateAction<string>>;
  clearArmyList: () => void;
  selectedUnits: SelectedUnit[]; // Add selectedUnits here
}

const Navbar: React.FC<Props> = ({
  visibleComponents,
  setVisibleComponents,
  sidebarVisible,
  sidebarExpanded,
  toggleArmySidebar,
  toggleArmySidebarVisibility,
  setArmySidebarTitle,
  clearArmyList,
  selectedUnits, // Destructure selectedUnits here
}: Props) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false); // State for export dialog
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedDetachment, setSelectedDetachment] = useState<string | null>(
    null
  );
  const [armyName, setArmyName] = useState<string>("");
  const [exportOptions, setExportOptions] = useState({
    visualView: false,
    wtcStyle: false,
    compactStyle: false,
  }); // State for checkboxes

  // Sort factions alphabetically
  const factionNames = factions
    .map((faction: Faction) => faction.faction)
    .sort((a, b) => a.localeCompare(b));

  const detachmentsForSelectedFaction =
    factions.find((faction: Faction) => faction.faction === selectedFaction)
      ?.detachments || [];

  const handleFactionChange = (event: SelectChangeEvent<string>) => {
    setSelectedFaction(event.target.value);
    setSelectedDetachment(null);
  };

  const handleDetachmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDetachment(event.target.value);
  };

  const handleNewArmyClick = () => {
    // Reset the faction, detachment, and army name fields
    setSelectedFaction(null);
    setSelectedDetachment(null);
    setArmyName("");

    // Open the popup
    setOpenPopup(true);
  };

  const handleCheckboxChange = (factionName: string) => {
    setVisibleComponents((prevState) =>
      prevState.includes(factionName)
        ? prevState.filter((name) => name !== factionName)
        : [...prevState, factionName]
    );
  };

  const handleOkClick = () => {
    if (selectedFaction && selectedDetachment && armyName) {
      // Set the army name as the sidebar title
      setArmySidebarTitle(armyName);

      // Unhide the sidebar if it's hidden
      if (!sidebarVisible) {
        toggleArmySidebarVisibility();
      }

      // Clear all other checkboxes and select only the chosen faction
      setVisibleComponents([selectedFaction]);

      // Clear the army list
      clearArmyList();

      // Close the popup
      setOpenPopup(false);
    }
  };

  const handleExportCheckboxChange = (option: keyof typeof exportOptions) => {
    setExportOptions({
      visualView: false,
      wtcStyle: false,
      compactStyle: false,
      [option]: true, // Only the selected option is set to true
    });
  };

  const handleExport = async () => {
    if (exportOptions.visualView) {
      // Create a temporary container for the export content
      const exportContainer = document.createElement("div");
      exportContainer.style.position = "absolute";
      exportContainer.style.top = "-9999px"; // Hide it off-screen
      exportContainer.style.width = "1000px"; // Set a wider width for better layout
      exportContainer.style.backgroundColor = "white"; // Ensure a white background
      exportContainer.style.color = "black"; // Ensure text is visible
      exportContainer.style.padding = "20px"; // Add padding for better spacing
      exportContainer.style.fontFamily = "Arial, sans-serif"; // Use a clean font

      // Add the army name as a header
      const armyNameElement = document.createElement("h1");
      armyNameElement.textContent = armyName || "Army List";
      armyNameElement.style.textAlign = "center";
      armyNameElement.style.fontSize = "36px"; // Larger font size for the header
      armyNameElement.style.marginBottom = "20px";
      exportContainer.appendChild(armyNameElement);

      // Add the total points
      const totalPointsElement = document.createElement("p");
      totalPointsElement.textContent = `Total Points: ${calculateTotalPoints(
        selectedUnits
      )}`;
      totalPointsElement.style.textAlign = "center";
      totalPointsElement.style.fontSize = "18px";
      totalPointsElement.style.marginBottom = "30px";
      exportContainer.appendChild(totalPointsElement);

      // Create a container for the units
      const unitsContainer = document.createElement("div");
      unitsContainer.style.display = "flex";
      unitsContainer.style.flexWrap = "wrap"; // Allow wrapping to the next row
      unitsContainer.style.justifyContent = "center";
      unitsContainer.style.gap = "20px"; // Add spacing between units
      exportContainer.appendChild(unitsContainer);

      // Add each unit
      selectedUnits.forEach((unit) => {
        const unitContainer = document.createElement("div");
        unitContainer.style.textAlign = "center";
        unitContainer.style.width = "150px"; // Fixed width for each unit card

        // Add the unit image
        const unitImage = document.createElement("img");
        unitImage.src = `/images/${unit.name}.webp`;
        unitImage.alt = unit.name;
        unitImage.style.width = "100%"; // Make the image fit the container
        unitImage.style.height = "auto";
        unitImage.style.border = "1px solid #ccc";
        unitImage.style.borderRadius = "5px";
        unitContainer.appendChild(unitImage);

        // Add the unit name
        const unitName = document.createElement("p");
        unitName.textContent = unit.name;
        unitName.style.fontSize = "14px";
        unitName.style.margin = "5px 0 0 0"; // Add a small margin above the text
        unitName.style.fontWeight = "bold";
        unitContainer.appendChild(unitName);

        // Add the model count
        const modelCount = document.createElement("p");
        modelCount.textContent = `Models: ${unit.numberOfModels[unit.currentIndex]}`;
        modelCount.style.fontSize = "12px";
        modelCount.style.margin = "0"; // Remove extra margin
        unitContainer.appendChild(modelCount);

        unitsContainer.appendChild(unitContainer);
      });

      // Append the container to the body
      document.body.appendChild(exportContainer);

      try {
        // Generate the image using html2canvas
        const canvas = await html2canvas(exportContainer);
        const image = canvas.toDataURL("image/png");

        // Create a download link
        const link = document.createElement("a");
        link.href = image;
        link.download = `${armyName || "ArmyList"}.png`;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        // Remove the temporary container
        document.body.removeChild(exportContainer);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="/images/toolbarlogo.webp"
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
                {factionNames.map((factionName: string) => (
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={handleNewArmyClick}
            >
              New Army
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Download />} // Replace with your export icon
              onClick={() => setOpenExportDialog(true)} // Open the export dialog
            >
              Export
            </Button>
          </div>
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
                  {factionNames.map((factionName: string) => (
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
                    {detachmentsForSelectedFaction.map(
                      (detachment: Detachment, index: number) => (
                        <MenuItem key={index} value={detachment.name}>
                          {detachment.name}
                        </MenuItem>
                      )
                    )}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleOkClick}
                disabled={!selectedFaction || !selectedDetachment || !armyName}
              >
                OK
              </Button>
            </DialogContent>
          </Dialog>
          {/* Export Dialog */}
          <Dialog
            open={openExportDialog}
            onClose={() => setOpenExportDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Export Options</DialogTitle>
            <DialogContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.visualView}
                      onChange={() => handleExportCheckboxChange("visualView")}
                    />
                  }
                  label="Visual"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.wtcStyle}
                      onChange={() => handleExportCheckboxChange("wtcStyle")}
                    />
                  }
                  label="WTC-style"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.compactStyle}
                      onChange={() => handleExportCheckboxChange("compactStyle")}
                    />
                  }
                  label="Compact-style"
                />
              </FormGroup>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={async () => {
                  await handleExport(); // Call the export function
                  setOpenExportDialog(false); // Close the dialog after exporting
                }}
              >
                Export
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
