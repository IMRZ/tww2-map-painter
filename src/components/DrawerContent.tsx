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
  toggleButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
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
        <span style={{ flex: 1 }}></span>
        <IconButton
          color="inherit"
          edge="end"
          onClick={toggleDrawer}
          className={classes.toggleButton}
        >
          <Close />
        </IconButton>
      </div>
      <Divider />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PainterPane />
      </div>
    </div>
  );
};

export default DrawerContent;
