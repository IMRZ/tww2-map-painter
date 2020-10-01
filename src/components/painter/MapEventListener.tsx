import React from 'react';
import { useAppSelector } from '../../store';
import { useMapContext } from '../map/context';
import { Campaign } from '../../data/campaigns';

const MapEventListener = () => {
  const context = useMapContext<Campaign>();

  const selectedRegion = useAppSelector((state) => state.painter.selectedRegion);
  const isFlyToEnabled = useAppSelector((state) => state.painter.config.flyToEnabled);
  const painterOverlays = useAppSelector((state) => state.map.overlays);

  React.useEffect(() => {
    const { map, campaign, bounds } = context;
    const isLeafletMapReady = map.getZoom() !== undefined;

    if (isFlyToEnabled && isLeafletMapReady) {
      if (selectedRegion) {
        const region = campaign.regions[selectedRegion];
        map.flyTo([region.settlement.y, region.settlement.x], 1, {
          animate: true,
          duration: 2
        });
      } else {
        map.flyToBounds(bounds, {
          animate: true,
          duration: 2
        });
      }
    }
  }, [selectedRegion]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const { map, layers } = context;
    const isLeafletMapReady = map.getZoom() !== undefined;

    if (isLeafletMapReady) {
      Object.values(painterOverlays).forEach((overlay) => {
        const layer = layers[overlay.key];
        if (overlay.visible) {
          map.addLayer(layer);
        } else {
          map.removeLayer(layer);
        }
      });
    }
  }, [painterOverlays]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default MapEventListener;
