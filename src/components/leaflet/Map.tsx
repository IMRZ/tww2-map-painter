import React, { FC, useCallback } from 'react';

import L from 'leaflet';

type MapProps = {
  bounds: L.LatLngBoundsLiteral,
};

const Map: FC<MapProps> = ({ children, bounds }) => {
  const leafletMapRef = React.useRef<L.Map | null>(null);

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

    return () => {
      leafletMap.remove();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
