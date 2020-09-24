import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Toolbar } from '@material-ui/core';
import { Tune, GitHub } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  github: {
    [theme.breakpoints.up('md')]: {
      marginRight: -12,
    },
  },
  toggleButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

type BarContentProps = {
  toggleDrawer: () => void;
};

function BarContent(props: BarContentProps) {
  const { toggleDrawer } = props;
  const classes = useStyles();

  return (
    <Toolbar>
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
      <IconButton
        color="inherit"
        edge="end"
        onClick={toggleDrawer}
        className={classes.toggleButton}
      >
        <Tune />
      </IconButton>
    </Toolbar>
  );
}

export default BarContent;
