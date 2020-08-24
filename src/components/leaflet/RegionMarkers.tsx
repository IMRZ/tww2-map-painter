import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { makeStyles } from '@material-ui/core/styles';

import assets from '../../assets';

import { useAppSelector, useAppDispatch } from '../../store';
import { regionChanged, regionOwnerChanged, mapOverlayCreated } from '../../store/factions';

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

const Marker: FC<{ regionKey: string }> = ({ regionKey }) => {
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

type Props = {
  map?: React.MutableRefObject<L.Map>,
  refs?: any,
  selectedMap: any,
};

const PortalMarkers: FC<Props> = ({ map, refs, selectedMap }) => {
  const [elems, setElems] = React.useState<[HTMLElement, any][]>([]);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const leafletMap = map!.current; // TODO: let it throw?

    const elements: [HTMLElement, any][] = [];

    const markers = Object.values(selectedMap.regions).map((region: any) => {
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
    leafletMap.addLayer(layer);
    refs.current['region-owner-markers'] = layer
    dispatch(mapOverlayCreated({
      key: 'region-owner-markers',
      label: 'Region owner makers',
      visible: true,
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // attach portals to current tree
  return <>{elems.map(([e, region]) => ReactDOM.createPortal(<Marker regionKey={region.key} />, e))}</>
};

export default PortalMarkers;
