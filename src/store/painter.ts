import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import assets from '../assets';
import campaigns from '../data/campaigns';
import factions from '../data/factions';
import presets from '../data/presets';

const DEFAULT_CAMPAIGN = campaigns.mortal;
const DEFAULT_PRESETS = presets[DEFAULT_CAMPAIGN.key];
const DEFAULT_PRESET_MORTAL = presets['mortal']['reikland'];
const DEFAULT_PRESET_VORTEX = presets['vortex']['default'];

const DEFAULT_MAP_STATE = Object.values(DEFAULT_CAMPAIGN.regions).reduce((accumulator: { [key: string]: any }, region: any) => {
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

export const PainterMode = {
  Interactive: 'interactive',
  Painter: "painter"
} as const;
export type PainterModeKey = typeof PainterMode[keyof typeof PainterMode];

type RegionKey = string | null;
type FactionKey = string | null;
type MapOverlay = {
  key: string;
  label: string;
  visible: boolean;
};

const INITIAL_STATE = {
  campaign: DEFAULT_CAMPAIGN,
  factions: DEFAULT_ALL_FACTION_COMBINED,

  importedFactions: new Array<string>(),
  importedLookup: {},

  groups: DEFAULT_FACTION_GROUPS,
  ownership: DEFAULT_MAP_STATE,
  mode: PainterMode.Interactive as PainterModeKey,

  selectedRegion: null as string | null,
  selectedFaction: null as string | null,

  presets: DEFAULT_PRESETS,

  overlays: {} as { [key: string]: MapOverlay },

  config: {
    flyToEnabled: true,
  },
};

const painterSlice = createSlice({
  name: 'painter',
  initialState: INITIAL_STATE,
  reducers: {
    mapChanged: (state, action: PayloadAction<string>) => {
      const mapKey = action.payload as keyof typeof campaigns;
      state.campaign = campaigns[mapKey];
      state.selectedRegion = null;
      state.selectedFaction = null;
      state.presets = presets[mapKey];
      const defaultPreset = mapKey === 'mortal' ? DEFAULT_PRESET_MORTAL.ownership : DEFAULT_PRESET_VORTEX.ownership;
      state.ownership = Object.values(campaigns[mapKey].regions).reduce((accumulator: { [key: string]: any }, region: any) => {
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

    mapOverlayCreated: (state, action) => {
      const overlay = action.payload as MapOverlay;
      state.overlays[overlay.key] = overlay;
    },
    mapOverlayChanged: (state, action) => {
      const [overlayKey, visible] = action.payload;
      state.overlays[overlayKey].visible = visible;
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
  mapOverlayCreated,
  mapOverlayChanged,
  importMap
} = painterSlice.actions;

export default painterSlice.reducer;
