import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import L from 'leaflet';
import { makeStyles } from '@material-ui/core/styles';
import { useMapContext, createSvgElement } from './map';
import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged } from '../../store/painter';
import { Region } from '../../data/campaigns';

const useStyles = makeStyles({
  path: {
    fillOpacity: 0.4,
    stroke: 'rgba(0, 0, 0, 0.4)',
    strokeWidth: 1,
    '&:hover': {
      fillOpacity: 0.6,
      stroke: 'rgba(0, 0, 0, 0.6)',
    }
  }
});

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

const RegionPath = (props: { region: Region }) => {
  const classes = useStyles();
  const { region } = props;
  const { fillColor, onClickRegion } = useRegionPath(region);
  const fillStyle = { fill: fillColor };

  return (
    <path className={clsx('leaflet-interactive', classes.path)} onClick={onClickRegion} d={region.d} style={fillStyle} />
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
