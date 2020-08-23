import React, { FC, useCallback } from 'react';

import L from 'leaflet';

type MapProps = {
  bounds: L.LatLngBoundsLiteral,
};

const Map: FC<MapProps> = ({ children, bounds }) => {
  const leafletMapRef = React.useRef<L.Map | null>(null);

  const mapContainer = useCallback((el) => {
    if (el !== null) {
      const map = L.map(el, {
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

      leafletMapRef.current = map;
    }
  }, []); // eslint-disable-line

  // runs once after render, after all children done setting up
  React.useEffect(() => {
    const leafletMap = leafletMapRef.current!; // TODO: let it throw?
    leafletMap.fitBounds(bounds);
  }, []); // eslint-disable-line

  // baselayers
  // overlays

  const layers = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { map: leafletMapRef });
    } else {
      return null;
    }
  });

  return (
    <div ref={mapContainer} style={{ height: '100%', backgroundColor: 'transparent' }}>
      {layers}
    </div>
  );
};

export default Map;
