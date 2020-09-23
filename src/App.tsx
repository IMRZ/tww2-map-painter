import React from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GitHub } from '@material-ui/icons';
import { useAppSelector } from './store';

import MapSelect from './components/controls/MapSelect';
import PainterPane from './components/controls/PainterPane';
import AppLayout from './components/AppLayout';

import CampaignMap from './components/CampaignMap';

const useStyles = makeStyles((theme) => ({
  github: {
    [theme.breakpoints.up('md')]: {
      marginRight: -12,
    },
  },
}));

function App() {
  const classes = useStyles();
  const selectedCampaign = useAppSelector((state) => state.painter.campaign);

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

  const mainContent = <CampaignMap campaign={selectedCampaign} />;
  const drawerContent = <PainterPane />;

  return (
    <AppLayout
      mainContent={mainContent}
      topbarContent={topbarContent}
      drawerContent={drawerContent}
    />
  );
}

export default App;
