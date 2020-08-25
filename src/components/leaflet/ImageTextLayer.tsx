import React, { FC } from 'react';
import L from 'leaflet';

import { useAppDispatch } from '../../store';
import { mapOverlayCreated } from '../../store/factions';


type ImageTextLayerProps = {
  map?: React.MutableRefObject<L.Map>,
  refs?: any,
  image: string,
  bounds: L.LatLngBoundsLiteral,
};

const ImageTextLayer: FC<ImageTextLayerProps> = ({ map, refs, image, bounds }) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?

    leafletMap.createPane('labels');
    leafletMap.getPane('labels')?.style.setProperty('zIndex', '450');
    leafletMap.getPane('labels')?.style.setProperty('pointerEvents', 'none');
    const imageOverlay = L.imageOverlay(image, bounds, { pane: 'labels' });
    leafletMap.addLayer(imageOverlay);

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
