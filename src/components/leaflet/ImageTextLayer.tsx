import React, { FC } from 'react';
import L from 'leaflet';

import { useAppDispatch } from '../../store';
import { mapOverlayCreated } from '../../store/painter';


type ImageTextLayerProps = {
  map?: React.MutableRefObject<L.Map>,
  refs?: any,
  image: string,
  bounds: L.LatLngBoundsLiteral,
  waitFor?: React.MutableRefObject<Promise<any>[]>,
};

const ImageTextLayer: FC<ImageTextLayerProps> = ({ map, refs, image, bounds, waitFor }) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?

    leafletMap.createPane('labels');
    leafletMap.getPane('labels')?.style.setProperty('zIndex', '450');
    leafletMap.getPane('labels')?.style.setProperty('pointerEvents', 'none');
    const imageOverlay = L.imageOverlay(image, bounds, { pane: 'labels' });
    leafletMap.addLayer(imageOverlay);

    const imageOverlayLoaded = new Promise((resolve) => {
      imageOverlay.on('load', () => resolve());
    });
    waitFor?.current.push(imageOverlayLoaded);

    refs.current['map-text'] = imageOverlay;
    dispatch(mapOverlayCreated({
      key: 'map-text',
      label: 'map-text',
      visible: true,
    }));
  }, [map]); // eslint-disable-line

  return null;
};

export default ImageTextLayer;
