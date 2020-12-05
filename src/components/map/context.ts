import { createContext, useContext, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import L from 'leaflet';
import { overlayCreated } from './reducer';

type MapLayerLookup = { [key: string]: L.Layer };

type MapContextState = React.MutableRefObject<{
  map?: L.Map;
  layers: MapLayerLookup;
  waitFor: Promise<void>[];
  bounds: L.LatLngBoundsLiteral;
  campaign: BaseCampaign;
}>;

export type BaseCampaign = {
  key: string;
  name: string;
  map: {
    image: string;
    imageText: string;
    width: number;
    height: number;
  };
  img: {
    width: number;
    height: number;
  };
  game: {
    width: number;
    height: number;
  };
};

export const MapContext = createContext<MapContextState | null>(null);

export function useMapContext<C extends BaseCampaign = BaseCampaign>() {
  const context = useContext(MapContext);
  const dispatch = useDispatch();

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
      get campaign(): C {
        return context?.current.campaign! as C;
      },
      addOverlay: (key: string, label: string, layer: L.Layer) => {
        context!.current.layers[key] = layer;
        dispatch(overlayCreated([key, label]));
      },
      toMapLatLng([y, x]: L.LatLngTuple): L.LatLngTuple {
        const image = context?.current.campaign.img!;
        const game = context?.current.campaign.game!;
        return [y * (image.height / game.height), x * (image.width / game.width)];
      },
    };
  }, [context, dispatch]);

  return state;
}

export function createSvgElement(imageWidth: number, imageHeight: number) {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('viewBox', `0 0 ${imageWidth} ${imageHeight}`);
  svgElement.setAttribute('style', 'contain: paint;');
  return svgElement;
}
