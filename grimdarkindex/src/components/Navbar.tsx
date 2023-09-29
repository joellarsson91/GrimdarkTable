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

function Navbar({
  visibleComponents,
  setVisibleComponents,
  sidebarVisible,
  sidebarExpanded,
  toggleArmySidebar,
  toggleArmySidebarVisibility,
}: Props) {
  const [openPopup, setOpenPopup] = useState(false);
  const handleCheckboxChange = (componentName: string) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName],
    }));
  };
  const handleNewArmyClick = () => {
    setOpenPopup(true);
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
                // Add the state and handlers for game system selection here
                >
                  {/* Add game system options */}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Faction</InputLabel>
                <Select
                // Add the state and handlers for faction selection here
                >
                  {/* Add faction options */}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Detachment</InputLabel>
                <Select
                // Add the state and handlers for detachment selection here
                >
                  {/* Add detachment options */}
                </Select>
              </FormControl>
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
}

export default Navbar;
