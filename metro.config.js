const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db',
  // Adds support for `.ttf` files for fonts
  'ttf',
  'otf',
  // Adds support for vector icons
  'ttf'
)

module.exports = config


