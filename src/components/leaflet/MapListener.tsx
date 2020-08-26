import React, { FC } from 'react';
import L from 'leaflet';

import { useStore } from '../../use/store';
import { useAppSelector } from '../../store';

type MapListenerProps = {
  map?: React.MutableRefObject<L.Map>,
  refs?: any,
  selectedMap: any,
};

const MapListener: FC<MapListenerProps> = ({ map, refs, selectedMap }) => {
  const state = useStore();

  const drawerOpen = useAppSelector((state) => state.painter.config.drawerOpen);
  const overlays = useAppSelector((state) => state.painter.overlays);

  React.useEffect(() => {
    const leafletMap = map?.current;

    if (state.painter.config.flyToEnabled && leafletMap && leafletMap.getZoom() !== undefined) {
      if (state.selectedRegion) {
        const region = selectedMap.regions[state.selectedRegion];
        leafletMap.flyTo([region.settlement.y, region.settlement.x], 1);
      } else {
        // @ts-ignore
        leafletMap.flyToBounds(leafletMap.options.maxBounds);
      }
    }
  }, [state.selectedRegion]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const leafletMap = map?.current;

    if (leafletMap && leafletMap.getZoom() !== undefined) {
      setTimeout(() => leafletMap.invalidateSize(), 200);
    }
  }, [drawerOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const leafletMap = map?.current;

    if (leafletMap && leafletMap.getZoom() !== undefined) {
      Object.values(overlays).forEach((overlay) => {
        const layer = refs.current[overlay.key];
        if (overlay.visible) {
          leafletMap.addLayer(layer);
        } else {
          leafletMap.removeLayer(layer);
        }
      });
    }
  }, [overlays]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default MapListener;
