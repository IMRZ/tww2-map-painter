import { createSlice } from '@reduxjs/toolkit';

import assets from '../assets';
import maps from '../data/maps';
import factions from '../data/factions';
import presets from '../data/presets';

const DEFAULT_MAP = maps.mortal;
const DEFAULT_PRESETS = presets[DEFAULT_MAP.key];
const DEFAULT_PRESET_MORTAL = presets['mortal']['reikland'];
const DEFAULT_PRESET_VORTEX = presets['vortex']['default'];

const DEFAULT_MAP_STATE = Object.values(DEFAULT_MAP.regions).reduce((accumulator: { [key: string]: any }, region: any) => {
  accumulator[region.key] = DEFAULT_PRESET_MORTAL.ownership[region.key];
  return accumulator;
}, {});

// TODO: type faction
const DEFAULT_ALL_FACTION_COMBINED = Object.values(factions).reduce((accumulator: { [key: string]: any }, factionGroup: any) => {
  Object.values(factionGroup.factions).forEach((faction: any) => {
    accumulator[faction.key] = faction;
  });

  return accumulator;
}, {});

const DEFAULT_FACTION_GROUPS = Object.values(factions).reduce((accumulator: { [key: string]: any }, factionGroup: any) => {
  const factionGroupKeys = Object.keys(factionGroup.factions);
  accumulator[factionGroup.name] = factionGroupKeys;

  return accumulator;
}, {});

type Mode = 'interactive' | 'painter';
type RegionKey = string | null;
type FactionKey = string | null;

const INITIAL_STATE = {
  selectedMap: DEFAULT_MAP,
  factions: DEFAULT_ALL_FACTION_COMBINED,
  groups: DEFAULT_FACTION_GROUPS,
  ownership: DEFAULT_MAP_STATE,
  importedFactions: new Array<string>(),
  mode: 'interactive' as Mode,

  selectedRegion: null as RegionKey,
  selectedFaction: null as FactionKey,

  presets: DEFAULT_PRESETS,

  config: {
    drawerOpen: true,
    flyToEnabled: true,
  }
};

const painterSlice = createSlice({
  name: 'painter',
  initialState: INITIAL_STATE,
  reducers: {
    mapChanged: (state, action) => {
      const mapKey = action.payload as string;
      state.selectedMap = maps[mapKey];
      state.selectedRegion = null;
      state.selectedFaction = null;
      state.presets = presets[mapKey];
      const defaultPreset = mapKey === 'mortal' ? DEFAULT_PRESET_MORTAL.ownership : DEFAULT_PRESET_VORTEX.ownership;
      state.ownership = Object.values(maps[mapKey].regions).reduce((accumulator: { [key: string]: any }, region: any) => {
        accumulator[region.key] = defaultPreset[region.key];
        return accumulator;
      }, {});
    },
    modeChanged: (state, action) => {
      const mode = action.payload;
      state.mode = mode;
    },
    factionChanged: (state, action) => {
      const factionKey = action.payload;
      state.selectedFaction = factionKey;
    },
    regionChanged: (state, action) => {
      const regionKey = action.payload;
      state.selectedRegion = regionKey;
    },
    regionOwnerChanged: (state, action) => {
      const [regionKey, factionKey] = action.payload;
      state.ownership[regionKey] = factionKey;
    },

    updateConfiguration: (state, action) => {
      state.config = {
        ...state.config,
        ...action.payload,
      };
    },

    importMap: (state, action) => {
      Object.entries(action.payload).forEach(([regionKey, factionKey]: [string, any]) => {
        const isValidRegion = state.ownership[regionKey] !== undefined;
        const isNotExistingFaction = factionKey !== null && state.factions[factionKey] === undefined;

        if (isValidRegion) {
          state.ownership[regionKey] = factionKey;

          if (isNotExistingFaction) {
            const importedFaction = {
              key: factionKey,
              name: factionKey,
              icon: assets['icons/imported']
            };
            state.importedFactions.push(importedFaction.key);
            state.factions[importedFaction.key] = importedFaction;
          }
        }
      });
    },
  },
});

export const {
  mapChanged,
  modeChanged,
  factionChanged,
  regionChanged,
  regionOwnerChanged,
  updateConfiguration,
  importMap
} = painterSlice.actions;

export default painterSlice.reducer;
