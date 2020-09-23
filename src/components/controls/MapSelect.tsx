import React, { FC } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAppSelector, useAppDispatch } from '../../store';
import { mapChanged } from '../../store/painter';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
}));

const MapSelect: FC = () => {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const selectedCampaign = useAppSelector((state) => state.painter.campaign);
  const selectMap = (mapKey: string) => dispatch(mapChanged(mapKey));

  return (
    <FormControl size="small" variant="outlined" className={classes.formControl}>
      <InputLabel>Campaign</InputLabel>
      <Select label="Campaign" value={selectedCampaign.key} onChange={(e) => selectMap(e.target.value as string)}>
        <MenuItem value={'mortal'}>Mortal Empires</MenuItem>
        <MenuItem value={'vortex'}>Eye of the Vortex</MenuItem>
      </Select>
    </FormControl>
  );
};

export default MapSelect;
