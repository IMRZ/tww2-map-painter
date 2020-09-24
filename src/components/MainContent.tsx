import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAppSelector } from '../store';
import Preloader from './Preloader';
import Map from './map/Map';
import MapImageLayer from './map/MapImageLayer';
import MapImageTextLayer from './map/MapImageTextLayer';
import RegionMarkerLayer from './map/RegionMarkerLayer';
import RegionAreaLayer from './map/RegionAreaLayer';
import MapEventListener from './map/MapEventListener';
import MapCenterButton from './map/MapCenterButton';

const useStyles = makeStyles(() => ({
  map: {
    position: 'relative',
    flex: 1,
  },
}));

const MainContent = () => {
  const campaign = useAppSelector((state) => state.painter.campaign);
  const classes = useStyles();

  return (
    <div className={classes.map} key={campaign.key}>
      <Preloader assets={[campaign.map.image, campaign.map.imageText]}>
        <Map campaign={campaign}>
          <MapImageLayer />
          <MapImageTextLayer />
          <RegionAreaLayer />
          <RegionMarkerLayer />
          <MapEventListener />
          <MapCenterButton />
        </Map>
      </Preloader>
    </div>
  )
};

export default MainContent;
