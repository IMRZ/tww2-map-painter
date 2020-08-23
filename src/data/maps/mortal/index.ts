import regions from './regions.json';

export default {
  key: 'mortal',
  name: 'Mortal Empires',
  map: require('./wh_main_map.png') as string,
  mapText: require('./wh_main_map_text.png') as string,
  width: 4096,
  height: 3352,
  regions,
};
