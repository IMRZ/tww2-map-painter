import regions from './regions.json';

export default {
  key: 'vortex',
  name: 'Eye of the Vortex',
  map: require('./wh2_main_great_vortex_map.png') as string,
  mapText: require('./wh2_main_great_vortex_map_text.png') as string,
  width: 3376,
  height: 3868,
  regions,
};
