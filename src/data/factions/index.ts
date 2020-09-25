// @ts-nocheck
const requireContext = require.context('.', true, /^.+\.json|png$/);
const factionGroups = requireContext.keys().reduce((accumulator, filename) => {
  if (filename.endsWith('.png')) return accumulator;

  const splitResult = filename.split('/');

  if (splitResult.length === 3) {
    const [/* dot */, groupKey] = splitResult;
    const meta = requireContext(filename);

    if (accumulator[groupKey] === undefined) {
      accumulator[groupKey] = {
        factions: {}
      };
    }

    accumulator[groupKey].name = meta['name'];
  } else {
    const [/* dot */, groupKey] = splitResult;
    const meta = requireContext(filename);

    if (accumulator[groupKey] === undefined) {
      accumulator[groupKey] = {
        factions: {}
      };
    }

    const factionKey = meta['key'];
    const factionName = meta['name'];
    const factionColor = meta['color'];

    // rekt... some factions have the same key...
    if (accumulator[groupKey].factions[factionKey] === undefined) {
      accumulator[groupKey].factions[factionKey] = {
        key: factionKey,
        name: factionName,
        icon: requireContext(filename.replace('meta.json', 'mon_24.png')),
        color: factionColor,
        group: groupKey,
        rank: 1,
      };
    }
  }

  return accumulator;
}, {});

export interface Faction {
  readonly key: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly group: string;
  readonly rank: number;
}

export default factionGroups as { [key: string]: Faction };
