import regionsJson from './regions.json';

interface Region {
  readonly key: string;
  readonly name: string;
  readonly fill: string;
  readonly d: string;
  readonly isCapital: boolean;
  readonly province: {
    readonly name: string;
    readonly fill: string;
  };
  readonly climate: string;
  readonly settlement: {
    readonly x: number;
    readonly y: number;
    readonly port: boolean;
    readonly fortress: null;
    readonly strategicLocations: never[];
    readonly strategicResources: never[];
  };
};

export default regionsJson as any as { [key: string]: Region;  };
