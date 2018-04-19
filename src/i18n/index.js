const translations = require.context("./", true, /\.json$/);
translations.keys().forEach(translations);
