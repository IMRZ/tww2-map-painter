import regions from './regions.json';

export default {
  key: 'mortal',
  name: 'Mortal Empires',
  map: {
    image: require('./wh_main_map.png') as string,
    imageText:  require('./wh_main_map_text.png') as string,
    width: 4096,
    height: 3352,
  },
  img: {
    width: 4096,
    height: 3352,
  },
  game: {
    width: 1016,
    height: 720,
  },
  regions,
};
