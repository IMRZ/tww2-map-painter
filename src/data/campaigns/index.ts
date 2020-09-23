import { Campaign } from '../../types/Campaign';
import mortal from './mortal';
import vortex from './vortex';

type Campaigns = Readonly<{ [K in keyof typeof campaigns]: Campaign }>;

const campaigns = Object.freeze({
  mortal,
  vortex,
});

export default campaigns as Campaigns;
