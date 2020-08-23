import React, { FC } from 'react';
import L from 'leaflet';

type ImageLayerProps = {
  map?: React.MutableRefObject<L.Map>,
  image: string,
  bounds: L.LatLngBoundsLiteral,
};

const ImageLayer: FC<ImageLayerProps> = ({ map, image, bounds }) => {
  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?
    const imageOverlay = L.imageOverlay(image, bounds, {});
    leafletMap.addLayer(imageOverlay);
  }, [map]); // eslint-disable-line

  return null;
};

export default ImageLayer;
