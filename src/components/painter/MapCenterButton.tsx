import React, { useCallback } from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FilterCenterFocus } from '@material-ui/icons';
import { useMapContext } from '../map/context';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
}));

const MapCenterButton = () => {
  const classes = useStyles();
  const context = useMapContext();

  const onClick = useCallback(() => {
    const { map, bounds } = context;
    map.flyToBounds(bounds, {
      animate: true,
      duration: 2
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fab size="medium" color="primary" className={classes.fab} onClick={onClick}>
      <FilterCenterFocus />
    </Fab>
  );
};

export default MapCenterButton;
