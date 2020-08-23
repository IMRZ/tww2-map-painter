// @ts-nocheck
const requireContext = require.context('.', true, /^.+\.json$/);

const presets = requireContext.keys().reduce((accumulator, filename) => {
  if (filename.endsWith('map.json')) return accumulator;

  const [/* dot */, campaign, key] = filename.split('/');
  const meta = requireContext(filename);

  const mapJsonFilename = filename.replace('meta.json', 'map.json');
  const mapJson = requireContext(mapJsonFilename);

  if (accumulator[campaign] === undefined) {
    accumulator[campaign] = {};
  }

  accumulator[campaign][key] = {
    ...meta,
    ownership: mapJson,
  };


  return accumulator;
}, {});

export default presets as { [key: string]: any };
