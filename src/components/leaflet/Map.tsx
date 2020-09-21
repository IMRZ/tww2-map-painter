import React, { FC, useCallback } from 'react';
import L from 'leaflet';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    transition: 'opacity 2s',
    opacity: 0
  },
  loaded: {
    opacity: 1,
  }
}));

type MapProps = {
  bounds: L.LatLngBoundsLiteral,
};

const Map: FC<MapProps> = ({ children, bounds }) => {
  const classes = useStyles();

  const leafletMapRef = React.useRef<L.Map | null>(null);
  const refs = React.useRef<any>({});
  const waitFor = React.useRef<Promise<any>[]>([]);

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

      leafletMapRef.current = leafletMap;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const leafletMap = leafletMapRef.current!;

    leafletMap.fitBounds(bounds);

    Promise.all(waitFor.current).then(() => {
      setLoaded(true);
    });

    return () => {
      leafletMap.remove();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const layers = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { map: leafletMapRef, refs, waitFor });
    } else {
      return null;
    }
  });

  return (
    <div className={clsx(classes.root, { [classes.loaded]: loaded })}>
      <div ref={mapContainer} style={{ height: '100%', backgroundColor: 'transparent' }}>
        {layers}
      </div>
    </div>
  );
};

export default Map;
