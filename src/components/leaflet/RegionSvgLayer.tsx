import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { useMapContext } from './map-context';
import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged, mapOverlayCreated } from '../../store/painter';

const RegionSvgLayer = () => {
  const [svgElem, setSvgElem] = React.useState<SVGSVGElement>();

  const dispatch = useAppDispatch();
  const context = useMapContext();

  React.useEffect(() => {
    const { map, layers, bounds } = context;
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('version', '1.1');
    svgElement.setAttribute('viewBox', `0 0 ${bounds[1][1]} ${bounds[1][0]}`);
    const layer = L.svgOverlay(svgElement, bounds);
    map.addLayer(layer);
    layers['region-paths'] = layer;
    dispatch(mapOverlayCreated({
      key: 'region-paths',
      label: 'Region paths',
      visible: true,
    }));
    setSvgElem(svgElement);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!svgElem) return null;

  return ReactDOM.createPortal(<RegionPaths selectedMap={context.campaign} />, svgElem as any);
};

const RegionPath = ({ region }: any) => {
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

const RegionPaths = ({ selectedMap }: any) => {
  return (
    <>
      {Object.values(selectedMap.regions).map((region: any) => (
        <RegionPath key={region.key} region={region} />
      ))}
    </>
  );
};

export default RegionSvgLayer;
