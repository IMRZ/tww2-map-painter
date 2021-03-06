import mortal from './mortal';
import vortex from './vortex';

const campaigns = Object.freeze({
  mortal,
  vortex,
});

export interface Campaign {
  readonly key: string;
  readonly name: string;
  readonly map: {
    readonly image: string;
    readonly imageText: string;
    readonly width: number;
    readonly height: number;
  };
  readonly img: any;
  readonly game: any;
  readonly regions: Record<any, Region>;
}

export interface Region {
  readonly key: string;
  readonly name: string;
  readonly fill: string;
  readonly d: string;
  readonly settlement: {
    readonly x: number;
    readonly y: number;
  };
  readonly province: any;
}

export type CampaignKey = keyof typeof campaigns;
export type CampaignLookup = Readonly<{ [key in CampaignKey]: Campaign }>;

export default campaigns as CampaignLookup;
