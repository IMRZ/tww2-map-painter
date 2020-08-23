import React, { FC } from 'react';
import L from 'leaflet';

type BaseLayerProps = {
  map?: React.MutableRefObject<L.Map>,
};

const BaseLayer: FC<BaseLayerProps> = ({ map }) => {
  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?

    const arr = new Array(1).fill(null).map(() => {
      return [Math.random() * 4000, Math.random() * 3000];
    });

    const markers = arr.map(([x, y]) => {
      const marker = L.marker([x, y]);
      return marker;
    });

    const layer = L.layerGroup(markers);
    leafletMap.addLayer(layer);

  }, [map]); // eslint-disable-line

  return null;
};

export default BaseLayer;
