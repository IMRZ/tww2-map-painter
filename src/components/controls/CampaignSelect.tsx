import React, { FC } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAppSelector, useAppDispatch } from '../../store';
import { mapChanged } from '../../store/painter';
import campaigns from '../../data/campaigns';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
}));

const CampaignSelect: FC = () => {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const selectedCampaign = useAppSelector((state) => state.painter.campaign);
  const selectMap = (key: string) => dispatch(mapChanged(key));

  return (
    <FormControl size="small" variant="outlined" className={classes.formControl}>
      <InputLabel>Campaign</InputLabel>
      <Select
        label="Campaign"
        value={selectedCampaign.key}
        onChange={(e) => selectMap(e.target.value as string)}
      >
        {Object.values(campaigns).map((campaign) => (
          <MenuItem key={campaign.key} value={campaign.key}>
            {campaign.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CampaignSelect;
