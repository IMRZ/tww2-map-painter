import React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GitHub } from '@material-ui/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSelector } from './store';
import Map from './components/leaflet/Map';
import ImageLayer from './components/leaflet/ImageLayer';
import ImageTextLayer from './components/leaflet/ImageTextLayer';
import MapListener from './components/leaflet/MapListener';
import RegionMarkers from './components/leaflet/RegionMarkers';
import RegionSvgLayer from './components/leaflet/RegionSvgLayer';
import Preloader from './components/Preloader';
import MapSelect from './components/controls/MapSelect';
import MapCenterButton from './components/controls/MapCenterButton';
import PainterPane from './components/controls/PainterPane';

import AppLayout from './components/AppLayout';

const useStyles = makeStyles((theme) => ({
  map: {
    position: 'relative',
    flex: 1,
  },
  github: {
    [theme.breakpoints.up('md')]: {
      marginRight: -12,
    },
  },
}));

function App() {
  const classes = useStyles();
  const selectedMap = useAppSelector((state) => state.painter.selectedMap);
  const bounds = [
    [0, 0],
    [selectedMap.height, selectedMap.width],
  ] as L.LatLngBoundsLiteral;

  const topbarContent = (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: '1em',
        }}
      >
        <Typography variant="h6" noWrap>
          Map Painter
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" noWrap>
          Total War: Warhammer II
        </Typography>
      </div>
      <MapSelect />
      <span style={{ flex: 1 }}></span>
      <IconButton
        className={classes.github}
        color="inherit"
        component="a"
        href="https://github.com/IMRZ/tww2-map-painter"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHub />
      </IconButton>
    </>
  );

  const content = (
    <div className={classes.map} key={selectedMap.key}>
      <Preloader assets={[selectedMap.map, selectedMap.mapText]}>
        <Map bounds={bounds}>
          <ImageLayer image={selectedMap.map} bounds={bounds} />
          <ImageTextLayer image={selectedMap.mapText} bounds={bounds} />
          <RegionSvgLayer selectedMap={selectedMap} bounds={bounds} />
          <RegionMarkers selectedMap={selectedMap} />
          <MapListener selectedMap={selectedMap} />
          <MapCenterButton />
        </Map>
      </Preloader>
    </div>
  );

  const drawerContent = <PainterPane />;

  return (
    <AppLayout
      content={content}
      topbarContent={topbarContent}
      drawerContent={drawerContent}
    />
  );
}

export default App;
