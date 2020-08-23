import React, { FC, useEffect, useState } from 'react';
import ReactDom from 'react-dom';

const Marker: FC = (props) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRef(document.createElement('div'));
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

export default Marker;
