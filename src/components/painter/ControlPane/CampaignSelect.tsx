import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useAppSelector, useAppDispatch } from '../../../store';
import { mapChanged } from '../../../store/painter';
import campaigns from '../../../data/campaigns';

const CampaignSelect = () => {
  const dispatch = useAppDispatch();
  const selectedCampaign = useAppSelector((state) => state.painter.campaign);
  const selectMap = (key: string) => dispatch(mapChanged(key));

  return (
    <FormControl size="small" variant="outlined">
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
