import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { useMapContext, createSvgElement } from './map';
import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged } from '../../store/painter';

const RegionAreaLayer = () => {
  const [svgElem, setSvgElem] = useState<SVGSVGElement | null>(null);
  const context = useMapContext();

  React.useEffect(() => {
    const { map, bounds, campaign, addOverlay } = context;

    const svgElement = createSvgElement(campaign.width, campaign.height);
    const layer = L.svgOverlay(svgElement, bounds);
    map.addLayer(layer);
    addOverlay('region-paths', 'Region paths', layer);
    setSvgElem(svgElement);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (svgElem === null) return null;

  return ReactDOM.createPortal(<RegionPaths selectedMap={context.campaign} />, svgElem);
};

const RegionPaths = ({ selectedMap }: any) => {
  const paths = Object.values(selectedMap.regions).map((region: any) => (
    <RegionPath key={region.key} region={region} />
  ));
  return <>{paths}</>;
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
    return factionKey ? state.painter.factions[factionKey].color : 'transparent';
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

export default RegionAreaLayer;
