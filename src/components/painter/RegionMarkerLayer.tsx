import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { makeStyles } from '@material-ui/core/styles';
import { useMapContext } from '../map/context';
import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged } from '../../store/painter';
import type { Campaign } from '../../data/campaigns';

import assets from '../../assets';
const abandonedIcon = assets['icons/abandoned'];
const pointerArrowIcon = assets['icons/pointer_arrow'];

const useStyles = makeStyles({
  pointer: {
    animation: '$arrowBounce 2s infinite',
    position: 'absolute',
    pointerEvents: 'none',
    top: -48,
  },
  marker: {
    height: 24,
    width: 24,
    flexShrink: 0,
    filter: 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.6))',
    '&:hover': {
      filter: 'drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.4))',
    }
  },
  '@keyframes arrowBounce': {
    '0%': {
      transform: 'translateY(-4px)',
    },
    '50%': {
      transform: 'translateY(-16px)',
    },
    '100%': {
      transform: 'translateY(-4px)',
    },
  },
});

// TODO: cleanup #useEffect....
const RegionMarkerLayer = () => {
  const context = useMapContext<Campaign>();
  const [elems, setElems] = React.useState<[HTMLElement, any][]>([]);

  React.useEffect(() => {
    const { map, campaign, toMapLatLng } = context;
    const elements: [HTMLElement, any][] = [];

    const markers = Object.values(campaign.regions).map((region: any) => {
      const [y, x] = toMapLatLng([region.settlement.y, region.settlement.x]);
      const el = document.createElement('div');
      el.setAttribute(
        'style',
        'display: flex; height: 0; width: 0; align-items: center; justify-content: center; position: relative;'
      );
      const icon = createPortalMarker({ element: el });
      const marker = L.marker([y, x], { icon });
      elements.push([el, region]);
      return marker;
    });
    setElems(elements);

    const layer = L.layerGroup(markers);
    map.addLayer(layer);
    context.addOverlay('region-markers', 'Region owner markers', layer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {elems.map(([e, region]) =>
        ReactDOM.createPortal(<RegionMarker regionKey={region.key} />, e)
      )}
    </>
  );
};

const PortalMarker = L.DivIcon.extend({
  options: {
    element: null,
  },
  createIcon() {
    return this.options.element;
  },
});

function createPortalMarker(options: any) {
  // @ts-ignore
  return new PortalMarker(options);
}

const RegionMarker = (props: { regionKey: string }) => {
  const { regionKey } = props;
  const classes = useStyles();
  const { icon, showPointerArrow, onClickMarker } = useRegionMarker(regionKey);

  return (
    <>
      {showPointerArrow && (
        <img className={classes.pointer} src={pointerArrowIcon} alt="" />
      )}
      <img className={classes.marker} onClick={onClickMarker} src={icon} alt="" />
    </>
  );
};

function useRegionMarker(regionKey: string) {
  const icon = useAppSelector((state) => {
    const factionKey = state.painter.ownership[regionKey];
    return factionKey ? state.painter.factions[factionKey].icon : abandonedIcon;
  });

  const showPointerArrow = useAppSelector((state) => {
    const isModeInteractive = state.painter.mode === 'interactive';
    const isSelectedRegion = state.painter.selectedRegion === regionKey;
    return isModeInteractive && isSelectedRegion;
  });

  const dispatch = useAppDispatch();
  const isModeInteractive = useAppSelector((state) => state.painter.mode === 'interactive');
  const selectedFaction =  useAppSelector((state) => state.painter.selectedFaction);

  const onClickMarker = React.useCallback(() => {
    if (isModeInteractive) {
      dispatch(regionChanged(regionKey));
    } else {
      dispatch(regionOwnerChanged([regionKey, selectedFaction]));
    }
  }, [regionKey, dispatch, isModeInteractive, selectedFaction]);

  return {
    icon,
    showPointerArrow,
    onClickMarker,
  };
}

export default RegionMarkerLayer;
