import React, { FC } from 'react';
import L from 'leaflet';

type ImageLayerProps = {
  map?: React.MutableRefObject<L.Map>,
  image: string,
  bounds: L.LatLngBoundsLiteral,
  waitFor?: React.MutableRefObject<Promise<any>[]>,
};

const ImageLayer: FC<ImageLayerProps> = ({ map, image, bounds, waitFor }) => {
  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?
    const imageOverlay = L.imageOverlay(image, bounds, {});

    const imageOverlayLoaded = new Promise((resolve) => {
      imageOverlay.on('load', () => resolve());
    });
    waitFor?.current.push(imageOverlayLoaded);

    leafletMap.addLayer(imageOverlay);
  }, [map]); // eslint-disable-line

  return null;
};

export default ImageLayer;
