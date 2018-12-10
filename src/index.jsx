import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addTranslationForLanguage, initialize } from 'react-localize-redux';

import './common/stylesheets/styles.css';

import { App, store } from './app';
import { availableLanguages, currentLanguage, loadTranslations } from './i18n';
import { unregisterServiceWorker } from './common/service.helper';

// eslint-disable-next-line
store.dispatch(initialize(availableLanguages, { defaultLanguage: currentLanguage, missingTranslationMsg: '${key}' }));
availableLanguages.forEach(lang => store.dispatch(addTranslationForLanguage(loadTranslations(lang), lang)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

unregisterServiceWorker();
