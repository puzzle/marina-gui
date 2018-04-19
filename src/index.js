import React from 'react';
import ReactDOM from 'react-dom';
import available from './i18n/available';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

require('./i18n/index');

const navigatorLanguage = (
  navigator.language.split('-')[0]
);

export let currentLanguage = (
  available.hasOwnProperty(navigatorLanguage) ? navigatorLanguage : 'en'
);

export const loadTranslations = (l) => {
  currentLanguage = l;
  return require(`./i18n/${ l }.json`);
};

const translations = loadTranslations(currentLanguage);
ReactDOM.render(
  <App translations={translations}/>,
  document.getElementById('root')
);
registerServiceWorker();


