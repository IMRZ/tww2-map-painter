import React, { FC, useMemo } from 'react';
import { Box, TextField, Tabs, Tab, List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, Switch, Divider, ListItemIcon } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Layers } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useAppSelector } from '../../store';
import { useStore } from '../../use/store';

import FactionAutocomplete from './FactionAutocomplete';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    '&::-webkit-scrollbar-thumb:vertical': {
      margin: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.24)',
    }
  },
  content: {
    padding: theme.spacing(2, 2),
    '& .MuiTextField-root': {
      margin: '0.5em 0',
    },
    '& .MuiFormControl-root': {
      margin: '0.5em 0',
    },
  }
}));

const PainterPane: FC = () => {
  const classes = useStyles();
  const {
    painter,
    getFaction,
    selectRegion,
    selectedRegion,
    selectOwner,
    updateConfig,
    importMap,
    selectMode,
    selectFaction,
  } = useStore();

  const selectedMap = useAppSelector((state) => state.painter.selectedMap);

  const regionOptions = Object.values(selectedMap.regions).reduce((accumulator: any[], region: any) => {
    accumulator.push({
      key: region.key,
      name: region.name,
      group: region.province.name,
    });
    return accumulator;
  }, []);
  const region = regionOptions.find((r) => r.key === selectedRegion) ?? null;

  const factionOptions = useMemo(() => {
    const options = Object.entries(painter.groups).reduce((accumulator: any[], [groupName, factions]) => {
      factions.forEach((factionKey: string) => {
        const faction = getFaction(factionKey);
        accumulator.push({
          ...faction,
          group: groupName,
        });
      });

      return accumulator;
    }, []);

    if (painter.importedFactions.length) {
      painter.importedFactions.forEach((factionKey: string) => {
        const faction = getFaction(factionKey);
        options.unshift({
          ...faction,
          group: 'Imported',
        })
      });
    }

    return options;
  }, [painter.importedFactions]); // eslint-disable-line react-hooks/exhaustive-deps

  const faction = factionOptions.find((f) => f.key === painter.ownership[region?.key]) ?? null;
  const painterFaction = factionOptions.find((f) => f.key === painter.selectedFaction) ?? null;

  return (
    <Box className={classes.root}>
      <Tabs variant="fullWidth" indicatorColor="primary" value={painter.mode} onChange={(event, mode) => selectMode(mode)}>
        <Tab label="Interactive mode" value="interactive" />
        <Tab label="Paint mode" value="painter" />
      </Tabs>
      <div style={{ height: '25%' }}>
          {painter.mode === 'interactive' && (
            <>
              <div className={classes.content}>
                <Autocomplete
                  size="small"
                  options={regionOptions}
                  value={region}
                  onChange={(e, option) => selectRegion(option?.key ?? null)}
                  groupBy={(option) => option.group}
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
                  options={factionOptions}
                  value={faction}
                  disabled={!region}
                  showFactionIcon={!!region}
                  placeholder={region ? 'Abandoned' : 'Select a region first'}
                  onChange={(e, option) => selectOwner(region?.key, option?.key ?? null)}
                />
              </div>
              <List>
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
              </List>
            </>
          )}
          {painter.mode === 'painter' && (
            <div className={classes.content}>
              <FactionAutocomplete
                options={factionOptions}
                value={painterFaction}
                label="Selected faction"
                placeholder="Abandoned"
                helperText="No faction selected abandons region."
                onChange={(e, option) => selectFaction(option?.key ?? null)}
              />
            </div>
          )}
      </div>

      <Divider />

      <List>
        <ListItem dense button onClick={() => {
            const fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', '.json');

            fileInput.onchange = (e) => {
              const reader = new FileReader();
              console.log(reader);
              reader.onload = (event) => {
                // @ts-ignore
                const mapJson = JSON.parse(event.target.result);
                importMap(mapJson);
              };
              reader.onerror = (err) => console.log(err);
              // @ts-ignore
              reader.readAsText(e.target.files[0]);
            };

            fileInput.click();
          }}>
          <ListItemText
            primary={'Import'}
            secondary={'Click here to import a map file'}
          />
        </ListItem>
        <ListItem
          dense
          button
          onClick={() => {
            const a = document.createElement('a');
            const json = JSON.stringify(painter.ownership, null, 2);
            a.href = URL.createObjectURL(new Blob([json], { type: 'text/json' }));
            a.download = 'map.json';
            a.click();
          }}
        >
          <ListItemText
            primary={'Export'}
            secondary={'Click here to export a map file'}
          />
        </ListItem>
      </List>

      <Divider />

      <List subheader={<ListSubheader>Map presets</ListSubheader>}>
        {Object.entries(painter.presets).map(([key, preset]: [string, any]) => (
          <ListItem key={key} dense button onClick={() => importMap(preset.ownership)}>
            <ListItemText
              primary={preset.label}
              secondary={preset.description}
            />
          </ListItem>
        ))}
      </List>

      <Divider />


      <List subheader={<ListSubheader>Map layers</ListSubheader>}>
        <ListItem dense>
          <ListItemIcon>
            <Layers />
          </ListItemIcon>
          <ListItemText primary="Display icons" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              onChange={() => {}}
              checked={false}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem dense>
          <ListItemIcon>
            <Layers />
          </ListItemIcon>
          <ListItemText primary="Display regions" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              onChange={() => {}}
              checked={false}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem dense>
          <ListItemIcon>
            <Layers />
          </ListItemIcon>
          <ListItemText primary="Display map labels" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              onChange={() => {}}
              checked={false}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Box>
  );
};

export default PainterPane;
