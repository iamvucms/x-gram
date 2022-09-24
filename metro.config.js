const { getDefaultConfig } = require('metro-config')

module.exports = (async () => {
  const {
    resolver: { sourceExts },
  } = await getDefaultConfig()
  return {
    transformer: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
    resolver: {
      sourceExts: [...sourceExts, 'cjs'],
    },
  }
})()
