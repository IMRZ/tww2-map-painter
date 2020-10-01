import regions from './regions.json';

export default {
  key: 'vortex',
  name: 'Eye of the Vortex',
  map: {
    image: require('./wh2_main_great_vortex_map.png') as string,
    imageText:  require('./wh2_main_great_vortex_map_text.png') as string,
    width: 3376,
    height: 3868,
  },
  regions,
};
