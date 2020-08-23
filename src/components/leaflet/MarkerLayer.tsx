import React, { FC, useEffect, useState } from 'react';
import ReactDom from 'react-dom';

import L from 'leaflet';

const MakerLayer: FC = (props) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = L.DomUtil.create('div', 'marker-react');
    setRef(el);
  }, []);

  if (ref) {
    return ReactDom.createPortal(
      props.children,
      ref,
    );
  } else {
    return null;
  }
};

export default MakerLayer;
