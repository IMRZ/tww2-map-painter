import React, { useCallback } from 'react';
import L from 'leaflet';
import { MapContext, BaseCampaign } from './context';

const style = {
  height: '100%',
  transition: 'opacity 1s',
  opacity: 0,
};

type MapProps<C extends BaseCampaign> = {
  children: React.ReactNode;
  campaign: C;
};

const Map = <C extends BaseCampaign>(props: MapProps<C>) => {
  const { children, campaign } = props;

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
    <div style={{ ...style, opacity: loaded ? 1 : 0 }}>
      <div ref={mapContainer} style={{ height: '100%', backgroundColor: 'transparent' }}>
        <MapContext.Provider value={contextState}>{children}</MapContext.Provider>
      </div>
    </div>
  );
};

export default Map;
