import React from "react";
import Unitcard from "../units/Unitcard";
import { SelectedUnit } from "../../types";
import unitCategories from "../../unitCategories";

interface Props {
  setSelectedUnits: React.Dispatch<React.SetStateAction<SelectedUnit[]>>;
  addUnitToArmyList: (
    name: string,
    category: string,
    pointCost: number[],
    numberOfModels: number[],
    rangedWeapons?: { name: string; quantity: number }[],
    meleeWeapons?: { name: string; quantity: number }[],
    miscellaneous?: { name: string; quantity: number }[],
    enhancements?: { name: string; pointCost: number }[] // Include enhancements parameter
  ) => void;
}

const detachments = {
  "Shield Host": [
    { name: "Unstoppable Destroyer", pointCost: 25 },
    { name: "Inspirational Exemplar", pointCost: 10 },
    { name: "Veiled Blade", pointCost: 25 },
    { name: "Ceaseless Hunter", pointCost: 30 },
  ],
};

export default function AdeptusCustodes({
  setSelectedUnits,
  addUnitToArmyList,
}: Props) {
  return (
    <div>
      <div className="container text-center">
        <div className="row">
          <div className="col-2">
            <div>
              <Unitcard
                name="Aleya"
                category={unitCategories.Characters}
                pointCost={[80]}
                numberOfModels={[1]}
                unitImageUrl="aleya.jpeg"
                meleeWeapons={[{ name: "Somnus", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Blade Champion"
                category={unitCategories.Characters}
                pointCost={[120]}
                numberOfModels={[1]}
                unitImageUrl="bladechampion.webp"
                meleeWeapons={[{ name: "Vaultswords", quantity: 1 }]}
                enhancements={[
                  { name: "Unstoppable Destroyer", pointCost: 25 },
                  { name: "Inspirational Exemplar", pointCost: 10 },
                  { name: "Veiled Blade", pointCost: 25 },
                  { name: "Ceaseless Hunter", pointCost: 30 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Knight-Centura"
                category={unitCategories.Characters}
                pointCost={[75]}
                numberOfModels={[1]}
                unitImageUrl="knight-centura.png"
                rangedWeapons={[
                  { name: "Master-crafted Boltgun", quantity: 0 },
                  { name: "Withseeker Flamer", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Executioner Greaterblade", quantity: 1 },
                  { name: "Close Combat Weapon", quantity: 0 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Shield-Captain"
                category={unitCategories.Characters}
                pointCost={[140]}
                numberOfModels={[1]}
                unitImageUrl="shield-captain.webp"
                rangedWeapons={[
                  { name: "Guardian Spear", quantity: 1 },
                  { name: "Castellan Axe", quantity: 0 },
                  { name: "Sentinel Blade", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 1 },
                  { name: "Castellan Axe", quantity: 0 },
                  { name: "Sentinel Blade", quantity: 0 },
                ]}
                miscellaneous={[{ name: "Praesidium Shield", quantity: 0 }]}
                enhancements={[
                  { name: "Unstoppable Destroyer", pointCost: 25 },
                  { name: "Inspirational Exemplar", pointCost: 10 },
                  { name: "Veiled Blade", pointCost: 25 },
                  { name: "Ceaseless Hunter", pointCost: 30 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Shield-Captain on Jetbike"
                category={unitCategories.Characters}
                pointCost={[180]}
                numberOfModels={[1]}
                unitImageUrl="shield-captainondawneaglejetbike.webp"
                rangedWeapons={[
                  { name: "Salvo Launcher", quantity: 1 },
                  { name: "Vertus Hurricane Bolter", quantity: 0 },
                ]}
                meleeWeapons={[{ name: "Interceptor Lance", quantity: 1 }]}
                enhancements={[
                  { name: "Unstoppable Destroyer", pointCost: 25 },
                  { name: "Inspirational Exemplar", pointCost: 10 },
                  { name: "Veiled Blade", pointCost: 25 },
                  { name: "Ceaseless Hunter", pointCost: 30 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Terminator Shield-Captain"
                category={unitCategories.Characters}
                pointCost={[140]}
                numberOfModels={[1]}
                unitImageUrl="terminatorshield-captain.webp"
                rangedWeapons={[
                  { name: "Balistus Grenade Launcher", quantity: 1 },
                  { name: "Guardian Spear", quantity: 1 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 1 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                enhancements={[
                  { name: "Unstoppable Destroyer", pointCost: 25 },
                  { name: "Inspirational Exemplar", pointCost: 10 },
                  { name: "Veiled Blade", pointCost: 25 },
                  { name: "Ceaseless Hunter", pointCost: 30 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Trajann Valrois"
                category={unitCategories.Characters}
                pointCost={[160]}
                numberOfModels={[1]}
                unitImageUrl="trajannvaloris.jpeg"
                rangedWeapons={[{ name: "Watcher's Axe", quantity: 1 }]}
                meleeWeapons={[{ name: "Watcher's Axe", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Valerian"
                category={unitCategories.Characters}
                pointCost={[140]}
                numberOfModels={[1]}
                unitImageUrl="valerian.webp"
                rangedWeapons={[{ name: "Gnosis", quantity: 1 }]}
                meleeWeapons={[{ name: "Gnosis", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Custodian Guard"
                category={unitCategories.Battleline}
                pointCost={[200, 250]}
                numberOfModels={[4, 5]}
                unitImageUrl="custodianguard.webp"
                rangedWeapons={[
                  { name: "Guardian Spear", quantity: 4 },
                  { name: "Sentinel Blade", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 4 },
                  { name: "Sentinel Blade", quantity: 0 },
                  { name: "Misericordia", quantity: 0 },
                ]}
                miscellaneous={[
                  { name: "Vexilla", quantity: 0 },
                  { name: "Praesidium Shield", quantity: 0 },
                  { name: "Misericordia", quantity: 0 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Prosecutor"
                category={unitCategories.Battleline}
                pointCost={[40, 50, 60, 70, 80, 90, 100]}
                numberOfModels={[4, 5, 6, 7, 8, 9, 10]}
                unitImageUrl="prosecutor.jpeg"
                rangedWeapons={[{ name: "Boltgun", quantity: 4 }]}
                meleeWeapons={[{ name: "Close combat weapon", quantity: 4 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Adrasite Custodian Guard"
                category={unitCategories.OtherUnits}
                pointCost={[300]}
                numberOfModels={[5]}
                unitImageUrl="adrasitecustodianguard.png"
                rangedWeapons={[
                  { name: "Adrasite Spear", quantity: 5 },
                  { name: "Pyrihite Spear", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Adrasite Spear", quantity: 5 },
                  { name: "Pyrihite Spear", quantity: 0 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Allarus Custodian"
                category={unitCategories.OtherUnits}
                pointCost={[130, 190, 325, 390]}
                numberOfModels={[2, 3, 5, 6]}
                unitImageUrl="allaruscustodian.jpeg"
                rangedWeapons={[
                  { name: "Balistus Grenade Launcher", quantity: 2 },
                  { name: "Guardian Spear", quantity: 2 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 2 },
                  { name: "Castellan Axe", quantity: 0 },
                  { name: "Misericordia", quantity: 0 },
                ]}
                miscellaneous={[{ name: "Vexilla", quantity: 0 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>

          <div className="col-2">
            <div>
              <Unitcard
                name="Agamatus Custodian"
                category={unitCategories.OtherUnits}
                pointCost={[240, 480]}
                numberOfModels={[3, 6]}
                unitImageUrl="agamatuscustodian.webp"
                rangedWeapons={[
                  { name: "Lastrum Bolt Cannon", quantity: 3 },
                  { name: "Adrathic Devastator", quantity: 0 },
                  { name: "Twin Las-pulsar", quantity: 0 },
                ]}
                meleeWeapons={[{ name: "Interceptor Lance", quantity: 3 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Aquilon Custodiana"
                category={unitCategories.OtherUnits}
                pointCost={[210, 420]}
                numberOfModels={[3, 6]}
                unitImageUrl="aquiloncustodians.webp"
                rangedWeapons={[
                  { name: "Lastrum Storm Bolter", quantity: 3 },
                  { name: "Infernus Firespike", quantity: 0 },
                  { name: "Twin Adrathic Destructor", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Solerite Power Gauntlet", quantity: 3 },
                  { name: "Solerite Power Talon", quantity: 0 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Ares Gunship"
                category={unitCategories.OtherUnits}
                pointCost={[580]}
                numberOfModels={[1]}
                unitImageUrl="aresgunship.webp"
                rangedWeapons={[
                  { name: "Arachnus Heavy Blaze Cannon", quantity: 2 },
                  { name: "Arachnus Magna-Blaze Cannon", quantity: 1 },
                ]}
                meleeWeapons={[{ name: "Armoured Hull", quantity: 3 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Caladius Grav-tank"
                category={unitCategories.OtherUnits}
                pointCost={[215]}
                numberOfModels={[1]}
                unitImageUrl="caladiusgrav-tank.webp"
                rangedWeapons={[
                  { name: "Twin Iliastrus Accelerator Cannon", quantity: 1 },
                  { name: "Twin Lastrum Bolt Cannon", quantity: 1 },
                  { name: "Twin Arachnus Heavy Blaze Cannon", quantity: 0 },
                ]}
                meleeWeapons={[{ name: "Armoured Hull", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Contemptor-Achillus Dreadnought"
                category={unitCategories.OtherUnits}
                pointCost={[165]}
                numberOfModels={[1]}
                unitImageUrl="contemptor-achillusdreadnought.webp"
                rangedWeapons={[
                  { name: "Lastrum Storm Bolter", quantity: 2 },
                  { name: "Infernus Incinerator", quantity: 0 },
                  { name: "Twin Adrathic Destructor", quantity: 0 },
                ]}
                meleeWeapons={[{ name: "Achillus Dreadspear", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Contemptor-Galatus Dreadnought"
                category={unitCategories.OtherUnits}
                pointCost={[175]}
                numberOfModels={[1]}
                unitImageUrl="contemptor-galatusdreadnought.webp"
                rangedWeapons={[{ name: "Galatus Warblade", quantity: 1 }]}
                meleeWeapons={[{ name: "Galatus Warblade", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Coronus Grav-carrier"
                category={unitCategories.OtherUnits}
                pointCost={[200]}
                numberOfModels={[1]}
                unitImageUrl="coronusgrav-carrier.webp"
                rangedWeapons={[
                  { name: "Twin Arachnus Blaze Cannon", quantity: 1 },
                  { name: "Twin Lastrum Bolt Cannon", quantity: 1 },
                ]}
                meleeWeapons={[{ name: "Armoured Hull", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Custodian Warden"
                category={unitCategories.OtherUnits}
                pointCost={[220, 275]}
                numberOfModels={[4, 5]}
                unitImageUrl="custodianwarden.jpeg"
                rangedWeapons={[
                  { name: "Guardian Spear", quantity: 4 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Guardian Spear", quantity: 4 },
                  { name: "Castellan Axe", quantity: 0 },
                ]}
                miscellaneous={[{ name: "Vexilla", quantity: 0 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>

          <div className="col-2">
            <div>
              <Unitcard
                name="Orion Assault Dropship"
                category={unitCategories.OtherUnits}
                pointCost={[690]}
                numberOfModels={[1]}
                unitImageUrl="orionassaultdropship.webp"
                rangedWeapons={[
                  { name: "Arachnus Heavy Blaze Cannon", quantity: 2 },
                  { name: "Twin Lastrum Bolt Cannon", quantity: 2 },
                  { name: "Spiculus Heavy Bolt Launcher", quantity: 2 },
                ]}
                meleeWeapons={[{ name: "Armoured Hull", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Pallas Grav-attack"
                category={unitCategories.OtherUnits}
                pointCost={[690]}
                numberOfModels={[1]}
                unitImageUrl="pallasgrav-attack.webp"
                rangedWeapons={[
                  { name: "Twin Arachnus Blaze Cannon", quantity: 1 },
                ]}
                meleeWeapons={[{ name: "Armoured Hull", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Sagittarum Custodians"
                category={unitCategories.OtherUnits}
                pointCost={[225]}
                numberOfModels={[5]}
                unitImageUrl="sagittarumcustodian.jpeg"
                rangedWeapons={[{ name: "Adrastus Bolt Caliver", quantity: 5 }]}
                meleeWeapons={[{ name: "Misericordia", quantity: 5 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Telemon Heavy Dreadnought"
                category={unitCategories.OtherUnits}
                pointCost={[235]}
                numberOfModels={[1]}
                unitImageUrl="telemonheavydreadnought.webp"
                rangedWeapons={[
                  { name: "Illiastus Accelerator Culverin", quantity: 2 },
                  { name: "Spiculus Bolt Launcher", quantity: 1 },
                  { name: "Arachnus Storm Cannon", quantity: 0 },
                  { name: "Telemon Caestus", quantity: 0 },
                  { name: "Twin Plasma Projector", quantity: 0 },
                ]}
                meleeWeapons={[{ name: "Armoured Feet", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Venetari Custodians"
                category={unitCategories.OtherUnits}
                pointCost={[200, 400]}
                numberOfModels={[3, 6]}
                unitImageUrl="venetaricustodians.webp"
                rangedWeapons={[
                  { name: "Venetari Lance", quantity: 2 },
                  { name: "Kinetic Destroyer", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Venetari Lance", quantity: 2 },
                  { name: "Tarsis Buckler", quantity: 0 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Venerable Contemptor Dreadnought"
                category={unitCategories.OtherUnits}
                pointCost={[185]}
                numberOfModels={[1]}
                unitImageUrl="venerablecontemptordreadnought.webp"
                rangedWeapons={[
                  { name: "Combi-bolter", quantity: 1 },
                  { name: "Multi-melta", quantity: 1 },
                  { name: "Kheres-pattern Assault Cannon", quantity: 0 },
                ]}
                meleeWeapons={[
                  { name: "Contemptor Combat Weapon", quantity: 1 },
                ]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Vertus Preator"
                category={unitCategories.OtherUnits}
                pointCost={[160, 240]}
                numberOfModels={[2, 3]}
                unitImageUrl="vertuspreator.jpeg"
                rangedWeapons={[
                  { name: "Salvo Launher", quantity: 2 },
                  { name: "Vertus Hurricane Bolter", quantity: 0 },
                ]}
                meleeWeapons={[{ name: "Interceptor Lance", quantity: 2 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Vigilators"
                category={unitCategories.OtherUnits}
                pointCost={[40, 65, 115, 130]}
                numberOfModels={[4, 5, 9, 10]}
                unitImageUrl="vigilators.webp"
                meleeWeapons={[{ name: "Executioner Greatblade", quantity: 4 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Witchseekers"
                category={unitCategories.OtherUnits}
                pointCost={[40, 65, 115, 125]}
                numberOfModels={[4, 5, 9, 10]}
                unitImageUrl="witchseekers.webp"
                rangedWeapons={[{ name: "Witchseeker Flamer", quantity: 4 }]}
                meleeWeapons={[{ name: "Close Combat Weapon", quantity: 4 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
          <div className="col-2">
            <div>
              <Unitcard
                name="Anathema Psykana Rhino"
                category={unitCategories.DedicatedTransport}
                pointCost={[75]}
                numberOfModels={[1]}
                unitImageUrl="anathemapsykanarhino.jpeg"
                rangedWeapons={[
                  { name: "Hunter-killer Missile", quantity: 1 },
                  { name: "Storm Bolter", quantity: 1 },
                ]}
                meleeWeapons={[{ name: "Armoured Tracks", quantity: 1 }]}
                addUnitToArmyList={addUnitToArmyList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
