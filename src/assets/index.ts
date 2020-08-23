// @ts-nocheck
const requireAsset = require.context('.', true, /^.+\.png$/);
const assets = requireAsset.keys().reduce((accumulator, imageName) => {
  const [/* fullMatch */, key] = imageName.match(/^\.\/(.+)\.png$/);
  accumulator[key] = requireAsset(imageName);
  return accumulator;
}, {});

export default assets as Record<string, string>;
