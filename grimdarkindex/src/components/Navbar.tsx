import React from "react";

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
  const handleCheckboxChange = (componentName: string) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName],
    }));
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
