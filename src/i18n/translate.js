import { availableLanguages } from './available';

export const navigatorLanguage = (
  navigator.language.split('-')[0]
);

/* eslint-disable */
export let currentLanguage = (
  availableLanguages.indexOf(navigatorLanguage) >= 0 ? navigatorLanguage : 'en'
);

export const loadTranslations = (l) => {
  currentLanguage = l;
  return require(`./${ l }.json`);
};
