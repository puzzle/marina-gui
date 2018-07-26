const translations = require.context('./', true, /\.json$/);

export const availableLanguages = translations
  .keys()
  .map(item => item.replace(/\.\/(\w+)\.json$/, '$1'));
