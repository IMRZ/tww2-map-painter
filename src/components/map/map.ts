import { createContext, useContext, useMemo } from 'react';
import L from 'leaflet';
import { useAppDispatch } from '../../store';
import { mapOverlayCreated } from '../../store/painter';
import { Campaign } from '../../data/campaigns';

type MapLayerLookup = { [key: string]: L.Layer };

type MapContextState = React.MutableRefObject<{
  map?: L.Map;
  layers: MapLayerLookup;
  waitFor: Promise<void>[];
  bounds: L.LatLngBoundsLiteral;
  campaign: Campaign;
}>;

export const MapContext = createContext<MapContextState | null>(null);

export function useMapContext() {
  const context = useContext(MapContext);
  const dispatch = useAppDispatch();

  const state = useMemo(() => {
    return {
      get map(): L.Map {
        return context?.current.map!;
      },
      get layers(): MapLayerLookup {
        return context?.current.layers!;
      },
      get waitFor(): Promise<void>[] {
        return context?.current.waitFor!;
      },
      get bounds(): L.LatLngBoundsLiteral {
        return context?.current.bounds!;
      },
      get campaign(): Campaign {
        return context?.current.campaign!;
      },
      addOverlay: (key: string, label: string, layer: L.Layer) => {
        context!.current.layers[key] = layer;
        dispatch(mapOverlayCreated({
          key: key,
          label: label,
          visible: true,
        }));
      },
    };
  }, [context, dispatch]);

  return state;
}

export function createSvgElement(imageWidth: number, imageHeight: number) {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('version', '1.1');
  svgElement.setAttribute('viewBox', `0 0 ${imageWidth} ${imageHeight}`);
  return svgElement;
}
