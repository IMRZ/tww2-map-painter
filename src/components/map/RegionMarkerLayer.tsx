import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { makeStyles } from '@material-ui/core/styles';
import { useMapContext } from './map';
import assets from '../../assets';

import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged, mapOverlayCreated } from '../../store/painter';

const useStyles = makeStyles({
  pointer: {
    animation: `$myEffect 2s infinite`,
    position: 'absolute',
    pointerEvents: 'none'
  },
  "@keyframes myEffect": {
    "0%": {
      transform: "translateY(-4px)"
    },
    "50%": {
      transform: "translateY(-16px)"
    },
    "100%": {
      transform: "translateY(-4px)"
    }
  },
});

const abandonedIcon = assets['icons/abandoned'];
const pointerArrowIcon = assets['icons/pointer_arrow'];

const RegionMarkerLayer = () => {
  const [elems, setElems] = React.useState<[HTMLElement, any][]>([]);

  const dispatch = useAppDispatch();
  const context = useMapContext();

  React.useEffect(() => {
    const { map, campaign, layers } = context;
    const elements: [HTMLElement, any][] = [];

    const markers = Object.values(campaign.regions).map((region: any) => {
      const { x, y } = region.settlement;
      const el = document.createElement('div');
      el.setAttribute('style', 'display: flex; height: 0; width: 0; align-items: center; justify-content: center; position: relative;');
      const icon = createPortalMarker({ element: el });
      const marker = L.marker([y, x], { icon });
      elements.push([el, region]);
      return marker;
    });

    setElems(elements);

    const layer = L.layerGroup(markers);
    map.addLayer(layer);
    layers['region-owner-markers'] = layer
    dispatch(mapOverlayCreated({
      key: 'region-owner-markers',
      label: 'Region owner makers',
      visible: true,
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // attach portals to current tree
  return <>{elems.map(([e, region]) => ReactDOM.createPortal(<Marker regionKey={region.key} />, e))}</>
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

const Marker = ({ regionKey }: any) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const selectedFaction = useAppSelector((state) => state.painter.selectedFaction);
  const isSelectedRegion = useAppSelector((state) => state.painter.selectedRegion === regionKey);
  const isModeInteractive = useAppSelector((state) => state.painter.mode === 'interactive');

  const icon = useAppSelector((state) => {
    const factionKey = state.painter.ownership[regionKey];
    return factionKey
      ? state.painter.factions[factionKey].icon
      : abandonedIcon
  });

  const onClick = () => {
    if (isModeInteractive) {
      dispatch(regionChanged(regionKey));
    } else {
      dispatch(regionOwnerChanged([regionKey, selectedFaction]));
    }
  };

  return (
    <>
      {isModeInteractive && isSelectedRegion && (
        <img
          className={classes.pointer}
          style={{ position: 'absolute', top: -48, pointerEvents: 'none' }}
          src={pointerArrowIcon}
          alt=""
        />
      )}
      <img
        style={{ height: 24, width: 24, flexShrink: 0 }}
        src={icon} alt=""
        onClick={onClick}
      />
    </>
  );
};

export default RegionMarkerLayer;
