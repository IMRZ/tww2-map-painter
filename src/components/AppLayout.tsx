import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Hidden,
  Drawer,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Tune, Close } from '@material-ui/icons';
import appTheme from './app-theme';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
  },
  github: {
    [theme.breakpoints.up('md')]: {
      marginRight: -12,
    },
  },
  mobileButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#303030',
    '&::-webkit-scrollbar': {
      width: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    '&::-webkit-scrollbar-thumb:vertical': {
      margin: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.24)',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
}));

type AppLayoutProps = {
  content: React.ReactElement;
  topbarContent: React.ReactElement;
  drawerContent: React.ReactElement;
};

const AppLayout = (props: AppLayoutProps) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.mobileButton}
        >
          <Close />
        </IconButton>
      </Toolbar>
      <Divider />
      {props.drawerContent}
    </>
  );

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="fixed" color="default" elevation={0} className={classes.appBar}>
          <Toolbar>
            {props.topbarContent}
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              className={classes.mobileButton}
            >
              <Tune />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Toolbar />
          {props.content}
        </main>
        <nav className={classes.drawer}>
          <Hidden mdUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawerContent}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              anchor="right"
              open
            >
              {drawerContent}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
