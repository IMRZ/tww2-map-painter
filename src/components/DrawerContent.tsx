import React from 'react';
import { IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import CampaignSelect from './controls/CampaignSelect';
import PainterPane from './controls/PainterPane';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    ...theme.mixins.toolbar,
  },
  fillSpace: {
    flexGrow: 1,
  },
  toggleButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  scroller: {
    height: '100%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    '&::-webkit-scrollbar-thumb:vertical': {
      width: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
  }
}));

type DrawerContentProps = {
  toggleDrawer: () => void;
};

const DrawerContent = (props: DrawerContentProps) => {
  const { toggleDrawer } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <CampaignSelect />
        <span className={classes.fillSpace}></span>
        <IconButton
          className={classes.toggleButton}
          color="inherit"
          edge="end"
          onClick={toggleDrawer}
        >
          <Close />
        </IconButton>
      </div>
      <Divider />
      <div className={classes.scroller}>
        <PainterPane />
      </div>
    </div>
  );
};

export default DrawerContent;
