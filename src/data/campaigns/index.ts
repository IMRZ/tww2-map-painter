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

const campaigns = Object.freeze({
  mortal,
  vortex,
});

export default campaigns as Readonly<{ [K in keyof typeof campaigns]: Campaign }>;
