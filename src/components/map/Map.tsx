import React, { useCallback } from 'react';
import L from 'leaflet';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { MapContext } from './map';
import { Campaign } from '../../types/Campaign';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    transition: 'opacity 1s',
    opacity: 0,
  },
  loaded: {
    opacity: 1,
  },
}));

type MapProps = {
  children: React.ReactNode;
  campaign: Campaign;
};

const Map = (props: MapProps) => {
  const { children, campaign } = props;
  const classes = useStyles();

  const bounds = [
    [0, 0],
    [campaign.map.height, campaign.map.width],
  ] as L.LatLngBoundsLiteral;

  const contextState = React.useRef({
    map: null as any,
    layers: {} as any,
    waitFor: [] as Promise<void>[],
    bounds,
    campaign,
  });

  const [loaded, setLoaded] = React.useState(false);

  const mapContainer = useCallback((el) => {
    if (el !== null) {
      const leafletMap = L.map(el, {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        inertiaMaxSpeed: Infinity,
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: false,
        maxBounds: bounds,
        zoomSnap: 0.2,
        zoomAnimation: true,
        markerZoomAnimation: true,
      });

      contextState.current.map = leafletMap;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const map = contextState.current.map!;
    const waitFor = contextState.current.waitFor!;

    map.fitBounds(bounds);

    Promise.all(waitFor).then(() => {
      setLoaded(true);
    });

    return () => {
      map.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={clsx(classes.root, { [classes.loaded]: loaded })}>
      <div ref={mapContainer} style={{ height: '100%', backgroundColor: 'transparent' }}>
        <MapContext.Provider value={contextState}>{children}</MapContext.Provider>
      </div>
    </div>
  );
};

export default Map;
