import React from 'react';
import { useSelector } from 'react-redux';

const style = {
  flex: 1,
};

const RegionPane = () => {
  const { selectedRegion } = useSelector((state: any) => state.region);

  return (
    <div style={style}>
      <pre>{selectedRegion?.name}</pre>
    </div>
  );
};

export default RegionPane;
