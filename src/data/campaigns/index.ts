import type { Campaign } from '../../types/Campaign';
import mortal from './mortal';
import vortex from './vortex';

export default {
  mortal,
  vortex,
} as { [key: string]: Campaign };
