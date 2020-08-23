import { useAppDispatch, useAppSelector } from '../store';
import {
  regionChanged,
  regionOwnerChanged,
  updateConfiguration,
  importMap,
  modeChanged,
  factionChanged
} from '../store/factions';

export function useStore() {
  const dispatch = useAppDispatch();

  const painter = useAppSelector((state) => state.painter);


  const importedFactions = useAppSelector((state) => state.painter.importedFactions);

  const getFaction = (factionKey: string): any => {
    return painter.factions[factionKey];
  };

  const selectedRegion = useAppSelector((state) => state.painter.selectedRegion);

  return {
    painter,

    selectedRegion,
    selectRegion: (regionKey: string) => {
      if (painter.mode === 'interactive') {
        dispatch(regionChanged(regionKey));
      } else {
        dispatch(regionOwnerChanged([regionKey, painter.selectedFaction]))
      }
    },
    selectOwner: (regionKey: string, factionKey: string) => {
      dispatch(regionOwnerChanged([regionKey, factionKey]));
    },
    selectFaction: (factionKey: string | null) => {
      dispatch(factionChanged(factionKey));
    },

    updateConfig: (config: any) => {
      dispatch(updateConfiguration(config));
    },

    importMap: (map: any) => {
      dispatch(importMap(map));
    },

    selectMode: (mode: string) => {
      dispatch(modeChanged(mode));
    },

    importedFactions,

    getFaction,
  };
}
