import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {addTranslationForLanguage, initialize} from 'react-localize-redux';

import {store, registerServiceWorker, App} from './app';
import {availableLanguages, currentLanguage, loadTranslations} from './i18n'

import 'bootstrap/fonts/glyphicons-halflings-regular.eot';
import './common/stylesheets/styles.css';

store.dispatch(initialize(availableLanguages, {defaultLanguage: currentLanguage}));
availableLanguages.forEach(lang => store.dispatch(addTranslationForLanguage(loadTranslations(lang), lang)));

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
