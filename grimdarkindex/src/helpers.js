/**
 * Parses the unit composition string to extract weapons and their quantities.
 * @param {string} unitComposition - The unit composition string.
 * @returns {{ name: string, quantity: number }[]} - Array of weapons with their names and quantities.
 */
export function parseUnitComposition(unitComposition) {
  const weaponRegex = /(\d+)?\s*([\w\s\-]+?)(?=;|$)/g;
  const equippedWithMatch = unitComposition.match(/equipped with\*\*:(.+)/i);

  if (!equippedWithMatch) return [];

  const weaponsString = equippedWithMatch[1];
  const weapons = [];

  let match;
  while ((match = weaponRegex.exec(weaponsString)) !== null) {
    const quantity = match[1] ? parseInt(match[1], 10) : 1; // Default to 1 if no quantity is specified
    const name = match[2].trim();
    weapons.push({ name, quantity });
  }

  return weapons;
}

/**
 * Parses the equipped weapons from the unit composition string.
 * @param {string} unitComposition - The unit composition string.
 * @returns {{ name: string, quantity: number }[]} - Array of equipped weapons with their names and quantities.
 */
export function parseEquippedWeapons(unitComposition) {
  const equippedWithMatch = unitComposition.match(/equipped with\*\*:(.+)/i);
  if (!equippedWithMatch) return [];

  const weaponsString = equippedWithMatch[1];
  const weaponRegex = /(\d+)?\s*([\w\s\-]+?)(?=;|$)/g;

  const equipped = [];
  let match;
  while ((match = weaponRegex.exec(weaponsString)) !== null) {
    const quantity = match[1] ? parseInt(match[1], 10) : 1; // Default to 1 if no quantity is specified
    const name = match[2].trim();
    equipped.push({ name, quantity });
  }

  return equipped;
}

