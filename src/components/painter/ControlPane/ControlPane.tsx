import React from 'react';
import {
  TextField,
  Tabs,
  Tab,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  ListItemIcon,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Layers } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../../../store';
import FactionAutocomplete from './FactionAutocomplete';

import { importMap } from '../../../store/painter';
import { overlayChanged } from '../../map/reducer';
import { usePainter } from './painter';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    padding: theme.spacing(2, 2),
    '& .MuiTextField-root': {
      margin: '0.5em 0',
    },
    '& .MuiFormControl-root': {
      margin: '0.5em 0',
    },
  },
}));

const ControlPane = () => {
  const classes = useStyles();

  const painter = usePainter();
  const selectMode = painter.selectMode;
  const selectRegion = painter.selectRegion;
  const selectOwner = painter.selectOwner;
  const updateConfig = painter.updateConfig;
  const selectFaction = painter.selectFaction;

  const regions = painter.campaign.regions;
  const factions = painter.factions;

  const selectedRegion = painter.selectedRegion !== null ? regions[painter.selectedRegion] : null;
  const selectedFaction = selectedRegion !== null ?  factions[painter.ownership[selectedRegion.key]] : null;
  const selectedPainterFaction = painter.selectedFaction !== null ? factions[painter.selectedFaction] : null;

  return (
    <div className={classes.root}>
      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        value={painter.mode}
        onChange={(e, mode) => selectMode(mode)}
      >
        <Tab label="Interactive mode" value="interactive" />
        <Tab label="Paint mode" value="painter" />
      </Tabs>
      <div style={{ height: 220 }}>
        {painter.mode === 'interactive' && (
          <>
            <div className={classes.content}>
              <Autocomplete
                size="small"
                options={painter.options.regions}
                value={selectedRegion}
                onChange={(e, option) => selectRegion(option?.key ?? null)}
                groupBy={(option) => option.province.name}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selected region"
                    variant="outlined"
                    placeholder="Select a region to edit"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <FactionAutocomplete
                options={painter.options.factions}
                value={selectedFaction}
                disabled={!selectedRegion}
                showFactionIcon={!!selectedRegion}
                placeholder={selectedRegion ? 'Abandoned' : 'Select a region first'}
                onChange={(e, option) => selectedRegion && selectOwner(selectedRegion.key, option?.key ?? null)}
              />
            </div>
            {/* <List>
              <ListItem dense>
                <ListItemText primary="Enable fly-to animation" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    onChange={() => updateConfig({ flyToEnabled: !painter.config.flyToEnabled })}
                    checked={painter.config.flyToEnabled}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List> */}
          </>
        )}
        {painter.mode === 'painter' && (
          <div className={classes.content}>
            <FactionAutocomplete
              options={painter.options.factions}
              value={selectedPainterFaction}
              label="Selected faction"
              placeholder="Abandoned"
              helperText="No faction selected abandons region."
              onChange={(e, option) => selectFaction(option?.key ?? null)}
            />
          </div>
        )}
      </div>

      <Divider />
      <PainterSectionImportExport />
      <Divider />
      <PainterSectionPresets />
      <Divider />
      <PainterSectionOverlays />
    </div>
  );
};

const PainterSectionImportExport = () => {
  const ownership = useAppSelector((state) => state.painter.ownership);

  const dispatch = useAppDispatch();
  const importJson = (json: any) => {
    dispatch(importMap(json));
  };

  return (
    <List>
      <ListItem
        dense
        button
        onClick={() => {
          const fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', '.json');

          fileInput.onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              // @ts-ignore
              const mapJson = JSON.parse(event.target.result);
              importJson(mapJson);
            };
            reader.onerror = (err) => console.log(err);
            // @ts-ignore
            reader.readAsText(e.target.files[0]);
          };

          fileInput.click();
        }}
      >
        <ListItemText primary={'Import'} secondary={'Click here to import a map file'} />
      </ListItem>
      <ListItem
        dense
        button
        onClick={() => {
          const a = document.createElement('a');
          const json = JSON.stringify(ownership, null, 2);
          a.href = URL.createObjectURL(new Blob([json], { type: 'text/json' }));
          a.download = 'map.json';
          a.click();
        }}
      >
        <ListItemText primary={'Export'} secondary={'Click here to export a map file'} />
      </ListItem>
    </List>
  );
};

const PainterSectionPresets = () => {
  const presets = useAppSelector((state) => state.painter.presets);

  const dispatch = useAppDispatch();
  const selectPreset = (preset: any) => {
    dispatch(importMap(preset.ownership));
  };

  return (
    <List subheader={<ListSubheader disableSticky>Map presets</ListSubheader>}>
      {Object.entries(presets).map(([key, preset]: [string, any]) => (
        <ListItem key={key} dense button onClick={() => selectPreset(preset)}>
          <ListItemText primary={preset.label} secondary={preset.description} />
        </ListItem>
      ))}
    </List>
  );
};

const PainterSectionOverlays = () => {
  const overlays = useAppSelector((state) => state.map.overlays);

  const dispatch = useAppDispatch();
  const setOverlayVisible = (overlayKey: string, visible: boolean) => {
    dispatch(overlayChanged([overlayKey, visible]));
  };

  return (
    <List subheader={<ListSubheader disableSticky>Map layers</ListSubheader>}>
      {Object.values(overlays).map((overlay) => (
        <ListItem key={overlay.key} dense>
          <ListItemIcon>
            <Layers />
          </ListItemIcon>
          <ListItemText primary={overlay.label} />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              onChange={(e, checked) => setOverlayVisible(overlay.key, checked)}
              checked={overlay.visible}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ControlPane;
