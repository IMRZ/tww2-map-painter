import { createContext, useContext, useMemo } from 'react';
import L from 'leaflet';

type MapContextState = React.MutableRefObject<{
  map?: L.Map;
  layers: any;
  waitFor: Promise<void>[];
  bounds: L.LatLngBoundsLiteral;
  campaign: any;
}>;

export const MapContext = createContext<MapContextState | null>(null);

export function useMapContext() {
  const context = useContext(MapContext);

  const state = useMemo(() => {
    return {
      get map(): L.Map {
        return context?.current.map!;
      },
      get layers(): any {
        return context?.current.layers!;
      },
      get waitFor(): Promise<void>[] {
        return context?.current.waitFor!;
      },
      get bounds(): L.LatLngBoundsLiteral {
        return context?.current.bounds!;
      },
      get campaign(): any {
        return context?.current.campaign!;
      }
    };
  }, [context]);

  return state;
}
