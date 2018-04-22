export * from './translate';
export * from './available';

export const translations = require.context("./", true, /\.json$/);
translations.keys().forEach(translations);
