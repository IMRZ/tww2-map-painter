import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  regionChanged,
  regionOwnerChanged,
  updateConfiguration,
  modeChanged,
  factionChanged,
} from '../../../store/painter';

export function usePainter() {
  const groups = useAppSelector((state) => state.painter.groups);
  const importedFactions = useAppSelector((state) => state.painter.importedFactions);
  const ownership = useAppSelector((state) => state.painter.ownership);
  const mode = useAppSelector((state) => state.painter.mode);
  const selectedRegion = useAppSelector((state) => state.painter.selectedRegion);
  const campaign = useAppSelector((state) => state.painter.campaign);
  const selectedFaction = useAppSelector((state) => state.painter.selectedFaction);
  const factions = useAppSelector((state) => state.painter.factions);

  const dispatch = useAppDispatch();
  const selectMode = (mode: string) => dispatch(modeChanged(mode));
  const selectRegion = (regionKey: string | null) => {
    if (mode === 'interactive') {
      dispatch(regionChanged(regionKey));
    } else {
      dispatch(regionOwnerChanged([regionKey, selectedFaction]))
    }
  };

  const selectOwner = (regionKey: string, factionKey: string | null) => dispatch(regionOwnerChanged([regionKey, factionKey]));
  const updateConfig = (config: any) => dispatch(updateConfiguration(config));
  const selectFaction = (factionKey: string | null) => dispatch(factionChanged(factionKey));

  const regionOptions = useMemo(() => {
    return Object.values(campaign.regions).sort((a: any, b: any) => a.province.name.localeCompare(b.province.name));
  }, [campaign.regions]);

  const factionOptions = useMemo(() => {
    return Object.values(factions).sort((a, b) => a.rank - b.rank);
  }, [factions]);

  const options = {
    regions: regionOptions,
    factions: factionOptions,
  };

  return {
    mode,
    groups,
    factions,
    importedFactions,
    ownership,
    selectedRegion,
    campaign,
    selectedFaction,
    selectMode,
    selectRegion,
    selectOwner,
    updateConfig,
    selectFaction,
    config: {
      flyToEnabled: true,
    },

    options,
  };
}
