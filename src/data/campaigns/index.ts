import mortal from './mortal';
import vortex from './vortex';

type Campaign = {
  readonly key: string;
  readonly name: string;
  readonly map: {
    readonly image: string;
    readonly imageText: string;
    readonly width: number;
    readonly height: number;
  };
  readonly regions: any;
};

export default {
  mortal,
  vortex,
} as { [key: string]: Campaign };
