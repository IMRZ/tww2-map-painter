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
  const selectRegion = (regionKey: string) => {
    if (mode === 'interactive') {
      dispatch(regionChanged(regionKey));
    } else {
      dispatch(regionOwnerChanged([regionKey, selectedFaction]))
    }
  };

  const selectOwner = (regionKey: string, factionKey: string) => dispatch(regionOwnerChanged([regionKey, factionKey]));
  const updateConfig = (config: any) => dispatch(updateConfiguration(config));
  const selectFaction = (factionKey: string | null) => dispatch(factionChanged(factionKey));

  const regionOptions = useMemo(() => {
    return Object.values(campaign.regions).sort((a: any, b: any) => a.province.name.localeCompare(b.province.name));
  }, [campaign.regions]) as any[];

  const factionOptions = useMemo(() => {
    const opts = Object.entries(groups).reduce(
      (accumulator: any[], [groupName, facts]) => {
        facts.forEach((factionKey: string) => {
          const f = factions[factionKey];
          accumulator.push({
            ...f,
            group: groupName,
          });
        });

        return accumulator;
      },
      []
    );

    if (importedFactions.length) {
      importedFactions.forEach((factionKey: string) => {
        const f = factions[factionKey];
        opts.unshift({
          ...f,
          group: 'Imported',
        });
      });
    }

    return opts;
  }, [factions, groups, importedFactions]);

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
