import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAppSelector } from '../store';
import Preloader from './Preloader';
import Map from './map/Map';
import MapImageLayer from './painter/MapImageLayer';
import MapImageTextLayer from './painter/MapImageTextLayer';
import RegionMarkerLayer from './painter/RegionMarkerLayer';
import RegionAreaLayer from './painter/RegionAreaLayer';
import MapEventListener from './painter/MapEventListener';
import MapCenterButton from './painter/MapCenterButton';

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
          {/* <MapImageTextLayer /> */}
          {/* <RegionAreaLayer /> */}
          <RegionMarkerLayer />
          <MapEventListener />
          <MapCenterButton />
        </Map>
      </Preloader>
    </div>
  )
};

export default MainContent;
