import React from 'react';
import L from 'leaflet';
import { useMapContext } from '../map/context';

const MapImageLayer = () => {
  const context = useMapContext();

  React.useEffect(() => {
    const { campaign, map, bounds, waitFor } = context;
    const imageOverlay = L.imageOverlay(campaign.map.image, bounds, {});

    const onLoad = new Promise<void>((resolve) => {
      imageOverlay.on('load', () => resolve());
    });
    waitFor.push(onLoad);

    map.addLayer(imageOverlay);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default MapImageLayer;
