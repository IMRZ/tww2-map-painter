import React from 'react';
import { ThemeProvider, CssBaseline, Drawer, createMuiTheme, AppBar, Toolbar, IconButton, Typography, Divider } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Tune, GitHub, Map as MapIcon, Close } from '@material-ui/icons';

import clsx from 'clsx';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Map from './components/leaflet/Map';
import ImageLayer from './components/leaflet/ImageLayer';

import MapListener from './components/leaflet/MapListener';
import RegionMarkers from './components/leaflet/RegionMarkers';
import RegionSvgLayer from './components/leaflet/RegionSvgLayer';

import MapSelect from './components/controls/MapSelect';
import MapCenterButton from './components/controls/MapCenterButton';
import PainterPane from './components/controls/PainterPane';

import { useAppSelector, useAppDispatch } from './store';
import { updateConfiguration } from './store/factions';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey[500],
    },
  },
});

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: 360,
  },
  drawerPaper: {
    width: 360,
    backgroundColor: 'transparent',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  map: {
    position: 'relative',
    flex: 1
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
  hide: {
    display: 'none',
  },
}));

function App() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const selectedMap = useAppSelector((state) => state.painter.selectedMap);
  const open = useAppSelector((state) => state.painter.config.drawerOpen);
  const bounds = [[0, 0], [selectedMap.height, selectedMap.width]] as L.LatLngBoundsLiteral;

  const handleDrawerOpen = () => {
    dispatch(updateConfiguration({ drawerOpen: true }));
  };

  const handleDrawerClose = () => {
    dispatch(updateConfiguration({ drawerOpen: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        color="default"
        position="fixed"
        elevation={0}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton className={classes.menuButton} edge="start" color="inherit" disabled>
            <MapIcon style={{ color: 'white' }} />
          </IconButton>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1em' }}>
            <Typography variant="h6" noWrap>Map Painter</Typography>
            <Typography variant="subtitle2" color="textSecondary" noWrap>Total War: Warhammer II</Typography>
          </div>
          <MapSelect />
          <span style={{ flexGrow: 1 }}></span>
          <IconButton color="inherit" component="a" href="https://github.com/IMRZ/tww2-map-painter" target="_blank" rel="noopener noreferrer">
            <GitHub />
          </IconButton>
          <IconButton edge="end" color="inherit" onClick={handleDrawerOpen} className={clsx(open && classes.hide)}>
            <Tune />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Toolbar />
        <div className={classes.map} key={selectedMap.key}>
          <Map bounds={bounds}>
            <ImageLayer image={selectedMap.map} bounds={bounds} />
            <RegionSvgLayer selectedMap={selectedMap} bounds={bounds} />
            <RegionMarkers selectedMap={selectedMap} />
            <MapListener selectedMap={selectedMap} />
            <MapCenterButton />
          </Map>
        </div>
      </main>
      <Drawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <Close />
          </IconButton>
        </div>
        <Divider />
        <PainterPane />
      </Drawer>
    </ThemeProvider>
  );
}

export default App;
