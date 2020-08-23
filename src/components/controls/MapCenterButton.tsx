import React, { FC } from 'react';
import L from 'leaflet';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FilterCenterFocus } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
}));

type MapCenterButtonProps = {
  map?: React.MutableRefObject<L.Map>,
};

const MapCenterButton: FC<MapCenterButtonProps> = ({ map }) => {
  const classes = useStyles();

  const onClick = () => {
    const leafletMap = map?.current;

    if (leafletMap) {
      // @ts-ignore
      leafletMap.flyToBounds(leafletMap.options.maxBounds);
    }
  };

  return (
    <Fab size="medium" className={classes.fab} onClick={onClick} >
      <FilterCenterFocus />
    </Fab>
  );
};

export default MapCenterButton;
