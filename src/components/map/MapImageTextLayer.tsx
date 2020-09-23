import React from 'react';
import L from 'leaflet';
import { useMapContext } from './map';
import { useAppDispatch } from '../../store';
import { mapOverlayCreated } from '../../store/painter';

const MapImageTextLayer = () => {
  const dispatch = useAppDispatch();
  const context = useMapContext();

  React.useEffect(() => {
    const { map, layers, campaign, bounds, waitFor } = context;

    map.createPane('labels');
    map.getPane('labels')?.style.setProperty('zIndex', '450');
    map.getPane('labels')?.style.setProperty('pointerEvents', 'none');
    const imageOverlay = L.imageOverlay(campaign.map.imageText, bounds, { pane: 'labels' });
    map.addLayer(imageOverlay);

    const onLoad = new Promise<void>((resolve) => {
      imageOverlay.on('load', () => resolve());
    });
    waitFor.push(onLoad);

    layers['map-text'] = imageOverlay;
    dispatch(mapOverlayCreated({
      key: 'map-text',
      label: 'map-text',
      visible: true,
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default MapImageTextLayer;
