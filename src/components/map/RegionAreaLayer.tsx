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
    const { map, bounds, campaign } = context;

    const svgElement = createSvgElement(campaign.map.width, campaign.map.height);
    const layer = L.svgOverlay(svgElement, bounds);
    map.addLayer(layer);
    context.addOverlay('region-paths', 'Region paths', layer);
    setSvgElem(svgElement);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (svgElem === null) return null;

  const regionpaths = Object.values(context.campaign.regions).map((region: any) => (
    <RegionPath key={region.key} region={region} />
  ));

  return ReactDOM.createPortal(regionpaths, svgElem);
};

type Region = {
  key: string;
  d: string;
};

const RegionPath = (props: { region: Region }) => {
  const { region } = props;
  const { fillColor, onClickRegion } = useRegionPath(region);
  const pathStyle = { fill: fillColor, fillOpacity: 0.4, stroke: 'black', strokeWidth: 1 };

  return (
    <path className="leaflet-interactive" onClick={onClickRegion} d={region.d} style={pathStyle} />
  );
};

function useRegionPath(region: Region) {
  const fillColor = useAppSelector((state) => {
    const factionKey = state.painter.ownership[region.key];
    return factionKey ? state.painter.factions[factionKey].color : 'transparent';
  });

  const dispatch = useAppDispatch();
  const isModeInteractive = useAppSelector((state) => state.painter.mode === 'interactive');
  const selectedFaction = useAppSelector((state) => state.painter.selectedFaction);
  const onClickRegion = React.useCallback(() => {
    if (isModeInteractive) {
      dispatch(regionChanged(region.key));
    } else {
      dispatch(regionOwnerChanged([region.key, selectedFaction]));
    }
  }, [region.key, dispatch, isModeInteractive, selectedFaction]);

  return {
    fillColor,
    onClickRegion,
  };
}

export default RegionAreaLayer;
