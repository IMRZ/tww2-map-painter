import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';

import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged } from '../../store/factions';

const RegionPath: FC<{ region: any }> = ({ region }) => {
  const dispatch = useAppDispatch();
  const selectedFaction = useAppSelector((state) => state.painter.selectedFaction);
  const isModeInteractive = useAppSelector((state) => state.painter.mode === 'interactive');


  const onClick = () => {
    if (isModeInteractive) {
      dispatch(regionChanged(region.key));
    } else {
      dispatch(regionOwnerChanged([region.key, selectedFaction]));
    }
  };

  const fill = useAppSelector((state) => {
    const factionKey = state.painter.ownership[region.key];
    return factionKey
      ? state.painter.factions[factionKey].color
      : 'transparent';
  });

  return (
    <path
      onClick={onClick}
      className="leaflet-interactive"
      d={region.d}
      style={{ fill: fill, fillOpacity: 0.4, stroke: 'black', strokeWidth: 1 }}
    />
  );
};

const RegionPaths: FC<{ selectedMap: any }> = ({ selectedMap }) => {
  return (
    <>
      {Object.values(selectedMap.regions).map((region: any) => (
        <RegionPath key={region.key} region={region} />
      ))}
    </>
  );
};

type RegionSvgLayerProp = {
  map?: React.MutableRefObject<L.Map>,
  selectedMap: any,
  bounds: any,
};

const RegionSvgLayer: FC<RegionSvgLayerProp> = ({ map, selectedMap, bounds }) => {
  const [svgElem, setSvgElem] = React.useState<SVGSVGElement>();

  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('version', '1.1');
    svgElement.setAttribute('viewBox', `0 0 ${bounds[1][1]} ${bounds[1][0]}`);
    L.svgOverlay(svgElement, bounds).addTo(leafletMap);
    setSvgElem(svgElement);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!svgElem) return null;

  return ReactDOM.createPortal(<RegionPaths selectedMap={selectedMap} />, svgElem as any);
};

export default RegionSvgLayer;
