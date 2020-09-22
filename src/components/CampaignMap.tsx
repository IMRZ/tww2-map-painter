import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Preloader from './Preloader';


import Map from './leaflet/Map';
import MapListener from './leaflet/MapListener';
import ImageLayer from './leaflet/ImageLayer';
import ImageTextLayer from './leaflet/ImageTextLayer';
import RegionMarkers from './leaflet/RegionMarkers';
import RegionSvgLayer from './leaflet/RegionSvgLayer';
import MapCenterButton from './leaflet/MapCenterButton';

const useStyles = makeStyles((theme) => ({
  map: {
    position: 'relative',
    flex: 1,
  },
}));

type CampaignMapProps = {
  campaign: any;
};

const CampaignMap = (props: CampaignMapProps) => {
  const { campaign } = props;
  const classes = useStyles();

  return (
    <div className={classes.map} key={campaign.key}>
      <Preloader assets={[campaign.map, campaign.mapText]}>
        <Map campaign={campaign}>
          <ImageLayer />
          <ImageTextLayer />
          <RegionSvgLayer />
          <RegionMarkers />
          <MapListener />
          <MapCenterButton />
        </Map>
      </Preloader>
    </div>
  )
};

export default CampaignMap;
